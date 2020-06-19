import * as mongoose from "mongoose";

const { Schema } = mongoose;

interface iUser extends mongoose.Document {
    login: string,
    password: string,
}

const userSchema = new Schema({
    login: { required: true, type: String },
    password: { required: true, type: String }
})

export const User = mongoose.model<iUser>("user", userSchema);