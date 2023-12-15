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
const multerFilterProfile = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
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
const profile = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const parsedPath = path.parse(file.originalname);
    return {
      folder: 'igprofiles',
      public_id: `${Date.now()}-profile-${parsedPath.name || 'unknown'}`,
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

const deleteprofile = async (paths) => {
  const filename = paths.split('/').pop().split('.')[0];
  const publicId = `igprofiles/${filename}`;
  await cloudinary.uploader.destroy(publicId);
};

const uploadprofile = multer({ storage: profile, fileFilter: multerFilterProfile });
const upload = multer({ storage, fileFilter: multerFilter });
module.exports = {
  upload, uploadprofile, deleteinCloudinary, deleteprofile,
};
