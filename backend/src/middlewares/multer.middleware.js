import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/temp"), // ✅ Upload location
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), // ✅ Unique filename
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".csv", ".xlsx", ".xls"].includes(ext)) {
      return cb(new Error("Only CSV, XLSX, XLS files allowed"));
    }
    cb(null, true); 
  },
});
