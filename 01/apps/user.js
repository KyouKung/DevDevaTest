import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import multer from "multer";

const multerUpload = multer({ dest: "uploads/" });
const upload = multerUpload.fields([{ name: "image" }]);

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("users");
    const users = await collection.find({}).toArray();

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: `${error}` });
  }
});

userRouter.get("/:nameSurname", async (req, res) => {
  try {
    const nameSurname = req.params.nameSurname;
    const collection = db.collection("users");
    const users = await collection
      .find({ $or: [{ firstName: nameSurname }, { lastName: nameSurname }] })
      .toArray();

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No user found with that firstname or surname" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: `${error}` });
  }
});

userRouter.post("/", upload, async (req, res) => {
  try {
    const collection = db.collection("users");
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
    };

    if (req.files && req.files.image) {
      const imageData = fs.readFileSync(req.files.image[0].path);
      const base64Image = Buffer.from(imageData).toString("base64");
      newUser.image = base64Image;
    }

    await collection.insertOne(newUser);

    if (req.files && req.files.image) {
      fs.unlinkSync(req.files.image[0].path);
    }

    return res.status(201).json({
      message: `User has been created successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: `${error}` });
  }
});

userRouter.put("/:id", upload, async (req, res) => {
  try {
    const collection = db.collection("users");
    const userId = new ObjectId(req.params.id);
    const updatedUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
    };

    if (req.files && req.files.image) {
      const imageData = fs.readFileSync(req.files.image[0].path);
      const base64Image = Buffer.from(imageData).toString("base64");
      updatedUser.image = base64Image;
    }

    await collection.updateOne({ _id: userId }, { $set: updatedUser });

    if (req.files && req.files.image) {
      fs.unlinkSync(req.files.image[0].path);
    }

    return res.status(200).json({
      message: `User has been updated successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: `${error}` });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("users");
    const userId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: userId });

    return res.status(200).json({
      message: `User has been deleted successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting user", error: `${error}` });
  }
});

export default userRouter;
