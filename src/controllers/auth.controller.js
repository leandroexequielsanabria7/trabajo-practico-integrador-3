import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { toDotNotation } from "../helpers/update.helper.js";

const cookieOptions = {
  httpOnly: true, 
  secure: process.env.NODE_ENV === "production", 
  sameSite: "strict", 
};

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = matchedData(req);

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    const user = newUser.toJSON();
    delete user.password; 

    return res.status(201).json({ msg: "Usuario registrado correctamente", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    const user = await UserModel.findOne({ email, deletedAt: null }).select("+password");
    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); // 1 hora

    return res.status(200).json({
      msg: "Login exitoso",
      data: { _id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "events",
      select: "title startDate status organizer",
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req);

    if (!data.profile) {
      return res.status(400).json({ msg: "No se envió ningún dato del perfil para actualizar" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: toDotNotation(data, "profile") },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({ msg: "Perfil actualizado correctamente", data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};