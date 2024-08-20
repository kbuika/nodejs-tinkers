require("dotenv").config();
export const port = process.env.PORT || 3000;
export const dbUsername = process.env.DB_USERNAME || "postgres";
export const dbPassword = process.env.DB_PASSWORD;
export const dbHost = process.env.DB_HOST || "localhost";
export const dbPort = process.env.DB_PORT || 5432;
export const dbName = process.env.DB_NAME || "postgres";
