import { NextFunction, Request, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import BoardModel  from '../models/board';

export const getBoards = async(req: ExpressRequestInterface, res: Response, next: NextFunction) => {

    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const boards = await BoardModel.find({userId: req.user?.id});
        res.send(boards).status(200);
        
    }catch (err) {
        next(err);
    }
}

export const createBoard = async(req: ExpressRequestInterface, res: Response, next: NextFunction) => {

    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const newBoard = new BoardModel({
            title: req.body.title,
            userId: req.user.id
        });
        const savedBoard = await newBoard.save();
        res.send(savedBoard).status(201);
        
    }catch (err) {
        next(err);
    }
}