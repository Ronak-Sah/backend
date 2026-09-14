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
    watchHistort: [
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
        required: true
    }


}, { timestamps: true });

userSchema.pre('save', async () => {
    bcrypt.hash(myPlaintextPassword, 10, (err, hash) => {
        this.password = myPlaintextPassword;
    });
});

userSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessTokens = async () => {
    jwt.sign({
        exp: process.env.ACCESS_TOKEN_EXPIRY,
        data: {
            _id: this._id,
            fullName: this.fullName,
            userName: this.userName,
            email: this.email

        }
    }, process.env.ACCESS_TOKEN);

}

userSchema.methods.generateRefreshTokens = async () => {
    jwt.sign({
        exp: process.env.REFRESH_TOKEN_EXPIRY,
        data: {
            _id: this._id,
            fullName: this.fullName,
            userName: this.userName,
            email: this.email

        }
    }, process.env.REFRESH_TOKEN);

}

const User = mongoose.model('User', userSchema);

export { User }