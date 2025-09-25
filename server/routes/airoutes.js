import express from "express";
import { generateAritcle } from "../controllers/aiController.js";
import { auth } from "../middlewares/auth.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateAritcle);

export default aiRouter;