import { Router } from "express";
import { createtask } from "../controllers/task-management.controller.js";
const router=Router();
router.post("/create",createtask)
export default router