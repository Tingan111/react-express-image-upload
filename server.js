const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, uploadDir)));


app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log("後端成功接收檔案資訊：", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file upload." });
  }
  const { filename } = req.file;
  const fileUrl = `http://localhost:${port}/uploads/${filename}`;
  res.json({
    message: "Image uploaded successfully!",
    imageUrl: fileUrl
  });
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
