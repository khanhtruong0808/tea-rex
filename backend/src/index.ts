import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username, password },
    
  });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.password === password) {
    res.status(200).json({ message: 'Login successful' });
  } 
  else {
    res.status(401).json({ message: 'Invalid password' });
  }
}); 
app.post("/payment", cors(), async (req, res) => {
  let { amount, id } = req.body;

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
