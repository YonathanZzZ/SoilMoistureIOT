import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface UserUpdate {
  email?: string;
  password?: string; //hashed password
}

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
};

export const deleteUserByEmail = async (email: string) => {
  await prisma.user.delete({
    where: {
      email: email,
    },
  });
};

export const deleteUserByID = async (id: number) => {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });
};

export const getUser = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const getUserByID = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const updateUserByID = async (id: number, update: UserUpdate) => {
  return prisma.user.update({
    where: {
      id: id,
    },
    data: update,
  });
};

export const updateUserByEmail = async (email: string, update: UserUpdate) => {
  return prisma.user.update({
    where: {
      email: email,
    },
    data: update,
  });
};
