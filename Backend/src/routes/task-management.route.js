import { Router } from "express";
import { createtask } from "../controllers/task-management.controller.js";
import { getalltasks } from "../controllers/task-management.controller.js";
import { updatetask } from "../controllers/task-management.controller.js";
import { deletetask } from "../controllers/task-management.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.use(verifyJWT)
router.post("/",createtask)
router.get("/",getalltasks)
router.route("/:id").patch(updatetask)
router.route("/:id").delete(deletetask)
export default router