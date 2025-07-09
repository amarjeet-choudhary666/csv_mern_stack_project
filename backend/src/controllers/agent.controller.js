import { Agent } from "../models/agent.model.js";
import { ApiError } from "../utils/apiError.js"; 
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerAgent = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingAgent = await Agent.findOne({ email });

  if (existingAgent) {
    throw new ApiError(400, "Agent already exists");
  }

  const agent = await Agent.create({ name, email, mobile, password });

  if (!agent) {
    throw new ApiError(400, "Failed to create agent");
  }

  const createdAgent = await Agent.findById(agent._id).select("-password -refreshToken");

  if (!createdAgent) {
    throw new ApiError(400, "Failed to retrieve agent");
  }

  res.status(201).json(
    new ApiResponse(201, { agent: createdAgent }, "Agent registered successfully")
  );
});

const generateAccessTokenAndRefreshToken = async (agentId) => {
  try {
    const agent = await Agent.findById(agentId);
    const accessToken = await agent.generateAccessToken();
    const refreshToken = await agent.generateRefreshToken();
    agent.refreshToken = refreshToken;
    await agent.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const loginAgent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const agent = await Agent.findOne({ email });

  if (!agent) {
    throw new ApiError(401, "Agent not found");
  }

  const isPasswordValid = await agent.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(agent._id);

  const loggedInAgent = await Agent.findById(agent._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { agent: loggedInAgent, accessToken, refreshToken },
        "Agent logged in successfully"
      )
    );
});

const getAllAgents = asyncHandler(async (req, res, next) => {
  try {
    const agents = await Agent.find(); // or your logic
    res.status(200).json({
      success: true,
      data: agents,
      message: "Agents fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error in getAllAgents:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


import mongoose from "mongoose";

const getAgentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid agent ID");
  }

  const agent = await Agent.findById(id).select("-password");
  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  return res.status(200).json(new ApiResponse(200, agent, "Agent fetched"));
});


const updateAgent = asyncHandler(async (req, res) => {
  const { name, email, mobile } = req.body;

  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new ApiError(404, "Agent not found");

  agent.name = name || agent.name;
  agent.email = email || agent.email;
  agent.mobile = mobile || agent.mobile;

  await agent.save();

  const updatedAgent = await Agent.findById(agent._id).select("-password");
  return res.status(200).json(new ApiResponse(200, updatedAgent, "Agent updated successfully"));
});

const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new ApiError(404, "Agent not found");

  await agent.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Agent deleted successfully"));
});

export {
  registerAgent,
  loginAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent
};

