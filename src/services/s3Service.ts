import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: import.meta.env.VITE_BUCKET_REGION1,
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY1,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY1,
  },
});

const bucketName = import.meta.env.VITE_BUCKET_NAME1;

export const uploadFile = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return fileName;
};

export const getFileUrl = async (fileName: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  return url;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
}; 