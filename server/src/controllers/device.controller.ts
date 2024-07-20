import { Request, Response } from "express";
import { SessionUser } from "../types/sessionUser.interface";
import {
  addDevice,
  deleteDevice,
  getAllDevicesByUserID,
  updateDevice,
  getDeviceDataById,
} from "../services/device.service";
import { HttpStatus } from "../httpStatuses";
import zod from "zod";

export const getAllUserDevices = async (req: Request, res: Response) => {
  const userId = (req.user as SessionUser).id;
  const devicesData = await getAllDevicesByUserID(userId);
  if (!devicesData) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.json(devicesData);
};

const imageUrlRegex = /\.(jpg|jpeg|png|webp)$/i;

const DeviceDataSchema = zod.object({
  name: zod.string(),
  description: zod.string().optional(),
  image_url: zod
    .string()
    .optional()
    .refine((value) => !value || imageUrlRegex.test(value)),
});

const DeviceDataRequestSchema = zod.object({
  uuid: zod.string().uuid(),
});

export const getDeviceData = async (req: Request, res: Response) => {
  const schemaCheck = DeviceDataRequestSchema.safeParse(req.params);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const deviceId = schemaCheck.data.uuid;

  const userId = (req.user as SessionUser).id;

  const deviceData = await getDeviceDataById(deviceId, userId);
  if (!deviceData) {
    res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.json(deviceData);
};

export const addDeviceToUser = async (req: Request, res: Response) => {
  const schemaCheck = DeviceDataSchema.safeParse(req.body);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const data = schemaCheck.data;
  console.log("data: ", data);
  const userId = (req.user as SessionUser).id;

  const deviceCredentials = await addDevice(userId, data);

  res.json(deviceCredentials);
};

const uuidSchema = zod.string().uuid();

export const deleteDeviceFromUser = async (req: Request, res: Response) => {
  const schemaCheck = uuidSchema.safeParse(req.params.uuid);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const deviceUUID = schemaCheck.data;

  const userId = (req.user as SessionUser).id;

  const deleteRes = await deleteDevice(userId, deviceUUID);
  if (!deleteRes) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.sendStatus(HttpStatus.OK);
};

const updateSchema = zod.object({
  name: zod.string().optional(),
  description: zod.string().optional(),
});

export const updateUserDevice = async (req: Request, res: Response) => {
  const schemaCheck = uuidSchema.safeParse(req.params.uuid);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const deviceUUID = schemaCheck.data;

  const updateSchemaCheck = updateSchema.safeParse(req.body);
  if (!updateSchemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const updateData = updateSchemaCheck.data;

  const userId = (req.user as SessionUser).id;

  const updateRes = await updateDevice(userId, deviceUUID, updateData);
  if (!updateRes) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.sendStatus(HttpStatus.OK);
};
