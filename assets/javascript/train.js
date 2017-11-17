/* global firebase moment */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDiIz-YgivNxK3l6kkHIxP-dfpPdWHccyw",
    authDomain: "train-scheduler-db8af.firebaseapp.com",
    databaseURL: "https://train-scheduler-db8af.firebaseio.com",
    projectId: "train-scheduler-db8af",
    storageBucket: "train-scheduler-db8af.appspot.com",
    messagingSenderId: "706900955421"
};
firebase.initializeApp(config);

var database = firebase.database();
//===================================================================

//Click function for submit button


$("#submit").on("click", function() {

    event.preventDefault();

    //These variables capture the users input from each input field
    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = moment($("#trainTime").val().trim(), 'HH:mm').subtract(1, 'years').format('X');
    var frequency = $("#frequency").val().trim();

    //Creates local temp object to hold train data
    var newTrain = {
        name: name,
        destination: destination,
        time: firstTime,
        frequency: frequency

    };

    //Upload train data to firebase
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.role);
    console.log(newTrain.start);
    console.log(newTrain.rate);

    //Clears input boxes
    $("#trainName").val('');
    $("#destination").val('');
    $("#trainTime").val('');
    $("#frequency").val('');



});

// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry

database.ref().on('child_added', function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    //Store everything into variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    //Train info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    //Using hardcore math we calculate the minutes away
    //Calculate by taking the current time (unix) subtract the trainTime and find the modulus between the difference and the frequency
    var timeDifferenc = moment().diff(moment.unix(trainTime), "minutes");
    var trainRemainder = moment().diff(moment.unix(trainTime), "minutes") % trainFrequency;
    var trainMinutes = trainFrequency - trainRemainder;

    //Calculate the arrival time by adding trainMinutes to current time
    var arrivalTime = moment().add(trainMinutes, "m").format("hh:mm A");
    console.log(trainMinutes);
    console.log(arrivalTime);

    //Add train data correctly to each column
    $("#tableBody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + arrivalTime + "</td><td>" + trainMinutes + "</td></tr>");


});
