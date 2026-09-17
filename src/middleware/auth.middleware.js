import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    console.log(accessToken);
    if (!accessToken) {
        throw new ApiError(400, "User is not authentcated");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(400, "Authentication failed");
    }

    req.user = user;

    next();

})

export default verifyJWT
