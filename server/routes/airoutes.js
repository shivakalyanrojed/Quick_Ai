import express from "express";
import { generateAritcle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject} from "../controllers/aiController.js";
import { auth } from "../middlewares/auth.js";
import upload from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateAritcle);
aiRouter.post('/generate-blog-title',auth,generateBlogTitle);
aiRouter.post('/generate-image',auth,generateImage);
aiRouter.post('/remove-image-background',upload.single('image'), auth,removeImageBackground);
aiRouter.post('/remove-image-object', upload.single('image'), auth,removeImageObject);




export default aiRouter;