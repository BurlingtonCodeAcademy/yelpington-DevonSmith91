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

/* -------------------------Map Deets----------------------- */
let myMap = L.map('mapid').setView([44.4759, -73.2121], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)


/* ----------------------Restaurant Deets------------------- */

let listOfPlaces = document.getElementById('listOfPlaces')

async function locationDetails() {
	// Fetch the data for all restaurants
	let fullDetails = await fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
		.then((response) => {
			return response.json()
		}).then((jsonObj) => {
			return jsonObj
		})

	// Create a link to each restaurant
	fullDetails.forEach((place) => {
		let location = place.address
		let name = place.name
		let id = place.id
		listOfPlaces.innerHTML += `<p class='prettyText'><a class='link' href='/restaurant?${id}'>${name}</a></p>`
		// Fetch information based on individual locations
		fetch(`https://nominatim.openstreetmap.org/search/?q=${location}&format=json`).then((data) => {
			return data.json()
		}).then((jsonObj) => {
			let shops = jsonObj[0]
			let lat = shops.lat
			let lon = shops.lon
			// Drop a pin at the location on the map with a link in the popup
			L.marker([lat, lon]).addTo(myMap).bindPopup(`<a href='/restaurant?${id}'>${name}</a>`)
		})
	})

	fetch('./api/all.json')
		.then((res) => {
			return res.json()
		})
		.then((idList) => {
			idList.forEach((id) => {
				let dirtyName = id.split('-').join(' ')
				let name = titleize(dirtyName)
				listOfPlaces.innerHTML += `<p class='prettyText'><a class='link' href='/restaurant?${id}'>${name}</a></p>`
				fetch(`./api/${id}.json`)
					.then(res => res.json())
					.then((restInfo) => {
						let address = restInfo.address
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

