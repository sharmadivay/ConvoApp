const express = require("express");
const app = express();
const port = 5000;
const multer = require("multer");
const docxConverter = require("docx-pdf");
const path = require("path");
const cors = require("cors")

app.use(cors())
// setting up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file Uploaded" });
    }
    // Definig output path
    let outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );
    docxConverter(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error converting docx to pdf" });
      }
      res.download(outputPath, () => {
        console.log("file downloaded");
      });
    });
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(` Port is listening at ${port}`);
});
