const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv");
env.config();
const connect = require("./config/db");
const userRoute = require("./routes/userRoute");
const noteRoute = require("./routes/NoteRoute");
const textEditorRoute = require("./routes/TextEditorRoute");
const markdownEditorRoute = require("./routes/MarkdownEditorRoute");

const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");

console.log("PORT==", process.env.PORT);

app.get("/api/health", async (req, res) => {
  try {
    // Example DB ping (modify based on your DB setup)
    // If using mongoose:
    const dbStatus = connect?.readyState === 1 ? "UP" : "DOWN";

    res.status(200).json({
      check:"Argo CD deplyment - 25/04/2026 - 3",
      status: "UP",
      db: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: "DOWN",
      error: err.message,
    });
  }
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoute);
app.use("/api/note", noteRoute);
app.use("/api/textEditor", textEditorRoute);
app.use("/api/markdownEditor", markdownEditorRoute);

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is connected to port ${PORT}`);
});
