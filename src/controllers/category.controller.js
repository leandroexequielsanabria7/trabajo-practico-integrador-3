import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req);
    const newCategory = await CategoryModel.create(data);
    return res.status(201).json({ msg: "Categoría creada correctamente", data: newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return res.status(200).json({ total: categories.length, data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const category = await CategoryModel.findById(id).populate({
      path: "events",
      select: "title startDate status categories",
    });
    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    return res.status(200).json({ data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req);
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    return res.status(200).json({ msg: "Categoría actualizada correctamente", data: updatedCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    return res.status(200).json({ msg: "Categoría eliminada y quitada de todos sus eventos" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};