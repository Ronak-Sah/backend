import mongoose from "mongoose";

const subsriptionSchema = mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


const subsription = mongoose.model("subsription", subsriptionSchema);

export { subsription };