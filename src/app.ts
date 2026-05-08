import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = [
  "http://localhost:8081", // expo mobile
  "http://localhost:5173", // vite web devs
  "https://whisper-master.vercel.app", // production web
  process.env.FRONTEND_URL, // production fallback
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      // If frontend URL is set to '*' or the origin is explicitly allowed,
      // we reflect the actual origin to avoid CORS credential errors with '*'
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow credentials from client (cookies, authorization headers, etc.)
  })
);

app.use(express.json()); // parses incoming JSON request bodies and makes them available as req.body in your route handlers
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// error handlers must come after all the routes and other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
app.use(errorHandler);



export default app;
