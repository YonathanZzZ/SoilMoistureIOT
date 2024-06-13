import { Request, Response } from "express";
import { SessionUser } from "../types/sessionUser.interface";
import {
  addDevice,
  deleteDevice,
  getAllDevicesByUserID,
  updateDevice,
} from "../services/device.service";
import { HttpStatus } from "../httpStatuses";
import zod from "zod";

export const getAllUserDevices = async (req: Request, res: Response) => {
  const userID = (req.user as SessionUser).id;
  const devicesData = await getAllDevicesByUserID(userID);
  if (!devicesData) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.json(devicesData);
};

const DeviceDataSchema = zod.object({
  name: zod.string(),
  description: zod.string().optional(),
});

export const addDeviceToUser = async (req: Request, res: Response) => {
  const schemaCheck = DeviceDataSchema.safeParse(req.body);
  if (!schemaCheck.success) {
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const data = schemaCheck.data;
  const userID = (req.user as SessionUser).id;

  const deviceData = await addDevice(userID, data);

  res.json(deviceData);
};

const uuidSchema = zod.string().uuid();

export const deleteDeviceFromUser = async (req: Request, res: Response) => {
  const schemaCheck = uuidSchema.safeParse(req.params.uuid);
  if(!schemaCheck.success){
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const deviceUUID = schemaCheck.data; 

  const userID = (req.user as SessionUser).id;

  const deleteRes = await deleteDevice(userID, deviceUUID);
  if(!deleteRes){
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.sendStatus(HttpStatus.OK);
};

const updateSchema = zod.object({
  name: zod.string().optional(),
  description: zod.string().optional()
});

export const updateUserDevice = async (req: Request, res: Response) => {
  const schemaCheck = uuidSchema.safeParse(req.params.uuid);
  if(!schemaCheck.success){
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const deviceUUID = schemaCheck.data;

  const updateSchemaCheck = updateSchema.safeParse(req.body);
  if(!updateSchemaCheck.success){
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const updateData = updateSchemaCheck.data;

  const userID = (req.user as SessionUser).id;

  const updateRes = await updateDevice(userID, deviceUUID, updateData);
  if(!updateRes){
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  res.sendStatus(HttpStatus.OK);
}
