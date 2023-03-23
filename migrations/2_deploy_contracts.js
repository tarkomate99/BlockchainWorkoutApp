var WorkoutList = artifacts.require("./WorkoutList.sol");
module.exports = function (deployer) {
  deployer.deploy(WorkoutList);
};
