import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

// Function to get the directory name
const getDirname = (metaUrl) => path.dirname(fileURLToPath(metaUrl));

const __dirname = getDirname(import.meta.url);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("sendLocation", function (data) {
    io.emit("receiveLocation", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnect", socket.id);
  });
  console.log("A user connected");
});
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
