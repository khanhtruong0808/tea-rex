import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";
import { config } from "./config";

declare module "express-session" {
  interface Session {
    user: {
      id: number;
      username: string;
    };
    authorized: boolean;
    isAdmin: boolean;
  }
}

const jwtSecretKey = "testsecretkey";
const prisma = new PrismaClient();
const app = express();
const stripe = require("stripe")(config.stripeSecret);
const emailUsername = config.emailUsername;
const emailPassword = config.emailPassword;
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;


app.use(
  cors({
    origin: config.originUrl,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600,
      secure: config.secure ? true : false,
    },
  })
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
  });
  console.log(req.session.user);
  if (!user) {
    return res.status(401).json();
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json();
  }

  //check if the user is owner or admin
  if (user && user.isOwner == true) {
    const payload = {
      userId: user.id,
      username: user.username,
      accessLevel: "owner",
    };

    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });

    res.json({ token });
  }
  else if (user && user.isAdmin == true) {
      const payload = {
        userId: user.id,
        username: user.username,
        accessLevel: "admin",
      }

      const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
      res.json({ token });
  } else {
    console.log("no user data.");
    res.status(401).json();
  }
});

app.get("/login", async (req, res) => {
  const sessionData = req.session;
  const userId = sessionData.user;

  console.log(userId);
  if (req.session.authorized) {
    res.json(req.session.user);
  } else {
    res.status(401).json();
  }
});

// log out route
app.get("/logout", (req, res) => {
  req.session?.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send();
    }
    res.redirect("/login");
  });
});

//Accounts route
app.get('/hi', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/accounts/:id", async (req, res) => {
  const { id } = req.params
  const updatedUser = {...req.body};

  if (updatedUser.isAdmin) {
    updatedUser.isAdmin = updatedUser.isAdmin === 'true';
  }
  if(updatedUser.password){
    const hashedPassword = await bcrypt.hash(updatedUser.password, 10)
    updatedUser.password = hashedPassword;
  }
  const updatedUsers = await prisma.user.update({
    where: { id: Number(id) },
    data: updatedUser ,
  });

  res.json(updatedUsers);
});

app.delete("/accounts/:id", async (req, res) => {
  const { id } = req.params;
  const updatedUsers = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(updatedUsers);
});

app.post("/accounts", async (req, res) => {
  const newUser = {...req.body};
  if(newUser.password){
    const hashedPassword = await bcrypt.hash(newUser.password, 10)
    newUser.password = hashedPassword;
  }
  if(newUser.isAdmin){
    newUser.isAdmin = newUser.isAdmin === 'true';
  }
  const newAccount = await prisma.user.create({
    data: {
      username: newUser.username,
      password: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    },
  });
  res.json(newAccount);
});

app.post("/send-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.gmail.com",
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        // user: "replace with tea-rex gmail user",
        // pass: "replace with tea-rex gmail password",
        user: emailUsername,
        pass: emailPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `${req.body.from}" <replacewithtearexgmail@gmail.com>`,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    });

    console.log("Message sent: %s", info.messageId);
    res.json({
      success: true,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

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

    if (member.pendingPoints == 0) {
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
  const { phoneNumber, spentPoints } = req.body;
  try {
    const member = await prisma.rewardsMember.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }
    const newAvailablePoints = member.points - spentPoints;

    if (newAvailablePoints < 0) {
      res.status(400).json({ error: "Not enough points to spend" });
      return;
    }

    const updatedMember = await prisma.rewardsMember.update({
      where: { phoneNumber: phoneNumber },
      data: {
        points: newAvailablePoints,
        pendingPoints: (member.pendingPoints || 0) + spentPoints,
      },
    });

    res.json({
      points: updatedMember.points,
      pendingPoints: updatedMember.pendingPoints,
      curentSpentPoints: spentPoints,
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

    if (member.points <= 0) {
      newPoints = 0; //this is to prevent negative points
      return res.status(400).json({
        error: "No points to spend!",
      });
    } else if (spentPoints > member.points) {
      return res.status(400).json({
        error: "Not enough points to spend the specified amount.",
      });
    } else {
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

  if (amount === undefined || !id) {
    return res.status(400).json({ message: "Amount and ID are required." });
  }

  if (amount === 0) {
    return res.json({
      message: "Payment successful. Amount is zero.",
      success: true,
    });
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
    console.log("Payment successful!");
    res.json({
      clientSecret: payment.client_secret,
      message: "Payment successful",
      success: true,
    });
  } catch (error: any) {
    console.log("Payment failure!");
    res.json({
      message: "Payment has failed: " + error.message,
      success: false,
    });
  }
});

// app.post("/calculate-tax", async (req, res) => {
//   const { amount, zipCode } = req.body;
//   try {
//     const calculation = await stripe.tax.calculations.create({
//       currency: "usd",
//       line_items: [
//         {
//           amount: amount,
//           reference: "L1",
//         },
//       ],
//       customer_details: {
//         address: {
//           postal_code: zipCode,
//           country: "US",
//         },
//         address_source: "billing",
//       },
//       expand: ["line_items.data.tax_breakdown"],
//     });

//     if (calculation) {
//       res.json({
//         message: "calculation successful",
//         tax: calculation.tax_amount_exclusive,
//         totalAmount: calculation.amount_total,
//         success: true,
//       });
//     } else {
//       res.json({
//         message: "Could not fetch tax data!",
//         success: true,
//       });
//     }
//   } catch (error: any) {
//     res.json({
//       message: error.message,
//       success: false,
//     });
//   }
// });

// generating cloudinary signature
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

app.get("/cloudinary-signature", async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: "TeaRex",
    },
    config.cloudinaryApiSecret
  );
  res.json({
    signature: signature,
    cloudName: config.cloudinaryCloudName,
    apiKey: config.cloudinaryApiKey,
    timestamp: timestamp,
  });
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
