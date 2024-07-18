import { Request, Response } from "express";
import {
  deleteUserByID,
  getUserByEmail,
  getUserByID,
  updateUserByID,
} from "../services/user.service";
import { HttpStatus } from "../httpStatuses";
import { Prisma } from "@prisma/client";
import express from "express";
import { getUser, createUser } from "../services/user.service";
import bcrypt from "bcrypt";
import zod from "zod";
import { SessionUser } from "../types/sessionUser.interface";

const saltRounds = 10;

interface RequestWithUser extends Request {
  user: SessionUser;
}

const emailSchema = zod.string().email();

const passwordSchema = zod
  .string()
  .min(8)
  .refine((password) => /[a-z]/.test(password))
  .refine((password) => /[A-Z]/.test(password))
  .refine((password) => /[0-9]/.test(password));

const userSchema = zod.object({
  name: zod.string(),
  email: emailSchema,
  password: passwordSchema,
});

export const registerWithPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const schemaCheck = userSchema.safeParse(req.body);
    if (!schemaCheck.success) {
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    const { name, email, password } = schemaCheck.data;

    const existingUser = await getUser(email);
    if (existingUser) {
      return res.sendStatus(HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await createUser(name, email, hashedPassword);

    res.sendStatus(HttpStatus.CREATED);
  } catch (error) {
    console.error("error registering a user: ", error);
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const login = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = (req as RequestWithUser).user;
  const userID = user.id;
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  try {
    await deleteUserByID(userID);
    status = HttpStatus.OK;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      status = HttpStatus.NOT_FOUND;
    }
  } finally {
    res.sendStatus(status);
  }
};

const newPasswordSchema = zod.object({
  oldPassword: zod.string(),
  newPassword: passwordSchema,
});

export const updateUserPassword = async (req: Request, res: Response) => {
  const user = (req as RequestWithUser).user;
  const userID = user.id;

  //extract old and new password from body
  const schemaCheck = newPasswordSchema.safeParse(req.body);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const { oldPassword, newPassword } = schemaCheck.data;

  //check that old password is correct
  const userOnDB = await getUserByID(user.id);
  if (!userOnDB) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  const existingPassword = userOnDB.password;
  const isPasswordMatch = await bcrypt.compare(oldPassword, existingPassword);
  if (!isPasswordMatch) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
  const updateData = { password: hashedNewPassword };
  const updateRes = await updateUserByID(userID, updateData);
  if (!updateRes) {
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }

  res.sendStatus(HttpStatus.OK);
};

const emailUpdateSchema = zod.object({
  email: emailSchema,
});

export const updateUserEmail = async (req: Request, res: Response) => {
  const schemaCheck = emailUpdateSchema.safeParse(req.body);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const newEmail = schemaCheck.data.email;
  //check if email is already registered. if so, return CONFLICT status

  const userWithNewEmail = await getUserByEmail(newEmail);
  if (userWithNewEmail) {
    //a user with this email already exists
    return res.sendStatus(HttpStatus.CONFLICT);
  }

  const userID = (req.user as SessionUser).id;
  const updateData = {
    email: newEmail,
  };
  const updateRes = await updateUserByID(userID, updateData);
  if (!updateRes) {
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }

  res.sendStatus(HttpStatus.OK);
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("connect.sid"); // clear the session cookie
  req.logout(function (err) {
    // logout of passport
    req.session.destroy(function (err) {
      // destroy the session
      res.send();
    });
  });
};

export const authCheck = (_req: Request, res: Response) => {
  res.send();
};
