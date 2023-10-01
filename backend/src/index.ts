import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
const bcryptPassword = require("bcrypt");
app.use(cors()); // change later
app.use(express.json());

// Menu Section Routes
app.get("/menu-section", async (req, res) => {
  const menuSections = await prisma.menuSection.findMany({
    include: {
      items: true,
    },
  });
  res.json(menuSections);
});

app.post("/menu-section", async (req, res) => {
  const menuSection = await prisma.menuSection.create({
    data: {
      ...req.body,
    },
  });
  res.json(menuSection);
});

app.delete("/menu-section/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.menuSection.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(user);
});

app.put("/menu-section/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.menuSection.update({
    where: { id: Number(id) },
    data: { ...req.body },
  });
  res.json(post);
});

// Menu Item Routes
app.post("/menu-item", async (req, res) => {
  const menuItem = await prisma.menuItem.create({
    data: {
      ...req.body,
    },
  });
  res.json(menuItem);
});

app.delete("/menu-item/:id", async (req, res) => {
  const { id } = req.params;
  const menuItem = await prisma.menuItem.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(menuItem);
});

app.put("/menu-item/:id", async (req, res) => {
  const { id } = req.params;
  const menuItem = await prisma.menuItem.update({
    where: { id: Number(id) },
    data: { ...req.body },
  });
  res.json(menuItem);
});

// session. Do later
/*app.use(
  session({
    secret: 'test-secret-key',
    resave: false,
    saveUninitialized: true,
  })
)*/

// make the exisiting password into hashed passwords.
// call only once.
async function updateHashedPasswords() {
  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });
    }
    console.log("Passwords updated correctly");
  } catch (error) {
    console.error("updating wrong", error);
  } finally {
    await prisma.$disconnect();
  }
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful" });
});

app.post("/rewards-member-add", async (req, res) => {
  const { phoneNumber, points } = req.body;

  try {
    const member = await prisma.rewardsMember.create({
      data: {
        phoneNumber: phoneNumber,
        points: points,
        pendingPoints: 0,
      },
    });
    res.status(200).json(member);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log(errorMessage);
    res.status(400).json({ error: `Failed to create member: ${errorMessage}` });
  }
});

app.post("/rewards-member-check", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.json({ exists: false });
      return;
    }

    res.json({
      exists: true,
      phoneNumber: member.phoneNumber,
      points: member.points,
      pendingPoints: member.pendingPoints,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log(errorMessage);
    res.status(400).json({
      error: `Failed to retrieve member: ${errorMessage}`,
    });
  }
});

app.put("/rewards-member-revert-pending", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }
    const newPointsBalance = member.points + member.pendingPoints;

    const updatedMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: {
        points: newPointsBalance,
        pendingPoints: 0,
      },
    });

    res.json({
      points: updatedMember.points,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      error: `Failed to revert pending points: ${errorMessage}`,
    });
  }
});

app.put("/rewards-member-pend-spend", async (req, res) => {
  const { phoneNumber, spendingPoints } = req.body;

  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }
    const newAvailablePoints = member.points - spendingPoints;

    if (newAvailablePoints < 0) {
      res.status(400).json({ error: "Not enough points to spend" });
      return;
    }

    const updatedMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: {
        points: newAvailablePoints,
        pendingPoints: (member.pendingPoints || 0) + spendingPoints,
      },
    });

    res.json({
      points: updatedMember.points,
      pendingPoints: updatedMember.pendingPoints,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ error: `Failed to pend points for spending: ${errorMessage}` });
  }
});

app.put("/rewards-member-update", async (req, res) => {
  const { phoneNumber, newPoints } = req.body;
  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    const updateMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: { points: newPoints },
    });
    res.json(updateMember);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      error: `Failed to update points: ${errorMessage}`,
    });
  }
});

app.put("/rewards-member-spend", async (req, res) => {
  const { phoneNumber, spentPoints, currDiscount, subtotal } = req.body;
  try {
    if (currDiscount >= subtotal) {
      return;
    }
    let newPoints;
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    console.log(`Member points: ${member.points}`);

    if (member.points <= 0) {
      console.log("You have no points to spend!!!");
      newPoints = 0; //this is to prevent negative points
    } else if (spentPoints > member.points) {
      console.log("Not enough points to spend the specified amount.");
      return res.status(400).json({
        error: "Not enough points to spend the specified amount.",
      });
    } else {
      console.log(`Member.points: ${member.points}`);
      console.log(`Spent points: ${spentPoints}`);

      newPoints = member.points - spentPoints;
    }

    const updatedMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: { points: newPoints },
    });

    res.json({
      points: updatedMember.points,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      error: `Failed to spend points: ${errorMessage}`,
    });
  }
});

app.put("/rewards-member-revert", async (req, res) => {
  const { phoneNumber, spentPoints } = req.body;
  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    const revertedPoints = member.points + spentPoints;
    console.log("PhoneNumber: ", phoneNumber);
    console.log("Received spentPoints: ", spentPoints);
    console.log("Member's Current Points: ", member.points);
    console.log("Reverted Points: ", revertedPoints);
    const updatedMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: { points: revertedPoints },
    });
    res.json({
      points: updatedMember.points,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      error: `Failed to revert points: ${errorMessage}`,
    });
  }
});
app.delete("/rewards-member-delete", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const member = await prisma.rewardsMember.delete({
      where: { phoneNumber: phoneNumber },
    });
    res.json(member);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ error: `Failed to delete member: ${errorMessage}` });
  }
});

app.post("/payment", cors(), async (req, res) => {
  const { amount, id } = req.body;

  if (!amount || !id) {
    return res.status(400).json({ message: "Amount and ID are required." });
  }
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Tea-Rex",
      payment_method: id,
      confirm: true,
      return_url: process.env.RETURN_URL || "http://localhost:5173",
    });

    res.json({
      clientSecret: payment.client_secret,
      message: "Payment successful",
      success: true,
    });
  } catch (error: any) {
    res.json({
      message: "Payment failed " + error.message,
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
