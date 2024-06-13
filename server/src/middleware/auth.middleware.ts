import {NextFunction, Request, Response} from "express";
import { HttpStatus } from "../httpStatuses";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(!req.isAuthenticated()){
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    next();
}