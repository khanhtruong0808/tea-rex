export const config = {
  baseApiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  cloverPrinterApiToken:
    import.meta.env.VITE_APP_CLOVER_PRINTER_API_TOKEN || "",
};
