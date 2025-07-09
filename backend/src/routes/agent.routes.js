import { Router } from "express";
import { 
  loginAgent, 
  registerAgent, 
  getAllAgents, 
  getAgentById, 
  updateAgent, 
  deleteAgent 
} from "../controllers/agent.controller.js";

const router = Router();

router.route("/register").post(registerAgent);
router.route("/login").post(loginAgent);
router.route("/").get( getAllAgents);
router.route("/:id")
  .get(getAgentById)
  .put(updateAgent)
  .delete(deleteAgent);

export default router;