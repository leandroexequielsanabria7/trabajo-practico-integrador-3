import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";
import { toDotNotation } from "../helpers/update.helper.js";

const eventsPopulate = { path: "events", select: "title startDate status organizer" };

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null }).populate(eventsPopulate);

    return res.status(200).json({ total: users.length, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await UserModel.findOne({ _id: id, deletedAt: null }).populate(eventsPopulate);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: toDotNotation(data, "profile") },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Usuario actualizado correctamente", data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const deletedUser = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { returnDocument: "after" },
    );

    if (!deletedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado o ya eliminado" });
    }

    const { deletedCount } = await EventModel.deleteMany({ organizer: id });

    return res.status(200).json({
      msg: "Usuario eliminado lógicamente junto con sus eventos",
      data: { _id: deletedUser._id, deletedAt: deletedUser.deletedAt, deletedEvents: deletedCount },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};