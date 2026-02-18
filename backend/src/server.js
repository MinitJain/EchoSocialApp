import dotenv from "dotenv";
import app from "./app.js";

import databaseConnection from "../config/database.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

databaseConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
