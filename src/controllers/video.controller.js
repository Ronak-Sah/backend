import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { VideosModel } from "../models/videos.model.js"


const videoUpload = asyncHandler(async (req, res) => {

    const { description, title } = req.body;

    if (!description || !title) {
        throw new ApiError(400, "Invalid description or title");
    }

    const videoFile = req.files?.videoFile?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    const allowedFormats = [
        "video/mp4",
        "video/webm",
        "video/mpeg",
        "video/quicktime"
    ];

    if (!videoFile || !thumbnail || !allowedFormats.includes(videoFile.mimetype)) {
        throw new ApiError(400, "Invalid video or thumbnail");
    }

    const owner = req.user;
    if (!owner) {
        res.clearCookie("accessToken");
        throw new ApiError(400, "Session expired");
    }


    const uploadVideoResponse = await uploadOnCloudinary(videoFile.path);
    const uploadThumbnailResponse = await uploadOnCloudinary(thumbnail.path);

    if (!uploadVideoResponse || !uploadThumbnailResponse) {
        throw new ApiError(400, "Error occured from cloudinary end");

    }

    console.log(uploadVideoResponse);

    const duration = uploadVideoResponse.duration;

    const videoUploadObject = await VideosModel.create({
        videoFile: uploadVideoResponse.secure_url,
        thumbnail: uploadThumbnailResponse.secure_url,
        owner: req.user._id,
        title: title,
        description: description,
        duration: duration,

    })

    console.log("Video uploaded");

    return res.status(200)
        .json(
            new ApiResponse(200, videoUploadObject, "Video uploaded")
        );

})


export { videoUpload };