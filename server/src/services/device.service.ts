import { Device, PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const prisma = new PrismaClient();

interface DeviceUpdate {
  name?: string;
  description?: string;
}

interface DeviceData {
  name: string;
  description?: string;
}

export const addDevice = async (userID: number ,deviceData: DeviceData) => {
  const secretKey = uuid();
  const hashedSecretKey = await bcrypt.hash(secretKey, SALT_ROUNDS);

  const data = { userID: userID, secretKey: hashedSecretKey, ...deviceData };
  const device = await prisma.device.create({ data: data });

  return {deviceID: device.uuid, secretKey: secretKey};
};

export const getAllDevicesByUserID = (userID: number) => {
  return prisma.device.findMany({
    where: { userID: userID },
    select: { uuid: true, name: true, description: true },
  });
};

export const updateDevice = (userID: number, uuid: string, update: DeviceUpdate) => {
  return prisma.device.update({
    where: { uuid: uuid, user: {id: userID} },
    data: update,
  });
};

export const deleteDevice = async (userID: number, uuid: string) => {
  const deleteRes = await prisma.device.deleteMany({
    where: {uuid: uuid, user: {id: userID} },
  });

  return deleteRes.count > 0;
};

export const checkDeviceAuth = async (deviceID: string, secretKey: string) => {
  const device = await prisma.device.findUnique({where: {uuid: deviceID}});
  if(!device){
    return false;
  }

  const hashedSecretKey = device.secretKey;
  const compareRes = await bcrypt.compare(secretKey, hashedSecretKey);

  return compareRes;
}

