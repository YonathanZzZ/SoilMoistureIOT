import { Measurement, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMeasurement = async (reading: number, uuid: string) => {
  const data = { moisture_percentage: reading, deviceID: uuid };
  await prisma.measurement.create({ data: data });
};

export const getAllMeasurementsByDeviceID = (userID: number, uuid: string) => {
  return prisma.measurement.findMany({
    select: {
      id: true,
      moisture_percentage: true,
    },
    where: {
      deviceID: uuid,
      device: {
        userID: userID,
      },
    },
  });
};

export const deleteMeasurement = async (userID: number, id: number) => {
  const deleted = await prisma.measurement.deleteMany({
    where: {
      id: id,
      device: {
        userID: userID,
      },
    },
  });

  return deleted.count > 0;
};
