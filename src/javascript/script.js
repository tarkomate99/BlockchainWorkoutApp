// connect to metamask
let account;
let imgBase64;

const connectMetamask = async () => {
  if (window.ethereum !== "undefined") {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    account = accounts[0];
    document.getElementById("account").innerHTML = account;
  }
};
// connect to smart contract
const connectContract = async () => {
  const ABI = [
    {
      constant: true,
      inputs: [],
      name: "workoutCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "workouts",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "workoutName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "burnedCalories",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "workoutTime",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "imageHash",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timeStamp",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "string",
          name: "_workoutName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_burnedCalories",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_workoutTime",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_imageHash",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_timeStamp",
          type: "uint256",
        },
      ],
      name: "createWorkout",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const Address = "0x0aE3152E85B071D19D8E777275D018C37BAa60B3";
  window.web3 = await new Web3(window.ethereum);
  window.contract = await new window.web3.eth.Contract(ABI, Address);
  document.getElementById("contractArea").innerHTML =
    "connected to smart contract";
};

const readContract = async () => {
  const workoutCount = await window.contract.methods.workoutCount().call();
  const $workoutTemplate = $(".trainTemplate");
  for (let i = 1; i <= workoutCount; i++) {
    const workout = await window.contract.methods.workouts(i).call();
    const workoutName = workout[1];
    const burnedCal = workout[2];
    const workoutTime = workout[3];
    const $newTrainTemplate = $workoutTemplate.clone();
    $newTrainTemplate.find(".content").html(workoutName);
    $newTrainTemplate.find(".kcal").html(burnedCal + " kcal");
    $newTrainTemplate.find(".workoutTime").html(workoutTime + " minute");
    $("#trainList").append($newTrainTemplate);

    $newTrainTemplate.show();
  }
};
const getTrainningTypes = async (e) => {
  resetSearchBar();
  const trainType = document.getElementById("newTask").value;
  if (trainType == "") {
    console.log("empty");
    return;
  } else {
    const api = await fetch(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${trainType}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": "+0LGFTD9TcVGhqrkmoq7Ag==ZTjjsmy8MvIR3uu5",
        },
      }
    );
    let myJson = await api.json();
    const $trainTemplate = $(".searchTrainTemplate");
    for (let training of myJson) {
      console.log(training);
      const $newTrainTemplate = $trainTemplate.clone();
      $newTrainTemplate.find(".content").html(training.name);
      $newTrainTemplate
        .find(".kcal")
        .html(training.calories_per_hour + "kcal/hour");
      $newTrainTemplate
        .find("input")
        .prop("name", training.name)
        .prop("kcal", training.calories_per_hour)
        .on("click", toggleClicked);

      $("#searchList").append($newTrainTemplate);
      $newTrainTemplate.show();
    }
  }
};

function resetSearchBar() {
  $("#searchList").empty();
  $("#searchList").append(`
	<div
	class="searchTrainTemplate"
	class="checkbox"
	style="
	  display: none;
	  background-color: rgb(182, 182, 182);
	  text-align: center;
	"
  >
	<label>
	  <input type="checkbox" />
	  <span class="content">Train goes here...</span>
	  <span
		class="kcal"
		style="background-color: rgb(0, 187, 255)"
	  ></span>
	</label>
  </div>
	`);
}

function toggleClicked(e) {
  $("#workName").val(e.target.name);
  $("#burnedLabel").val(e.target.kcal);
  $("#sendBtn").show();
  $("#workName").show();
  $("#workoutImage").show();
  //$("#burnedLabel").show();
  $("#workoutMinLabel").show();
}
async function send() {
  const workName = $("#workName").val();
  const burnedCalorie = $("#burnedLabel").val();
  const workoutMin = parseInt($("#workoutMinLabel").val(), 10);
  const imageHash = imgBase64;
  console.log(imageHash);
  let date = new Date();
  let yyyy = date.getFullYear();
  let mm =
    date.getMonth() > 0 && date.getMonth() < 9
      ? "0" + date.getMonth()
      : date.getMonth();
  let dd = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let curr_date = yyyy + "-" + mm + "-" + dd + " " + h + ":" + m + ":" + s;
  console.log(
    workName,
    Math.ceil((burnedCalorie / 60) * workoutMin),
    workoutMin,
    imageHash,
    curr_date
  );
  await window.contract.methods.createWorkout(
    workName,
    Math.ceil((burnedCalorie / 60) * workoutMin),
    workoutMin,
    imageHash,
    curr_date
  );
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    console.log("BASE64_RESULT: " + reader.result);
    imgBase64 = reader.result;
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}
