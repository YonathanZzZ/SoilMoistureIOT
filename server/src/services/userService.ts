import {PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

interface UserUpdate {
    email?: string;
    password?: string; //hashed password
}

export const createUser = async (userData: User) => {
    await prisma.user.create({
        data: userData,
    });
}

export const deleteUser = async (email: string) => {
    await prisma.user.delete({
        where: {
            email: email
        }
    });
}

export const getUser = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    });
}

export const updateUser = async (email: string, update: UserUpdate) => {
    await prisma.user.update({
        where: {
            email: email
        },
        data: update
    });
}

