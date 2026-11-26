import { model, Schema, Types } from "mongoose";

const locationSchema = new Schema(
  {
    venue: { type: String, required: [true, "El lugar es obligatorio"], trim: true, minLength: 3, maxLength: 100 },
    address: { type: String, required: [true, "La dirección es obligatoria"], trim: true, minLength: 5, maxLength: 150 },
    city: { type: String, required: [true, "La ciudad es obligatoria"], trim: true, minLength: 2, maxLength: 50 },
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    title: { type: String, required: [true, "El título es obligatorio"], unique: true, trim: true, minLength: 3, maxLength: 150 },
    description: { type: String, required: [true, "La descripción es obligatoria"], trim: true, minLength: 20 },
    startDate: { type: Date, required: [true, "La fecha de inicio es obligatoria"] },
    endDate: { type: Date, required: [true, "La fecha de fin es obligatoria"] },
    capacity: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad mínima es 1"],
      validate: { validator: Number.isInteger, message: "La capacidad debe ser un número entero" },
    },
    price: { type: Number, min: [0, "El precio no puede ser negativo"], default: 0 },
    status: { type: String, enum: ["scheduled", "cancelled", "finished"], default: "scheduled" },
    location: { type: locationSchema, required: true },

    organizer: { type: Types.ObjectId, ref: "User", required: true },

    categories: [{ type: Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true, versionKey: false },
);

export const EventModel = model("Event", eventSchema);