import {User} from '../models/user.js';
import bcrypt from "bcryptjs";
import "dotenv/config";
import asyncHandler from "express-async-handler";
import crypto from "crypto";



export const refreshTokenHandle = async (req, res) => {
    const requestToken = req.headers.refresh_token;
    const decoded_token = decodeToken(requestToken);
    const refresh_token = decoded_token.id.slice(0, -2);
    User.find({ _id: refresh_token }).then((user) => {
      if (user) {
        const accessToken = generateToken(user._id, "1d");
        res.status(200).json({ access_token: accessToken });
      }
    });
  };

//   get user information
export const getUserInfo = asyncHandler(async (req, res) => {
    const {authorization} = req.headers;
    const decoded_token = decodeToken(authorization);
    const currentTimestamp = Math.floor(Date.now() / 1000);

  });