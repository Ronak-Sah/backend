import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    // get user data
    // validation
    // check username and email already exist
    // check image files
    // upload on coudinary and get link
    // make object
    // store in db
    // console.log(req.body);
    const { userName, email, fullName, password } = req.body;

    if (userName == "" || email == "" || !email.endsWith("@gmail.com")) {
        throw new ApiError(400, "Enter valid username and email");
    }
    if (fullName == "") {
        throw new ApiError(400, "Enter name");
    }

    if (password == "") {
        throw new ApiError(400, "Password empty");
    }

    const user = await User.findOne({
        $or: [
            { userName },
            { email }
        ]
    })

    if (user) {
        throw new ApiError(400, "User already exists in database");
    }

    console.log("Username, name, email validation done");

    const avatarFilepath = req.files?.avatar?.[0]?.path;
    const coverImageFilepath = req.files?.coverImage[0]?.path;

    if (!avatarFilepath || !coverImageFilepath) {
        throw new ApiError(400, "Image and cover image not reicived");
    }

    const avatarUploadResponse = await uploadOnCloudinary(avatarFilepath);
    const coverImageUploadResponse = await uploadOnCloudinary(coverImageFilepath);

    if (coverImageUploadResponse == null || avatarUploadResponse == null) {
        throw new ApiError(400, "Error occured while uploading on cloudinary");
    }

    console.log("Avatar and cover image uploaded");

    const userObject = await User.create({
        userName: userName,
        email: email,
        fullName: fullName,
        avatar: avatarUploadResponse.secure_url,
        coverImage: coverImageUploadResponse.secure_url,
        password: password
    })

    console.log("User created");

    return res.status(200).json(new ApiResponse(
        200,
        userObject,
        "Success"
    ))

}

)


const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "Username or email required");
    }

    if (!password) {
        throw new ApiError(400, "Password required");
    }

    console.log("userName:", userName);
    console.log("email:", email);
    console.log("password:", password);

    const user = await User.findOne({
        $or: [
            { userName },
            { email }
        ]
    })

    if (!user) {
        throw new ApiError(400, "No account exists");
    }
    if (!(await user.isPasswordCorrect(password))) {
        throw new ApiError(400, "Incorrect password");
    }

    const accessToken = await user.generateAccessTokens();
    const refreshToken = await user.generateRefreshTokens();



    user.refreshToken = refreshToken;

    const response = await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "Login successfull"
        ))
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(400, "Session expired");
    }

    const userObject = await User.findById(user._id);

    if (!userObject) {
        throw new ApiError(400, "User not exists");
    }

    userObject.refreshToken = "";

    await userObject.save({ validateBeforeSave: false });

    return res
        .status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json(new ApiResponse(200, "User logget out successfully"));
})
export { registerUser, loginUser, logoutUser };
