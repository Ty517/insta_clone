const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create multer filter to allow only image and video files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image or video! Please upload only images or videos.'), false);
  }
};

// Create Cloudinary storage engine using multer storage and filter
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const parsedPath = path.parse(file.originalname);
    return {
      folder: 'iguploads',
      public_id: `${Date.now()}-post-${parsedPath.name || 'unknown'}`,
      resource_type: 'auto',
    };
  },
});
const deleteinCloudinary = async (paths) => {
  await Promise.all(paths.map(async (cloudinaryPath) => {
    const filename = cloudinaryPath.split('/').pop().split('.')[0];
    const publicId = `iguploads/${filename}`;
    await cloudinary.uploader.destroy(publicId);
  }));
};

const upload = multer({ storage, fileFilter: multerFilter });
module.exports = { upload, deleteinCloudinary };
