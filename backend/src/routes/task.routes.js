import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllTasks, uploadAndDistributeCSV, getTasksByAgentId } from "../controllers/task.controller.js";

const router = Router();

router.route("/upload").post(upload.single("csvFile"), uploadAndDistributeCSV)
router.route("/").get(getAllTasks)
router.route("/agents/:id").get(getTasksByAgentId)


export default router;