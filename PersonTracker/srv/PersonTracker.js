// Class: SE2840 - Person Tracker
// Name: Amish Verma
// Class Section: N/A
let timer;
let layerGroup=L.layerGroup();
let map;
window.onload= () => {

    map = L.map('map').setView([39.8283, -98.5795], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(map);

    layerGroup.addTo(map);

    radioButtonInputDisable();

    const displayButton = document.getElementById("displayButton");
    const sortButton = document.getElementById("sortButton");
    const inputField = document.getElementById("filterText");

    //Setup start button
    displayButton.onclick= () =>{
        const allRadio = document.getElementById('allRadio');
        const fnRadio = document.getElementById('fnRadio');
        const lnRadio = document.getElementById('lnRadio');
        const ageRadio = document.getElementById('ageRadio');
        const homeRadio = document.getElementById('homeRadio');
        const filterTextInput = document.getElementById('filterText').value;

        //check which on is selected and get the proper request
        if(allRadio.checked) {
            fetchAll("all");
        } else if(fnRadio.checked) {
            fetchFiltered("firstname", filterTextInput);
        } else if(lnRadio.checked) {
            fetchFiltered("lastname", filterTextInput);
        } else if(ageRadio.checked) {
            fetchFiltered("age", filterTextInput);
        } else if(homeRadio.checked) {
            fetchFiltered("hometown", filterTextInput);
        }
    }
    //Source: https://www.geeksforgeeks.org/how-to-sort-rows-in-a-table-using-javascript/
    sortButton.onclick= () =>{
        let row;
        let z;
        let x, y;
        let column;
        let switchElements;

        const sortDirection = document.getElementById('sortDirection').value;
        const sortValue = document.getElementById('sortType').value;

        const table = document.getElementsByTagName('table')[0].rows;

        switch(sortValue) {
            case "name":
                column = 0;
                break;
            case "age":
                column = 1;
                break;
            case "hometown":
                column = 2;
                break;
        }

        let sorting = true;
        while(sorting) {
            sorting = false;
            row = table;
            for (z = 1; z < (row.length - 1); z++) {
                switchElements = false;
                x = row[z].getElementsByTagName("td")[column];
                y = row[z+1].getElementsByTagName("td")[column];
                if(sortDirection === "inc") {
                    if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        switchElements = true;
                        break;
                    }
                } else if(sortDirection === "dec") {
                    if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        switchElements = true;
                        break;
                    }
                }
            }
            if(switchElements) {
                row[z].parentNode.insertBefore(row[z+1], row[z]);
                sorting = true;
            }
        }
    };
}
/**
 * Fetch data with a filter and then
 * uses it to set table to update DOM
 * @param filterType field to filter by
 * @param filterValue value to filter by
 */
const fetchFiltered = (filterType, filterValue) => {
    fetch("http://localhost:3000/"+filterType+"?filtervalue="+filterValue )
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(String(response.status));
            }
            return response.json();
        })
        .then((responseJSON) => setTable(responseJSON))
        .catch((error) => setError(error));
}

/**
 * Gets data from API and sends it set table to update DOM
 */
const fetchAll=()=> {
    fetch("http://localhost:3000/all" )
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(String(response.status));
            }
            return response.json();
        })
        .then((responseJSON) => setTable(responseJSON))
        .catch((error) => setError(error));
}
/**
 * Disabled and unDisabling the text input in certain situations
 * */
const radioButtonInputDisable = () => {
    const allRadio = document.getElementById('allRadio');
    const firstNameRadio = document.getElementById('fnRadio');
    const lastNameRadio = document.getElementById('lnRadio');
    const ageRadio = document.getElementById('ageRadio');
    const homeRadio = document.getElementById('homeRadio');
    const filterTextInput = document.getElementById('filterText');

    //disable the text input when appropiate
    filterTextInput.disabled = true;

    allRadio.onclick = () => {
        filterTextInput.disabled = true;
    }

    firstNameRadio.onclick = () => {
        filterTextInput.disabled = false;
    }

    lastNameRadio.onclick = () => {
        filterTextInput.disabled = false;
    }

    ageRadio.onclick = () => {
        filterTextInput.disabled = false;
    }

    homeRadio.onclick = () => {
        filterTextInput.disabled = false;
    }
}

/**
 * Parses the JSON for errors and if successful iterates through the rows and adds the,
 * @param responseJSON The json we are parsing
 */
const setTable =(responseJSON)=>{
    console.log(responseJSON);
    if (responseJSON["status"]!="success"){
        setError(responseJSON["status"]);
        return;
    }
    setError("");
    let table=document.getElementById("tablebody");
    //iterating through the response length to create the table with proper information
    for(let i = 0; i < responseJSON.length; i++) {
        let person = document.createElement("tr");

        let fullname = document.createElement("td");
        fullname.innerText = responseJSON.values[i].firstname + " "+responseJSON.values[i].lastname;

        let age = document.createElement("td");
        age.innerText = responseJSON.values[i].age;

        let hometown = document.createElement("td");
        hometown.innerText = responseJSON.values[i].hometown;

        let marker = L.marker([responseJSON.values[i]["location"]["lat"], responseJSON.values[i]["location"]["lon"]]).addTo(layerGroup);
        marker.bindTooltip(fullname.innerText, {
            permanent: true,
            direction: "bottom"
        }).openTooltip();
        marker.bindPopup(responseJSON.values[i].hometown).openPopup();

        person.onclick = () => {
            let position = [responseJSON.values[i]["location"]["lat"], responseJSON.values[i]["location"]["lon"]];
            map.panTo(position);
        }

        person.append(fullname);
        person.append(age);
        person.append(hometown);
        table.append(person);
    };
}


/**
 * Takes in a HTML row and a vehicle JSON object and turns it
 * into a row on the DOM filled with accurate information
 * @param row DOM row
 * @param vehicle JSON row
 */
const setRow=(row, vehicle)=>{
    console.log(vehicle);
    let busId= row.insertCell();
    let id=vehicle["vid"];
    busId.innerText=id;
    let route= row.insertCell();
    route.innerText=vehicle ["des"];
    let lat= row.insertCell();
    let latVal=vehicle ["lat"];
    lat.innerText = latVal;
    let lon= row.insertCell()
    let lonVal= vehicle["lon"];
    lon.innerText=lonVal;
    let speed= row.insertCell();
    speed.innerText=vehicle["spd"];
    let dist= row.insertCell();
    let feet = vehicle["pdist"];
    feet = feet * 0.000189394;
    dist.innerText= feet+"";

    let marker = L.marker([latVal, lonVal]).addTo(layerGroup);
    marker.bindTooltip(id, {
        permanent: true,
        offset: L.point({x:-15, y:15}),
        direction: "bottom"
    }).openTooltip();
}
/**
 * Sets the error tag with
 * @param errorMessage
 */
const setError = (errorMessage) => {

    let textBox= document.getElementById("messages");
    let table=document.getElementById("tablebody");
    let sortPanel=document.getElementById("sortControl");


    table.innerHTML="";
    layerGroup.clearLayers();

    if (errorMessage===""){
        textBox.classList.add('visually-hidden');
        sortPanel.classList.remove('visually-hidden');

        textBox.innerText=errorMessage;
    }else{
        textBox.classList.remove('visually-hidden');
        sortPanel.classList.add('visually-hidden');

        textBox.innerText=errorMessage+". Please press stop to retry.";
    }
    clearInterval(timer);

}