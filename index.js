import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import session from "session-exp";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

//Access to the database server has been blocked in connection with database updates.

// mongoose
//   .connect(process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const __dirname = path.resolve();
const PORT = process.env.PORT||3000;
const app = express();

app.use(express.json());
//allow JSON data

app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!`);
});
app.use(session({secret: 'your-secret-key',resave: false,saveUninitialized: true,cookie: { secure: true }}));
app.use("/api/user", userRouter); //api/user
app.use("/api/auth", authRouter); //api/auth
app.use("/api/listing", listingRouter); //api/listing

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//Errors Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
