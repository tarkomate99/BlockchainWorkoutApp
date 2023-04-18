const express = require("express");
const path = require("path");
const app = express();
const script = require("./javascript/script");
const Web3 = require("web3");
const { readFileSync } = require("fs");
var bodyParser = require("body-parser");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/javascript/script.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/javascript/script.js"));
});

app.get("/getWorkouts", async (req, res) => {
  let address = "0x3160eC2684799E415FBCfDba222A09E64c7958e1";
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
  var workoutArray = [];
  for (let i = 1; i <= workoutCount; i++) {
    const workout = await contract.methods.workouts(i).call();
    const workoutName = workout[1];
    const burnedCal = workout[2];
    const workoutTime = workout[3];
    const workoutTimeStamp = workout[4];
    console.log(
      `${workoutName}, ${burnedCal}, ${workoutTime}, ${workoutTimeStamp}`
    );
    workoutArray.push({
      workoutName: workoutName,
      burnedCal: burnedCal,
      workoutTime: workoutTime,
      workoutTimeStamp: workoutTimeStamp,
    });
  }
  res.send(JSON.stringify(workoutArray));
});

app.post("/addWorkout", async (req, res) => {
  let address = "0x3160eC2684799E415FBCfDba222A09E64c7958e1";
  let jsonFile = readFileSync("./build/contracts/WorkoutList.json").toString();
  let fileObject = JSON.parse(jsonFile);
  let abi = fileObject.abi;
  var web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://eth-goerli.g.alchemy.com/v2/xcuYzS3vQPrzXZxNW1PdiG_H6hfPcSNK"
    )
  );
  var contract = await new web3.eth.Contract(abi, address);
  var workout = req.body;
  /*
  await contract.methods.createWorkout(
    workout.workoutName,
    Math.ceil((workout.burnedCal / 60) * workout.workoutTime),
    workout.workoutTime,
    workout.workoutTimeStamp
  );
  */
});

const server = app.listen(3000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
