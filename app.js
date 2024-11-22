import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import libre from 'libreoffice-convert';
import { encrypt } from 'node-qpdf2';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
libre.convertAsync = promisify(libre.convert);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));

app.post("/convert", upload.single("file"), async (req, res) => {
  const file = req.file;
  const pass = req.body.password || null;
  if (!file || path.extname(file.originalname) !== ".docx") {
    return res.status(400).send("Only .docx files are allowed.");
  }

  const inputPath = path.join(__dirname, file.path);
  const outputPath = path.join(__dirname, "uploads", `${file.filename}.pdf`);
  const encryptedPath = path.join(__dirname, "uploads", `${file.filename}_encrypted.pdf`);

  try {
    // Read the uploaded DOCX file
    const docxBuffer = await fs.readFile(inputPath);

    // Convert DOCX to PDF using LibreOffice
    const pdfBuffer = await libre.convertAsync(docxBuffer, 'pdf', undefined);

    // Save the converted PDF
    await fs.writeFile(outputPath, pdfBuffer);

    // Encrypt the PDF if a password is provided
    if (pass) {
      const options = {
        input: outputPath,
        output: encryptedPath,
        keyLength: 256, // Highest encryption level
        restrictions: {
          print: "none",
          modify: "none",
          extract: "n",
          useAes: "y", // Enable AES encryption
        },
        password:pass,
      };
      // Encrypt the PDF
      await encrypt(options);

      // Serve the encrypted PDF
      res.download(encryptedPath, "encrypted.pdf", async (err) => {
        try {
          // Clean up temporary files
          await fs.unlink(inputPath); // Delete the original DOCX file
          await fs.unlink(encryptedPath); // Delete the encrypted PDF file
          await fs.unlink(outputPath); // Delete the intermediate unencrypted PDF file
        } catch (cleanupErr) {
          console.error("Error cleaning up files:", cleanupErr);
        }

        if (err) {
          console.error("Error during download:", err);
          res.status(500).send("Error serving the file.");
        }
      });
    } else {
      // Serve the unencrypted PDF if no password is provided
      res.download(outputPath, "converted.pdf", async (err) => {
        try {
          // Clean up temporary files
          await fs.unlink(inputPath); // Delete the original DOCX file
          await fs.unlink(outputPath); // Delete the PDF file
        } catch (cleanupErr) {
          console.error("Error cleaning up files:", cleanupErr);
        }

        if (err) {
          console.error("Error during download:", err);
          res.status(500).send("Error serving the file.");
        }
      });
    }
  } catch (err) {
    res.status(500).send("Error processing the file.");
    console.error(err);
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
