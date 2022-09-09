import multer from "multer";
const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/src/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

export const upload = multer({ storage: multerConfig }).single("file");
