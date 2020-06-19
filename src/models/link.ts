import * as mongoose from "mongoose";

const { Schema } = mongoose;

interface iLink extends mongoose.Document {
    url: string,
    id: string,
    author: string,
    clicks: number
}

const linkSchema = new Schema({
    url: { required: true, type: String },
    author: { required: true, type: String },
    id: { required: true, type: String },
    clicks: { required: true, type: Number },
})

export const Link = mongoose.model<iLink>("link", linkSchema);