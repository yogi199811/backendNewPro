import express from "express";
import User from "../model/user.model.js";

const router = express.Router();

router.route("/users").get(async (req, res) => {

    const {page,limit,sort} = req.query

    const skip = (page -1) * limit

    
  const getAllUsers = await User.find({isActive:true})


  const totalUsers  = await User.countDocuments({isActive:false})

  return res.status(200).json({
    message: "get all the users",
    success: true,
    users: getAllUsers,
    totalUsers,
    currentPage:page,
    totalPages :Math.ceil(totalUsers/limit)
  });
});

router.route("/users/:id").get(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        message: "can not find user by this ID",
        success: false,
      });
    }

    const findUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      message: "user find Successfuly",
      findUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.route("/users/:id").put(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      message: "can not find user by this ID",
      success: false,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, {
    name: req.body.name,
  });

  return res.status(200).json({
    message: "user update successfully",
    updatedUser,
  });
});

router.route("/users").post(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log(req.body);

    if (!name || !email || !password) {
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
      name,
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

router.route("/users/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;

    if(!id) return

    const user = await User.findByIdAndUpdate(
        id,
        {isActive:false}
    );

    if (!user) {
      return res.status(400).json({
        message: "can not find user by this ID and delete",
        success: false,
      });
    }

    return res.status(200).json({
      message: "user Deleted Successfuly",
      success: true,
      deleteUser: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
