import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import sql from "../configs/db.js";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from "form-data";
import fs from "fs";



const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateAritcle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt,length}=req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false,message:'Free usage limit exceeded. Please upgrade to premium plan.'})
        }
        const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens:length,

});
    const content = response.choices[0].message.content;

    await sql `INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${prompt},${content},'article')`

    if (plan!=='premium'){
        await clerkClient.users.updateUser(userId,{
            privateMetadata:{free_usage:free_usage+1}
        })
    } 
    res.json({success:true,content})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt}=req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false,message:'Free usage limit exceeded. Please upgrade to premium plan.'})
        }
        const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens:100,

});
    const content = response.choices[0].message.content;

    await sql `INSERT INTO creations(user_id,prompt,content,type) VALUES(${userId},${prompt},${content},'blog-title')`

    if (plan!=='premium'){
        await clerkClient.users.updateUser(userId,{
            privateMetadata:{free_usage:free_usage+1}
        })
    } 
    res.json({success:true,content})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const generateImage = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt,publish}=req.body;
        const plan = req.plan;

        if(plan!=='premium'){
            return res.json({success:false,message:'This feature is only for premium subscription'})
        }
        
        const formData = new FormData()
        formData.append('prompt', prompt);
        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: { 
                ...formData.getHeaders(), 
                'x-api-key': process.env.CLIPDROP_API_KEY 
            },
            responseType: 'arraybuffer',
        })

        const base64Image =`data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)


    await sql `INSERT INTO creations(user_id,prompt,content,type,publish) VALUES(${userId},${prompt},${secure_url},'image',${publish ?? false})`

    res.json({success:true,content:secure_url})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}




export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: 'This feature is only for premium subscription' });
        }

        if (!image || !image.buffer) {
            return res.json({ success: false, message: 'No image uploaded' });
        }

        // Prepare form data for ClipDrop
        const formData = new FormData();
        formData.append('image_file', req.file.buffer, { filename: image.originalname });

        // Send to ClipDrop API
        const response = await axios.post(
            'https://clipdrop-api.co/remove-background/v1',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );

        // Upload result to Cloudinary
        const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await sql`INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const object = req.body.object;   // must match frontend "formData.append('object', ...)"
    const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: 'This feature is only for premium subscription' });
    }

    if (!image || !image.buffer) {
      return res.json({ success: false, message: 'No image uploaded' });
    }

    // Convert buffer -> base64 and upload to Cloudinary
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    const uploadRes = await cloudinary.uploader.upload(base64Image, { folder: "object_removal" });

    // Now apply gen_remove transformation
    const imageUrl = cloudinary.url(uploadRes.public_id, {
      transformation: [
        { effect: `gen_remove:${object}` }
      ],
      resource_type: "image"
    });

    // Save in DB
    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES(${userId}, ${`Removed ${object} from the image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

