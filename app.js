const express = require("express")
const app = express();
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
const path = require("path")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send-location", (data) => {
        const { latitude, longitude, accuracy } = data;
        console.log(`User ${socket.id}: Latitude=${latitude}, Longitude=${longitude}, Accuracy=${accuracy} meters`);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});


app.get("/", (req, res) => {
    res.render("index")
})


server.listen(3000, () => {
    console.log("server ruuning on port 3000")
})