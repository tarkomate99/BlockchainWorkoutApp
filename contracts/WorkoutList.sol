// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.5.0;

contract WorkoutList {
    uint public workoutCount = 0;
    mapping(uint => Workout) public workouts;

    struct Workout {
        uint id;
        string workoutName;
        uint burnedCalories;
        uint workoutTime;
    }

    constructor() public {}

    function createWorkout(
        string memory _workoutName,
        uint _burnedCalories,
        uint _workoutTime
    ) public {
        workoutCount++;
        workouts[workoutCount] = Workout(
            workoutCount,
            _workoutName,
            _burnedCalories,
            _workoutTime
        );
    }
}
