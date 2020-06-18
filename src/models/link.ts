import * as mongoose from "mongoose";

const { Schema } = mongoose;

export interface iLink extends mongoose.Document {
    url: string,
    id: string
}

const LinkSchema = new Schema({
    url: { required: true, type: String },
    id: { required: true, type: String },
})

export const Link = mongoose.model<iLink>("link", LinkSchema);