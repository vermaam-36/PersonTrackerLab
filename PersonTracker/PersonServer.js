// Class: SE2840 - Person Tracker
// Name: Amish Verma
// Class Section: N/A

// Import the express library
const express = require('express');

const personData = require('./PersonData.js');
const webpagedir = `${__dirname}/srv`;

// Create a new express application
const app = express();

// Instruct the app to listen on port 3000
app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});

// Set a static route for root (/) to send index.html
app.get("/", (request, response) => {
    response.sendFile(`${webpagedir}/PersonTracker.html`);
});

// Set a static route for all resources that don't have an explicit route
//   to use the static directory webpagedir
app.use(express.static(webpagedir));

app.get("/PersonTracker.js", (req, res)=>{
    response.sendFile(`${webpagedir}/srv/PersonTracker.js`);
});

app.get("/PersonTracker.css", (req, res)=>{
    response.sendFile(`${webpagedir}/srv/PersonTracker.css`);
});

//return information for everyone
app.get('/all', (request, response) => {
    response.json({
        status: "success",
        length: personData.length,
        values: personData
    });
});

//return the information for everyone with the first name of input
app.get('/firstname', (request, response) => {
    let firstname = request.query.filtervalue;
    if(!checkInput(firstname)) {
        response.json({
            status: "error",
            message: "Firstname value must be valid!"
        })
    }
    firstname = firstname.toLowerCase().trim();
    let firstNameFiltered = [];
    for(let i = 0; i < personData.length; i++) {
        if(personData[i].firstname.toLowerCase().includes(firstname)) {
            firstNameFiltered.push(personData[i]);
        }
    }
    response.json({status: "success", length: firstNameFiltered.length, values: firstNameFiltered});
});

app.get("/lastname", (request, response) => {
    let lastname = request.query.filtervalue;
    if(!checkInput(lastname)) {
        response.json({
            status: "error",
            message: "Lastname value must be valid!"
        })
    }
    lastname = lastname.toLowerCase().trim();
    let filteredData = [];
    for(let i = 0; i < personData.length; i++) {
        if(personData[i].lastname.toLowerCase().includes(lastname)) {
            filteredData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredData.length, values: filteredData});
});

//return the age for the filtered data
app.get('/age', (request, response) => {
    let age = request.query.filtervalue;
    if(!isInteger(age)) {
        response.json({
            status: "error",
            message: "Age value must be greater than 0"
        })
        return;
    }
    age = parseFloat(age);
    let ageFilteredData = [];
    for(let i = 0; i < personData.length; i++) {
        if(personData[i].age === age) {
            ageFilteredData.push(personData[i]);
        }
    }
    response.json({status: "success", length: ageFilteredData.length, values: ageFilteredData});
});

app.get("/hometown", (request, response) => {
    let hometown = request.query.filtervalue;
    if(!checkInput(hometown)) {
        response.json({
            status: "error",
            message: "Hometown value must be valid!"
        })
    }
    hometown = hometown.toLowerCase().trim();
    let filteredData = [];
    for(let i = 0; i < personData.length; i++) {
        if(personData[i].hometown.toLowerCase().includes(hometown)) {
            filteredData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredData.length, values: filteredData});
});

//checks if the input from the user is valid
const checkInput = (input) => {
    if(input !== undefined && input.length > 0) {
        return input;
    }
};

//checks if the number that is used is valid
const isInteger = (value) => {
    if(isNaN(value)) {
        return false;
    }
    const num = parseFloat(value);
    if(Number.isInteger(num) && num > 0) {
        return num;
    }
};

