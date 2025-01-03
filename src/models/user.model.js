import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudinary URL
            required: true,
        },
        coverImage: {
            type: String, // cloudinary URL
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String, // Bcrypt library
            required: [true, "Password is reqiured"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    //  Using a middleware to encode the password before saving it.
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // returns boolean by comparing the hashed and normal password
};

userSchema.methods.generateAccessToken = function () {
    // for short period of time
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
            // console.log("Access Token generated")
        );
    } catch (error) {
        console.error("Error generating access token:", error);
        return null;
    }
};

userSchema.methods.generateRefreshToken = function () {
    // for longer period of time
    try {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
            // console.log("Refresh Token generated")
        );
    } catch (error) {
        console.error("Error generating refresh token:", error);
        return null;
    }
};

export const User = mongoose.model("User", userSchema);
