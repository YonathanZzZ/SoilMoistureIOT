import {PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (userData: User) => {
    try{
        const newUser = await prisma.user.create({
            data: userData,
        });
    }catch(error){
        
    }
    
    
}