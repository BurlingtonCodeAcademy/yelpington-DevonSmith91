/* ------------------Random Functions-------------- */

function capitalize(word) {
	let steralize = word.toString().trim().toLowerCase()
	let firstLetter = steralize[0].toUpperCase()
	let restOfWord = steralize.slice(1)
	return firstLetter + restOfWord
}

function titleize(sentence) {
	let wordArray = sentence.toLowerCase().split(' ')
	let newArray = wordArray.map(capitalize)
	return newArray.join(' ')
}


/* ----------------------Restaurant Deets------------------- */

let listOfPlaces = document.getElementById('listOfPlaces')

async function locationDetails() {
	// Fetch to the custom API for restaurant list
	fetch('./api/all.json')
		.then((res) => {
			return res.json()
		})
		.then((idList) => {
			// Take each restaurant name and clean up the value, turn it into a list of links to their specific page
			idList.forEach((id) => {
				let dirtyName = id.split('-').join(' ')
				let name = titleize(dirtyName)
				listOfPlaces.innerHTML += `<p class='prettyText'><a class='sideLink' href='/restaurant?${id}'>${name}</a></p>`
				// Use ID of restaurant name to fetch specific restaurant page
				fetch(`./api/${id}.json`)
					.then(res => res.json())
					.then((restInfo) => {
						let address = restInfo.address
						// Fetch map information and plug in Lat/Lon into map
						fetch(`https://nominatim.openstreetmap.org/search/?q=${address}&format=json`).then((data) => {
							return data.json()
						}).then((jsonObj) => {
							let shops = jsonObj[0]
							let lat = shops.lat
							let lon = shops.lon
							// Drop a pin at the location on the map with a link in the popup
							L.marker([lat, lon]).addTo(myMap).bindPopup(`<a href='/restaurant?${id}'>${name}</a>`)
						})

					})

			})
		})
}

locationDetails()



/* -------------------------Map Deets----------------------- */

//start the map looking at burlington

let myMap = L.map('mapid').setView([44.4759, -73.2121], 15);


// map tile details

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)



