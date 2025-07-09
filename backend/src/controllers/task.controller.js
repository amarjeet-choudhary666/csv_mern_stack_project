import fs from "fs";
import { Agent } from "../models/agent.model.js";
import { Task } from "../models/task.model.js"; 
import { parseCSV } from "../utils/csvProcessor.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";




const uploadAndDistributeCSV = asyncHandler(async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "CSV file is missing"));
  }

  try {
    const rawTasks = await parseCSV(filePath);

    const tasks = rawTasks
      .map((task) => ({
        firstName: task.firstName?.trim(),
        phone: task.phone?.trim(),
        notes: task.notes?.trim() || "",
      }))
      .filter((t) => t.firstName && t.phone);

    if (!tasks.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          "No valid tasks found in CSV. Ensure headers are 'firstName, phone, notes'"
        )
      );
    }

    const agents = await Agent.find();
    if (!agents.length) {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "No agents found. Please add agents first.")
        );
    }

    const distributed = agents.map(() => []);
    tasks.forEach((task, i) => {
      distributed[i % agents.length].push(task);
    });

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (const task of distributed[i]) {
        try {
          await Task.create({
            firstName: task.firstName,
            phone: task.phone,
            notes: task.notes,
            agentId: agent._id
          });
        } catch (err) {
          console.error(
            `❌ Failed to create task for agent ${agent._id}:`,
            err.message
          );
        }
      }
    }

    fs.unlinkSync(filePath);

    res
      .status(200)
      .json(
        new ApiResponse(200, distributed, "✅ Tasks uploaded and distributed successfully")
      );
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("CSV Upload Error:", error);
    throw new ApiError(
      500,
      "Error distributing tasks: " + (error?.message || error)
    );
  }
});




 const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()

  

  res.status(200).json({
    success: true,
    data: tasks,
    message: "All tasks fetched successfully",
  });
});




 const getTasksByAgentId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ApiError(400, "Invalid agent ID");
  }

  const tasks = await Task.find({ assignedTo: id });

  if (!tasks || tasks.length === 0) {
    throw new ApiError(404, "No tasks found for this agent");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched for agent"));
});


export { uploadAndDistributeCSV, getAllTasks, getTasksByAgentId };