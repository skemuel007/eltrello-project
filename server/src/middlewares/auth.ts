import { NextFunction, Response } from "express";
import { secret } from "../config";
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { UserDocument } from "../types/user.interface";

export default async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({message: "invalid user token", data: null});
        }

        const token = authHeader.split(" ")[1];
        const data = jwt.verify(token, secret) as { id: string; email: string};

        const user = await UserModel.findById<UserDocument>(data.id);

        if (!user) {
            res.status(401).json({message: "Invalid user credentials", data: null})
        }

        req.user = user;
        next();

    }catch(err) {
        return res.status(401).json({message: "invalid user token", data: null})
    }
}