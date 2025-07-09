import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!email || !fullName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ fullName, email, password });

    if (!user) {
        throw new ApiError(400, "Failed to create user");
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(400, "Failed to create user");
    }

    res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    

    const options = {
        httpOnly: true,
        // Set 'secure: true' only in production (HTTPS). For development, you may want to set it to false.
        secure: process.env.NODE_ENV === "production"
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        );
});

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
};

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ user });
});

export {
    registerUser,
    loginUser,
    getUserProfile
}

