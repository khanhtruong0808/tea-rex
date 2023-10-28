export const config = {
  port: process.env.PORT || 5000,
  stripeSecret: process.env.STRIPE_SECRET_KEY || "",
  originUrl: process.env.ORIGIN_URL || "http://localhost:5173",
  sessionSecret: process.env.SESSION_SECRET || "I2DuwJ5wBrgJH2Ew",
  secure: process.env.SECURE || false,
  emailUsername: process.env.EMAIL_USER || "",
  emailPassword: process.env.EMAIL_PASS || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};
