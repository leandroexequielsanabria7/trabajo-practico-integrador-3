import { model, Schema } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minLength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxLength: [50, "El nombre no puede superar 50 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minLength: [2, "El apellido debe tener al menos 2 caracteres"],
      maxLength: [50, "El apellido no puede superar 50 caracteres"],
    },
    birthDate: { type: Date },
    phone: { type: String, trim: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "El username es obligatorio"],
      unique: true,
      trim: true,
      minLength: [3, "El username debe tener al menos 3 caracteres"],
      maxLength: [20, "El username no puede superar 20 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      select: false,
    },
    role: {
      type: String,
      enum: { values: ["user", "admin"], message: "El rol {VALUE} no es válido" },
      default: "user",
    },
    profile: { type: profileSchema, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});

export const UserModel = model("User", userSchema);