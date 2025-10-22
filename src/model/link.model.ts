import mongoose, { Schema, Document } from "mongoose";

export interface Click {
  ip: string | undefined;
  userAgent?: string | undefined;
  createdAt: Date;
}

export interface LinkDocument extends Document {
  code: string;
  url: string;
  userId?: string | undefined;        // optional: undefined if anonymous
  createdAt: Date;
  expiresAt?: Date;       // only for anonymous links
  revoked: boolean;       // revoked = true means no longer active
  clicks: Click[];        // array of click info
}

const clickSchema = new Schema<Click>({
  ip: { type: String, required: true },
  userAgent: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

const linkSchema = new Schema<LinkDocument>(
  {
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    expiresAt: { type: Date },
    revoked: { type: Boolean, default: false },
    clicks: { type: [clickSchema], default: [] },
  },
  { timestamps: true }
);

export const LinkModel = mongoose.model<LinkDocument>("Link", linkSchema);
