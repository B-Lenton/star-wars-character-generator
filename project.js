"use strict";
        
// random character generator function
const generateCharacter = () => {
    const randomNumber = Math.ceil(Math.random() * 83);
    // initial AJAX request to RESTful API
    fetch(`https://swapi.dev/api/people/${randomNumber}/`)
        .then(response => {
            // checking response status code
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })            
        .then(person => {
            // second request using the homeworld url returned via response
            fetch(`${person.homeworld}`)
                .then(hwResponse => {
                    if (hwResponse.status >= 200 && hwResponse.status <= 299) {
                        return hwResponse.json();
                    } else {
                        throw Error(hwResponse.statusText);
                    }
                }) 
                // populate "homeworld" elements
                .then(homeworld => {
                    if (homeworld != undefined) {
                        document.getElementById("homeworld").innerHTML = `<strong>Homeworld:</strong> ${homeworld.name}`;
                    } else {
                        document.getElementById("homeworld").innerHTML = "<strong>Homeworld:</strong> Unknown";
                    }
                }).catch((error) => {
                    console.log(error);
                    document.getElementById("homeworld").innerHTML = "<strong>Homeworld:</strong> Unknown";
                });
            // final AJAX request, using the species url returned via the initial response
            fetch(`${person.species}`)
                .then(speciesResponse => {
                    if (speciesResponse.status >= 200 && speciesResponse.status <= 299) {
                        return speciesResponse.json();
                    } else {
                        throw Error(speciesResponse.statusText);
                    }
                })
                // populate "species" elements
                .then(species => {
                    if (species != undefined) {
                        document.getElementById("species").innerHTML = `<strong>Species:</strong> ${species.name}`;
                    } else {
                        document.getElementById("species").innerHTML = "<strong>Species:</strong> Unknown";
                    }
                }).catch((error) => {
                    console.log(error);
                    document.getElementById("species").innerHTML = "<strong>Species:</strong> Unknown";
                });
            // populate remaining elements
            document.getElementById("id").innerHTML = person.name;
            document.getElementById("height").innerHTML = `<strong>Height:</strong> ${person.height}cm`;
            document.getElementById("eye_color").innerHTML = `<strong>Eye Colour:</strong> ${person.eye_color}`;
    }).catch((error) => {
        console.log(error);
    });
}
// click event listener for random generator button - activates the above function
const button = document.querySelector(".getRandomCharacter");
button.addEventListener("click", (e) => {
    e.preventDefault();
    generateCharacter();
})

// modal:
let modal = document.getElementById("popup-modal");
let span = document.getElementsByClassName("modal-close")[0];

span.onclick = function() {
    modal.style.display = "none";
}
window.onload = function() {
    setTimeout(function() {
        modal.style.display = "block";
    }, 1000);
}
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
