import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details form frontend
    const { username, email, password, fullName } = req.body;

    // validate all fields
    if (
        [username, email, password, fullName].some(
            (field) => field?.trim === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // find user by username & email to check if there is any existing user with same credentials
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // check for avatar file
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is Required");
    }

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // upload the file to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // check if avatar file uploaded successfully or not
    if (!avatar) {
        throw new ApiError(400, "Avatar File is Required");
    }

    // create an entry in db for user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    //  remove password and refreshToken from user created
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering User");
    }

    //  return res
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );
});

export { registerUser };
