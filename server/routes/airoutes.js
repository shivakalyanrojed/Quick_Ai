import express from "express";
import { generateAritcle, generateBlogTitle, generateImage, removeImageBackground } from "../controllers/aiController.js";
import { auth } from "../middlewares/auth.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateAritcle);
aiRouter.post('/generate-blog-title',auth,generateBlogTitle);
aiRouter.post('/generate-image',auth,generateImage);
aiRouter.post('/remove-bg',auth,removeImageBackground);


export default aiRouter;