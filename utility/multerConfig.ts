import multer from "multer";

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
})

export const imageUpload = multer({storage: imageStorage}).array("images", 10);