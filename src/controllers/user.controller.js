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
    const {userName, email, fullName, password}=req.body;

    if(userName=="" || email=="" || !email.endsWith("@gmail.com")){
        throw new ApiError(400,"Enter valid username and email");
    }
    if(fullName==""){
        throw new ApiError(400,"Enter name");
    }

    if(password==""){
        throw new ApiError(400,"Password empty");
    }

    const user=await User.findOne({
        $or: [
            { userName },
            { email }
        ]
    })
    
    if(user){
        throw new ApiError(400,"User already exists in database");
    }

    console.log("Username, name, email validation done");

    const avatarFilepath = req.files?.avatar?.[0]?.path;
    const coverImageFilepath = req.files?.coverImage[0]?.path;

    if(!avatarFilepath || !coverImageFilepath){
        throw new ApiError(400,"Image and cover image not reicived");
    }

    const avatarUploadResponse = await uploadOnCloudinary(avatarFilepath);
    const coverImageUploadResponse = await uploadOnCloudinary(coverImageFilepath);

    if(coverImageUploadResponse==null || avatarUploadResponse==null){
        throw new ApiError(400,"Error occured while uploading on cloudinary");
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

export { registerUser };
