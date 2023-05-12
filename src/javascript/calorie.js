function calculateCalorie() {
	$("#ageError2").hide();
	$("#weightError2").hide();
	$("#heightError2").hide();
	$("#genderError2").hide();
	var gender = "";
	var selected = $("#calorieCalc input[type=radio][name='gender']:checked");
	var height = $("#height2").val();
	var weight = $("#weight2").val();
	var age = $("#age2").val();
	var activity = $("#activity").val();
	var goal = $("#goal").val();
	if (selected.length > 0) {
		gender = selected.val();
	}
	if (gender == "" && height == "" && weight == "" && age == "") {
		$("#ageError2").show();
		$("#weightError2").show();
		$("#heightError2").show();
		$("#genderError2").show();
		return;
	} else if (gender == "") {
		$("#genderError2").show();
		return;
	} else if (height == "") {
		$("#heightError2").show();
		return;
	} else if (weight == "") {
		$("#weightError2").show();
		return;
	} else if (age == "") {
		$("#ageError2").show();
		return;
	}
	var xhttp = new window.XMLHttpRequest();
	xhttp.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			var data = JSON.parse(this.responseText);
			$("#rmr").text(data.rmr + "kcal");
			$("#rmr").show();
		}
	});
	xhttp.open("POST", "/calcCal", true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(
		JSON.stringify({
			gender: gender,
			height: height,
			weight: weight,
			age: age,
			activity: activity,
			goal: goal
		})
	);
}
