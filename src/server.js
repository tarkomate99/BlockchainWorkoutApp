const express = require("express");
const path = require("path");
const app = express();
const script = require("./javascript/script");
const Web3 = require("web3");
const { readFileSync } = require("fs");

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

app.get("/getWorkouts", async (req, res) => {
  let address = "0xBe4f715A92c3FEf4C1D36481d3E9ea904Bd3a910";
  let jsonFile = readFileSync("./build/contracts/WorkoutList.json").toString();
  let fileObject = JSON.parse(jsonFile);
  let abi = fileObject.abi;
  var web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://eth-goerli.g.alchemy.com/v2/xcuYzS3vQPrzXZxNW1PdiG_H6hfPcSNK"
    )
  );
  var contract = await new web3.eth.Contract(abi, address);
  const workoutCount = await contract.methods.workoutCount().call();
  console.log(workoutCount);
  res.send(`WorkoutCount: ${workoutCount}`);
});

const server = app.listen(3000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
