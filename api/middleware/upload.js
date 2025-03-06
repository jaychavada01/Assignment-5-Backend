const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration (Memory)
const AWS_Storage = multer.memoryStorage(); // Store file in memory before uploading to S3

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter (Allow Only Images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"), false);
  }
};

// Multer Configuration
const upload = multer({
  storage: storage || AWS_Storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB file size limit
  fileFilter: fileFilter,
});

module.exports = upload;
