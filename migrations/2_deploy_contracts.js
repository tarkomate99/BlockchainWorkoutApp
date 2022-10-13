var TodoList = artifacts.require("./TodoList.sol");
var WorkoutList = artifacts.require("./WorkoutList.sol");
module.exports = function (deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(WorkoutList);
};
