const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cardRoutes = require("./routes/cardRoutes"); // Import modular route handlers
const errorHandler = require("./middlewares/errorHandler"); // Import error handling middleware

dotenv.config();
const app = express();
const port = process.env.PORT || 3000; // Use a default port if PORT environment variable is not defined

app.use(express.json());

// Serve static images
app.use("/tarotdeck", express.static(path.join(__dirname, "images")));

// Mount the cardRoutes router
app.use("/cards", cardRoutes);

// Handle errors using the errorHandler middleware
app.use(errorHandler);

// Only start server if not in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
