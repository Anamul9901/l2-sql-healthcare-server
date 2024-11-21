import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    // cb(null, uniqueSuffix + "-" + file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Configuration
cloudinary.config({
  cloud_name: "dt2y7d0rn",
  api_key: "339333768182163",
  api_secret: "cxStZQVxRnTsFMP3thFH44RmBjQ",
});

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  const upload = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename,
    })
    .catch((error) => {
      //   console.log(error);
      return error;
    });

  // delete file from uploads file
  fs.unlinkSync(file.path);
  return upload;
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
