import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { pics } from "../../config/mongoCollections.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.VITE_BUCKET_REGION1,
  credentials: {
    accessKeyId: process.env.VITE_ACCESS_KEY1,
    secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY1
  }
});

const bucketName = process.env.VITE_BUCKET_NAME1;

// Generate a unique filename
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Upload endpoint
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Resize image
    const fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 1080, width: 1920, fit: "contain" })
      .toBuffer();

    // Generate unique filename
    const fileName = generateFileName();
    const fileType = req.file.mimetype;

    // Upload to S3
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: fileType
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Save to MongoDB
    const picsCollection = await pics();
    const newPicDoc = {
      fileName: fileName,
      originalName: req.file.originalname,
      contentType: fileType,
      caption: req.body.caption || "",
      uploadDate: new Date().toISOString()
    };

    const insertInfo = await picsCollection.insertOne(newPicDoc);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Failed to add picture to database");
    }

    // Generate signed URL
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
      }),
      { expiresIn: 3600 }
    );

    res.status(201).json({
      id: insertInfo.insertedId.toString(),
      fileName,
      url,
      ...newPicDoc
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload file" });
  }
});

// Get all images endpoint
app.get("/api/images", async (req, res) => {
  try {
    const picsCollection = await pics();
    const allPics = await picsCollection.find({}).toArray();

    // Generate signed URLs for each image
    const picsWithUrls = await Promise.all(
      allPics.map(async (pic) => {
        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: pic.fileName
          }),
          { expiresIn: 3600 }
        );

        return {
          ...pic,
          id: pic._id.toString(),
          url
        };
      })
    );

    res.json(picsWithUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: error.message || "Failed to fetch images" });
  }
});

// Get single image endpoint
app.get("/api/images/:id", async (req, res) => {
  try {
    const picsCollection = await pics();
    const { ObjectId } = await import("mongodb");
    const pic = await picsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!pic) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Generate signed URL
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: pic.fileName
      }),
      { expiresIn: 3600 }
    );

    res.json({
      ...pic,
      id: pic._id.toString(),
      url
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: error.message || "Failed to fetch image" });
  }
});

// Delete image endpoint
app.delete("/api/images/:id", async (req, res) => {
  try {
    const picsCollection = await pics();
    const { ObjectId } = await import("mongodb");
    const pic = await picsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!pic) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete from S3
    const deleteParams = {
      Bucket: bucketName,
      Key: pic.fileName
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete from MongoDB
    await picsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Image deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: error.message || "Failed to delete image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 