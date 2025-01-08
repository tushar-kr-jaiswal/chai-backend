import mongoose, { Schema } from "mongoose";
const playlistSchema = new Schema(
    {
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);
export const Playlist = mongoose.model("Playlist", playlistSchema);
