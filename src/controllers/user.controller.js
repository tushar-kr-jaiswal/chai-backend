import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // get details of user from frontend
    // validate the fields
    // check if user already exists: username , email
    // upload avatar and coverimage to server
    // upload avatar and coverimage to cloudinary
    // user creation - create entry in db
    // remove password and refreshToken from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body;
    // console.table(fullName, email, username, password);

    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(404, "All fields are required");
    }
    if (!email.includes("@")) {
        throw new ApiError(404, "@ is required in email.");
    }

    const existedUser = await User.findOne({
        // checking if the user already created or not
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with Email or Username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!!!");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required!!!");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id)?.select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});

export { registerUser };
