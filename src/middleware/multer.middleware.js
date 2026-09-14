import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const originalFileExtension = path.extname(file.originalname)
        const filename = file.fieldname + '-' + uniqueSuffix + originalFileExtension

        cb(null, filename)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
})

export { upload };