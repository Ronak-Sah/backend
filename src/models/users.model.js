import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Videos"
        }
    ],
    fullName: {
        type: String,
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,

    }


}, { timestamps: true });

userSchema.pre('save', async function () {

    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    console.log("After:", this.password);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            userName: this.userName,
            email: this.email
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            userName: this.userName,
            email: this.email
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model('User', userSchema);

export { User }