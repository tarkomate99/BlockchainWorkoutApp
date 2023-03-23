// connect to metamask
let account;

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
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x35422e0f",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "workouts",
      outputs: [
        {
          name: "id",
          type: "uint256",
        },
        {
          name: "workoutName",
          type: "string",
        },
        {
          name: "burnedCalories",
          type: "uint256",
        },
        {
          name: "workoutTime",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0xcd56ec31",
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
      signature: "constructor",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_workoutName",
          type: "string",
        },
        {
          name: "_burnedCalories",
          type: "uint256",
        },
        {
          name: "_workoutTime",
          type: "uint256",
        },
      ],
      name: "createWorkout",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x2fe542ef",
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
  console.log(
    workName,
    Math.ceil((burnedCalorie / 60) * workoutMin),
    workoutMin
  );
  await window.contract.methods.createWorkout(
    workName,
    Math.ceil((burnedCalorie / 60) * workoutMin),
    workoutMin
  );
}

function uploadIPFS(file) {
  /*
	const ipfs = new IPFS({
	  host: "ipfs.infura.io",
	  port: 3000,
	  protocol: "https",
	});
	const data = "imageUrl";
	ipfs.add(data, (err, hash) => {
	  if (err) {
		return console.log(err);
	  }
	  console.log("https://ipfs.infura.io/ipfs/" + hash);
	});
	*/
  console.log(file);
}
