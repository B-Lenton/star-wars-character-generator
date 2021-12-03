"use strict";

// TODO: Create function to avoid repeating all of this code and make it tidier:
//  params would be the url which would be passed to the function through its own code - is that a thing?

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
                throw new Error(response.statusText);
            }
        })            
        .then(person => {
            // second request using the homeworld url returned via response
            fetch(`${person.homeworld}`)
                .then(hwResponse => {
                    if (hwResponse.status >= 200 && hwResponse.status <= 299) {
                        return hwResponse.json();
                    } else {
                        throw new Error(hwResponse.statusText);
                    }
                }) 
                // populate "homeworld" elements
                .then(homeworld => {
                    if (homeworld != undefined) {
                        document.getElementById("homeworld").innerHTML = `${homeworld.name}`;
                    } else {
                        document.getElementById("homeworld").innerHTML = "Unknown";
                    }
                }).catch((error) => {
                    console.log(error);
                    document.getElementById("homeworld").innerHTML = "Unknown";
                });
            // third AJAX request, using the species url returned via the initial response
            fetch(`${person.species}`)
                .then(speciesResponse => {
                    if (speciesResponse.status >= 200 && speciesResponse.status <= 299) {
                        return speciesResponse.json();
                    } else {
                        throw new Error(speciesResponse.statusText);
                    }
                })
                // populate "species" elements
                .then(species => {
                    if (species != undefined) {
                        document.getElementById("species").innerHTML = `${species.name}`;
                    } else {
                        document.getElementById("species").innerHTML = "Unknown";
                    }
                }).catch((error) => {
                    console.log(error);
                    document.getElementById("species").innerHTML = "Unknown";
                });
            // forEach() loops through the person.films array from the original fetch()
            person.films.forEach(url => {
                fetch(`${url}`)
                    .then(filmsResponse => {
                        if (filmsResponse.status >= 200 && filmsResponse.status <= 299) {
                            return filmsResponse.json();
                        } else {
                            throw new Error(filmsResponse.statusText);
                        }
                    })
                    // populate "films" element, providing linebreak as well as title
                    .then(films => {
                        if (films != undefined) {
                            const parentElem = document.getElementById("films");
                            const linebreak = document.createElement("br");
                            const node = document.createTextNode(`${films.title}`);
                            parentElem.appendChild(node);
                            parentElem.appendChild(linebreak);
                        } else {
                            document.getElementById("films").innerHTML = "Unknown";
                        }
                    }).catch((error) => {
                        console.log(error);
                        document.getElementById("films").innerHTML = "Unknown";
                    });
            })
            // populate remaining elements
            document.getElementById("id").innerHTML = person.name;
            document.getElementById("height").innerHTML = `${person.height}cm`;
            document.getElementById("eye_color").innerHTML = `${person.eye_color}`;
    }).catch((error) => {
        console.log(error);
    });
}
// click event listener for random generator button - activates the above function
const button = document.querySelector(".getRandomCharacter");
button.addEventListener("click", (e) => {
    e.preventDefault();
    let toClear = document.getElementById("films");
    toClear.innerHTML = ""
    generateCharacter();
})

// modal popup:
let modal = document.getElementById("popup-modal");
let span = document.getElementsByClassName("modal-close")[0];

span.onclick = function() {
    modal.style.display = "none";
}
window.onload = function() {
    setTimeout(function() {
        modal.style.display = "block";
    }, 500);
}
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// scroll effect:
const section = document.querySelector('section');
// store the number of pixels the doc currently scrolled along the y axis
let currentPos = window.pageYOffset;

const update = () => {
    // store the new number y axis scroll position
	const newPos = window.pageYOffset;
	const diff = newPos - currentPos;
	const speed = diff * 0.5;
    // call the style.transform property of <section> to skew by calculated no. of degrees
    section.style.transform = `skewY(${ speed }deg)`;
	// set the new initial position for the next scroll
	currentPos = newPos;
	// request browser to call update() animation function before the next repaint
	requestAnimationFrame(update);
}

update();