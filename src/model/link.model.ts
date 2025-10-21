import mongoose, { Schema, Document } from "mongoose";

export interface LinkDocument extends Document {
  code: string;          // short code
  url: string;           // original URL
  userId?: string;       // optional: undefined if anonymous
  createdAt: Date;
  expiresAt?: Date;      // only for anonymous links
  revoked: boolean;      // revoked = true means no longer active
}

const linkSchema = new Schema<LinkDocument>(
  {
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    expiresAt: { type: Date },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const LinkModel = mongoose.model<LinkDocument>("Link", linkSchema);
