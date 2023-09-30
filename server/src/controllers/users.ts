import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user';
import { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email }, secret);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token: `${token}`,
  };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne<UserDocument>({
      email: req.body.email,
    });

    console.log(user);

    if (user) {
      return res.status(403).json({ message: 'User is already resgistered', data: null });
    }
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    console.log('newUser', newUser);
    const savedUser = await newUser.save();
    console.log('savedUser', savedUser);

    res.status(201).json(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    }).select('+password');

    const errors = { emailOrPassword: 'Incorrect email or password' };

    if (!user) {
      return res.status(401).json(errors);
    }

    const isSamePassword = await user.validatePassword(req.body.password);

    if (!isSamePassword) {
      return res.status(401).json(errors);
    }

    console.log('user', user);

    res.json(normalizeUser(user));
  } catch (err) {
    next(err);
  }
};

export const currentUser = (req: ExpressRequestInterface, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'invalid user token', data: null });
  }
  res.send(normalizeUser(req.user as UserDocument));
};
