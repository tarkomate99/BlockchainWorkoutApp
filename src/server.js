const express = require("express");
const path = require("path");
const app = express();
const script = require("./javascript/script");
const Web3 = require("web3");
const { readFileSync } = require("fs");
var bodyParser = require("body-parser");
require("dotenv").config();

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

app.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname + "/home.html"));
});

app.use("/login", (req, res) => {
	console.log(req.body.account);
	if (req.body.account != undefined || req.body.account != "") {
		res.send("/listWorkouts");
	}
});

app.get("/listWorkouts", (req, res) => {
	res.sendFile(path.join(__dirname + "/listWorkouts.html"));
});

app.get("/bmi", (req, res) => {
	res.sendFile(path.join(__dirname + "/bmi.html"));
});

app.get("/calorie", (req, res) => {
	res.sendFile(path.join(__dirname + "/calorie.html"));
});

app.get("/javascript/script.js", (req, res) => {
	res.sendFile(path.join(__dirname + "/javascript/script.js"));
});

app.get("/javascript/home.js", (req, res) => {
	res.sendFile(path.join(__dirname + "/javascript/home.js"));
});

app.get("/javascript/bmi.js", (req, res) => {
	res.sendFile(path.join(__dirname + "/javascript/bmi.js"));
});

app.get("/javascript/calorie.js", (req, res) => {
	res.sendFile(path.join(__dirname + "/javascript/calorie.js"));
});

app.get("/getWorkouts", async (req, res) => {
	let address = "0x3160eC2684799E415FBCfDba222A09E64c7958e1";
	let jsonFile = readFileSync("./build/contracts/WorkoutList.json").toString();
	let fileObject = JSON.parse(jsonFile);
	let abi = fileObject.abi;
	var web3 = new Web3(
		new Web3.providers.HttpProvider(
			"https://eth-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY
		)
	);
	var contract = await new web3.eth.Contract(abi, address);
	const workoutCount = await contract.methods.workoutCount().call();
	var workoutArray = [];
	for (let i = 1; i <= workoutCount; i++) {
		const workout = await contract.methods.workouts(i).call();
		const workoutName = workout[1];
		const burnedCal = workout[2];
		const workoutTime = workout[3];
		const workoutTimeStamp = workout[4];
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
});

app.post("/calcBMI", async (req, res) => {
	var data = req.body;
	const age = data.age;
	const height = data.height;
	const weight = data.weight;
	const BMI = weight / height;
	let bmi_weight;

	if (BMI < 18.5) {
		bmi_weight = "Underweight";
	} else if (BMI > 18.5 && BMI < 25) {
		bmi_weight = "Normal";
	} else if (BMI > 25 && BMI < 30) {
		bmi_weight = "Overweight";
	} else if (BMI > 30) {
		bmi_weight = "Obesity";
	}

	res.send(
		JSON.stringify({
			bmi: BMI.toFixed(3),
			bmi_weight: bmi_weight,
		})
	);
});

app.post("/calcCal", async (req, res) => {
	console.log("Kalória kérés")
	var data = req.body;
	const gender = data.gender;
	const activity = data.activity;
	const age = data.age;
	const height = data.height;
	const weight = data.weight;
	const goal = data.goal;
	var rmrResult;
	if (gender == "Male") {
		var rmr =
			(height * 10 + parseFloat(weight) * 6.25 - age * 5 + 5) * activity;
		rmrResult = rmr.toFixed(2);
	}
	if (gender == "Female") {
		var rmr =
			(height * 10 + parseFloat(weight) * 6.25 - age * 5 + 5) * activity;
		rmrResult = rmr.toFixed(2);
	}
	if (goal == "loss") {
		res.send(JSON.stringify({ rmr: Number(rmrResult) - 250 }));
	}
	if (goal == "build") {
		res.send(JSON.stringify({ rmr: Number(rmrResult) + 300 }));
	}
	if (goal == "hold") {
		res.send(JSON.stringify({ rmr: rmrResult }));
	}
});

const server = app.listen(3000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
