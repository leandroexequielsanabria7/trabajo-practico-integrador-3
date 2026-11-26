import { model, Schema } from "mongoose";
import { EventModel } from "./event.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio"], unique: true, trim: true, minLength: 2, maxLength: 30 },
    description: { type: String, trim: true, maxLength: 200 },
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "categories",
});

categorySchema.pre("findOneAndDelete", async function () {
  const category = await this.model.findOne(this.getFilter());
  if (!category) return;

  await EventModel.updateMany(
    { categories: category._id },
    { $pull: { categories: category._id } },
  );
});

export const CategoryModel = model("Category", categorySchema);