import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

export const model = mongoose.model('Admin', AdminSchema);
