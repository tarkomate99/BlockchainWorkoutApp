function calculateBMI() {
  $("#ageError").hide();
  $("#weightError").hide();
  $("#heightError").hide();
  const age = $("#age").val();
  const height = ($("#height").val() / 100) ** 2;
  const weight = $("#weight").val();
  if (age == "" && height == "" && weight == "") {
    $("#ageError").show();
    $("#weightError").show();
    $("#heightError").show();
    return;
  } else if (age == "") {
    $("#ageError").show();
    return;
  } else if (height == "") {
    $("#heightError").show();
    return;
  } else if (weight == "") {
    $("#weightError").show();
    return;
  }
  var xhttp = new window.XMLHttpRequest();
  xhttp.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var data = JSON.parse(this.responseText);
      $("#bmi").text(data.bmi + " " + data.bmi_weight);
      $("#bmi").show();
    }
  });
  xhttp.open("POST", "/calcBMI", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      age: age,
      height: height,
      weight: weight,
    })
  );
}
