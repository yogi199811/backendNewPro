import express from "express";
import User from "../model/user.model.js";

const router = express.Router();

router.route("/signup").post(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const createUser = await User.findById(newUser._id).select("-password");

    console.log(createUser);

    return res.status(200).json({
      message: "user created successfully",
      user: createUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.route("/signin").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: " email and password is require",
      });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        message: "User Does Not Exist",
      });
    }

    const isPasswordValid = await userExist.isPasswordCorrect(password);

    if (!isPasswordValid) {
      res
        .json({
          message: "password is not valid",
        })
        .status(400);
    }

    const token = await userExist.generateToken();

    const user = await User.findById(userExist._id).select("-password")

    return res.status(200).json({
      message: "User Login Successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong from server",
    });
  }
});

export default router;
