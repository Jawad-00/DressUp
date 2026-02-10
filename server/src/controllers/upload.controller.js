import { cloudinary } from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    // Cloudinary expects a base64 data URI when using memoryStorage
    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "dressup/products",
      resource_type: "image",
    });

    res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    next(err);
  }
};
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const uploads = req.files.map(async (file) => {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "dressup/products",
        resource_type: "image",
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    });

    const results = await Promise.all(uploads);

    res.status(201).json({ images: results });
  } catch (err) {
    next(err);
  }
};
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.json({ message: "Image deleted", result });
  } catch (err) {
    next(err);
  }
};
