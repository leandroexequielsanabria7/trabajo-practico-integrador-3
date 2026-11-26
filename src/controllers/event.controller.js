import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";
import { toDotNotation } from "../helpers/update.helper.js";

const populateOptions = [
  { path: "organizer", select: "username email" },
  { path: "categories", select: "name" },
];

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req);
    const newEvent = await EventModel.create({
      ...data,
      organizer: req.user._id, // el organizador es quien está logueado
    });
    await newEvent.populate(populateOptions);
    return res.status(201).json({ msg: "Evento creado correctamente", data: newEvent });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find().sort({ startDate: 1 }).populate(populateOptions);
    return res.status(200).json({ total: events.length, data: events });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ organizer: req.user._id })
      .sort({ startDate: 1 })
      .populate(populateOptions);
    return res.status(200).json({ total: events.length, data: events });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const event = await EventModel.findById(id).populate(populateOptions);
    if (!event) {
      return res.status(404).json({ msg: "Evento no encontrado" });
    }
    return res.status(200).json({ data: event });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req);
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      { $set: toDotNotation(data, "location") },
      { returnDocument: "after", runValidators: true },
    ).populate(populateOptions);
    return res.status(200).json({ msg: "Evento actualizado correctamente", data: updatedEvent });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = matchedData(req);
    await EventModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Evento eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};