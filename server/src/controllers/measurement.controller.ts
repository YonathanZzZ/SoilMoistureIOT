import { Request, Response } from "express";
import zod from 'zod';
import { HttpStatus } from "../httpStatuses";
import { addMeasurement, deleteMeasurement, getAllMeasurementsByDeviceID } from "../services/measurement.service";
import { SessionUser } from "../types/sessionUser.interface";
import { checkDeviceAuth } from "../services/device.service";

const measurementSchema = zod.object({
  measuredValue: zod.number().min(0).max(100) //percent value
});

const authSchema = zod.object({
  deviceID: zod.string().uuid(),
  deviceSecret: zod.string().uuid()
});

export const addMeasurementToDevice = async (req: Request, res: Response) => {
  const schemaCheck = measurementSchema.safeParse(req.body);
  if(!schemaCheck.success){
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const {measuredValue} = schemaCheck.data;

  let authData = {deviceID: req.headers["device-identifier"], deviceSecret: req.headers["device-secret"]};

  const authSchemaCheck = authSchema.safeParse(authData);
  if(!authSchemaCheck.success){
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  const {deviceID, deviceSecret} = authSchemaCheck.data;

  const isAuthorized = await checkDeviceAuth(deviceID, deviceSecret);
  if(!isAuthorized){
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  await addMeasurement(measuredValue, deviceID);
  res.sendStatus(HttpStatus.OK);
};

export const deleteMeasurementFromDevice = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userID = (req.user as SessionUser).id;

  const deleteRes = await deleteMeasurement(userID, id);
  if(!deleteRes){
    return res.sendStatus(HttpStatus.NOT_FOUND); 
  }

  res.sendStatus(HttpStatus.OK);
}

export const getAllMeasurementsOfDevice = async (req: Request, res: Response) => {
  
  const uuid = req.params.uuid;
  const userID = (req.user as SessionUser).id;
  
  const measurements = await getAllMeasurementsByDeviceID(userID, uuid);

  res.json(measurements);
}