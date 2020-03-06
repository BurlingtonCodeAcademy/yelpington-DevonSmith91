/* ------------------------------ JavaScript for the Map ----------------------- */
let myMap = L.map('mapid').setView([44.4759, -73.2121], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)


/* --------------------------- JavaScript for fetching Data -------------------- */

let listOfPlaces = document.getElementById('listOfPlaces')

async function locationDetails() {
	let fullDetails = await fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
	.then((response) => {
		return response.json()
	}).then ((jsonObj) => {
		return jsonObj
	})

	fullDetails.forEach((place) => {
		let location = place.address
		let name = place.name
		let id = place.id
		listOfPlaces.innerHTML += `<p class='prettyText'><a href='/restaurant?${id}'>${name}</a></p>`

		fetch(`https://nominatim.openstreetmap.org/search/?q=${location}&format=json`).then((data) => {
			return data.json()
		}).then((jsonObj) => {
			let shops = jsonObj[0]
			let lat = shops.lat
			let lon = shops.lon
			L.marker([lat, lon]).addTo(myMap).bindPopup(`<a href='/restaurant?${id}'>${name}</a>`)
		})
	})
}

locationDetails()
