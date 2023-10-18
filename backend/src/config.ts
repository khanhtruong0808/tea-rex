export const config = {
  port: process.env.PORT || 5000,
  stripeSecret: process.env.STRIPE_SECRET_KEY || "",
  originUrl: process.env.ORIGIN_URL || "http://localhost:5173",
  sessionSecret: process.env.SESSION_SECRET || "I2DuwJ5wBrgJH2Ew",
  NODE_ENV: process.env.NODE_ENV || "development",
};
