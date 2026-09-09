import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./modules/auth/auth.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default app;
