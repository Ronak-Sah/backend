import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VideosModel } from "../models/videos.model.js";
import { subsription } from "../models/subscriptions.model.js";

const subscribeChannel = asyncHandler(async (req, res) => {
    const videoID = req.params.id;
    const user = req.user;

    if (!videoID || !user) {
        throw new ApiError(400, "Error occured while subscribing");
    }

    const videoUser = await VideosModel.findById(videoID);

    if (!videoUser) {
        throw new ApiError(400, "Channel not exists");
    }

    const subsriptionObject = await subsription.create({
        subscriber: user._id,
        channel: videoUser.owner
    })

    if (!subsriptionObject) {
        throw new ApiError(400, "erro occured while saving in db");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, subsriptionObject, "success")
        );

})

const subscriberCount = asyncHandler(async (req, res) => {
    const videoID = req.params.id;

    if (!videoID) {
        throw new ApiError(400, "Error occured while subscribing");
    }

    console.log(videoID);

    const channel = await VideosModel.findById(videoID);

    if (!channel) {
        throw new ApiError(400, "Channel not exists");
    }
    const channelOwner = channel.owner;

    const subscribers = await subsription.aggregate([
        {
            $match:
            {
                channel: channelOwner
            },
        },
        {
            $lookup:
            {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberMe"
            }

        },
        {
            $addFields:
            {
                subscribedMeCount:
                {
                    $size: "$subscriberMe"
                }
            }
        },


    ])

    const subscribedTo = await subsription.aggregate([

        {
            $match:
            {
                subscriber: channelOwner
            },
        },
        {
            $lookup: {

                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedTo"
            }
        },
        {
            $addFields:
            {
                subscribedToCount:
                {
                    $size: "$subscribedTo"
                }
            }
        }
    ])

    const result = {
        subscribedMe: subscribers.subscribedMe,
        subscribedTo: subscribedTo.subscribedTo,
        subscriberCount: subscribers.length,
        subscribedCount: subscribedTo.length
    };

    return res.status(200)
        .json(
            new ApiResponse(200, result, "success")
        );
})


const unsubscribe = asyncHandler(async (req, res) => {
    const videoID = req.params.id;

    const user = req.user._id;

    const videochannel = await VideosModel.findById(videoID);

    if (!videochannel) {
        throw new ApiError(400, "error occured while fetching user");
    }

    const videoOwner = videochannel.owner;

    const response = await subsription.findOneAndDelete({
        $and: [
            { videoOwner },
            { user }
        ]
    })

    if (!response) {
        throw new ApiError(400, "Not subscribed");

    }

    return res.status(200)
        .json(new ApiResponse(200, response, "success"));


})

export { subscribeChannel, subscriberCount, unsubscribe };