import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import passport from "passport";
import * as redis from "redis";
import "./strategies/init_strategies";
import userRouter from "./routers/user.router";
import deviceRouter from "./routers/device.router";
import bodyParser from "body-parser";
import { User } from "@prisma/client";
import { getUserByID } from "./services/user.service";
import cors from 'cors';
import measurementRouter from "./routers/measurement.router";
const RedisStore = require("connect-redis").default;
const MS_IN_MIN = 1000 * 60;
const isProduction = process.env.NODE_ENV === "production" ? true : false;
const PORT = process.env.PORT;

const app = express();

app.use(cors({
  origin: "http://localhost:3000", //TODO use env var for client host
  credentials: true //allow cookies
}));

const redisClient = redis.createClient();

redisClient.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, //don't save empty session in the store
    resave: false, //do not save session to store if it wasn't modified during the request
    cookie: {
      secure: isProduction, //allow saving cookie via HTTPS only
      httpOnly: true, // client side js can't read the cookie
      maxAge: 30 * MS_IN_MIN, //30 min
    },
  })
);

passport.serializeUser((user, done) => {
  const u = user as User;
  done(null, u.id);
});

passport.deserializeUser(async (userID: number, done) => {
  try {
    const user = await getUserByID(userID);
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRouter);
app.use("/devices", deviceRouter);
app.use("/measurements", measurementRouter);

const server = app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});

export default server;
