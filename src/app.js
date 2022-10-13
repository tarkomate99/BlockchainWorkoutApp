App = {
  loading: false,
  contracts: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed();

    const workoutList = await $.getJSON("WorkoutList.json");
    App.contracts.WorkoutList = TruffleContract(workoutList);
    App.contracts.WorkoutList.setProvider(App.web3Provider);

    App.workoutList = await App.contracts.WorkoutList.deployed();
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // Render Account
    $("#account").html(App.account);

    // Render Tasks
    await App.renderTasks();
    await App.renderWorkouts();

    // Update loading state
    App.setLoading(false);
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },
  resetSearchBar: () => {
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
  },
  renderWorkouts: async () => {
    const workoutCount = await App.workoutList.workoutCount();
    const $workoutTemplate = $(".trainTemplate");

    for (var i = 1; i <= workoutCount; i++) {
      const workout = await App.workoutList.workouts(i);
      const workoutId = workout[0].toNumber();
      const workoutName = workout[1];
      const burnedCal = workout[2].toNumber();
      const workoutTime = workout[3].toNumber();
      const $newTrainTemplate = $workoutTemplate.clone();
      $newTrainTemplate.find(".content").html(workoutName);
      $newTrainTemplate.find(".kcal").html(burnedCal + " kcal");
      $newTrainTemplate.find(".workoutTime").html(workoutTime + " minute");
      $("#trainList").append($newTrainTemplate);

      $newTrainTemplate.show();
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    const content = $("#newTask").val();
    await App.todoList.createTask(content, { from: App.account });
    window.location.reload();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    const taskId = e.target.name;
    await App.todoList.toggleCompleted(taskId, { from: App.account });
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    const content2 = $("#content2");
    if (boolean) {
      loader.show();
      content.hide();
      content2.hide();
    } else {
      loader.hide();
      content.show();
      content2.show();
    }
  },

  toggleClicked: async (e) => {
    $("#workName").val(e.target.name);
    $("#burnedLabel").val(e.target.kcal);
    $("#sendBtn").show();
    $("#workName").show();
    //$("#burnedLabel").show();
    $("#workoutMinLabel").show();
  },

  createWorkout: async (workout, burnedCal, workoutMin) => {
    App.setLoading(true);
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    await App.workoutList.createWorkout(workout, burnedCal, workoutMin, {
      from: App.account,
    });
    window.location.reload();
  },

  getTrainningTypes: async (trainType) => {
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
        .on("click", App.toggleClicked);

      $("#searchList").append($newTrainTemplate);
      $newTrainTemplate.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
    $("#search").click(function () {
      App.resetSearchBar();
      const train = $("#newTask").val();
      if (train != "") {
        App.getTrainningTypes(train);
      } else {
        console.log("empty");
      }
    });
    $("#sendBtn").click(function () {
      const workName = $("#workName").val();
      const burnedCalorie = $("#burnedLabel").val();
      const workoutMin = parseInt($("#workoutMinLabel").val(), 10);
      console.log(
        workName,
        Math.ceil((burnedCalorie / 60) * workoutMin),
        workoutMin
      );
      App.createWorkout(
        workName,
        Math.ceil((burnedCalorie / 60) * workoutMin),
        workoutMin
      );
    });
    $("#calculate").click(function () {
      const age = $("#age").val();
      const height = ($("#height").val() / 100) ** 2;
      const weight = $("#weight").val();
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
      $("#bmi").text(BMI.toFixed(3) + " " + bmi_weight);
      $("#bmi").show();
    });
  });
});
