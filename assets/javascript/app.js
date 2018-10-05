// Initialize Firebase

var config = {
  apiKey: "AIzaSyA7kyu2XYjcw0O06JvZiv6U8Q1Dx6Yv588",
  authDomain: "classwork-1dca6.firebaseapp.com",
  databaseURL: "https://classwork-1dca6.firebaseio.com",
  projectId: "classwork-1dca6",
  storageBucket: "classwork-1dca6.appspot.com",
  messagingSenderId: "361695502757"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


// Capture Button Click
$("#train-form").on("submit", function (event) {
  // Don't refresh the page!
  event.preventDefault();

  // logic for storing and retrieving the most recent train.
  var nameInput = $("#name-input").val().trim();
  var destinationInput = $("#destination-input").val().trim();
  var firstTrainTimeInput = $("#firstTrain-time").val().trim()
  var frequencyInput = $("#frequency-input").val().trim()
  
  if (!nameInput || !destinationInput || !firstTrainTimeInput || !frequencyInput) {
    return false;
  }
  // provide initial data to Firebase database.
  database.ref().push({
    name: nameInput,
    destination: destinationInput,
    firstTrainTime: firstTrainTimeInput,
    frequency: frequencyInput
  });
  

});

// Firebase watcher + initial loader

database.ref().on("child_added", function (snapshot) {
  console.log(snapshot.val());

  var name = snapshot.val().name;
  var destination = snapshot.val().destination;
  var firstTrainTime = snapshot.val().firstTrainTime;
  var frequency = snapshot.val().frequency;
  var keyinFB = snapshot.key;
  var deleteButton = $("<button>").addClass("btn btn-secondary delete-train")


  // calculate next arrival time and minutes until arrival 
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years")

  console.log(firstTimeConverted);
  // current time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
  //calculate difference between times
  var difference = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + difference);

  //time apart(remainder)
  var trainRemain = difference % frequency;
  console.log(trainRemain);

  //minutes until arrival
  var minUntil = frequency - trainRemain;
  console.log("MINUTES TILL TRAIN: " + minUntil);
  
  //next arrival time
  var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');
  // Create delete button for display
  deleteButton.text("Delete");
  deleteButton.attr("id", keyinFB);
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    // $("<td>").text(firstTrainTime),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minUntil),
    $("<td>").append(deleteButton)

  );

  // Append the new row to the table
  $("#train-table").append(newRow);

  // Create Error Handling

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);

});

$(document).on("click", ".delete-train", function (event) {
  
  
  database.ref($(this).attr("id")).remove();
 
  //alert($(this).attr("id"));
  
  $(this).parent().parent('tr').remove();
  $(this).parent().empty();
  
  // $("<tr>").text("deleted!")
    
});


