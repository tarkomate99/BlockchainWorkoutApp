const express = require("express");
const path = require("path");
const app = express();
const script = require("./javascript/script");

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/javascript/script.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/javascript/script.js"));
});

const server = app.listen(3000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
