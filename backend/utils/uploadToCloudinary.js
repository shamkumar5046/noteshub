import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer, folder, resourceType = 'raw') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured) {
      return reject(new Error(
        'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
      ));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

