import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Check if Cloudinary is configured
const isCloudinaryConfigured = true;
  // process.env.CLOUDINARY_CLOUD_NAME &&
  // process.env.CLOUDINARY_API_KEY &&
  // process.env.CLOUDINARY_API_SECRET &&
  // process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  // process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  // process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: 'dgwlzoy6j',
    api_key: '976476234494856',
    api_secret: 'hbQD7dd2kE5AMzJUJU9RPP96yhE',
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.log('⚠️  Cloudinary not configured - file uploads will fail');
  console.log('💡 Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
}

// Configure multer for memory storage (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

export { isCloudinaryConfigured };
export default cloudinary;

