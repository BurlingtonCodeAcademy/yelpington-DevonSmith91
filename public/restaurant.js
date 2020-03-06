/* ---------------------- Restaurant deets ----------------- */

let url = window.location.search
let urlArray = url.split('?')
let id = urlArray.pop()

let htmlName = document.getElementById('name')
let htmlNotes = document.getElementById('notes')
let htmlPhone = document.getElementById('phone')
let htmlAddress = document.getElementById('address')
let htmlHours = document.getElementById('hours')

async function locationDetails() {
    let restaurantDetails = await fetch(`https://json-server.burlingtoncodeacademy.now.sh/restaurants/${id}`)
    .then((response) => {
        return response.json()
    }).then((jsonObj) => {
        return jsonObj
    })

    htmlName.textContent = restaurantDetails.name
    htmlNotes.innerHTML = restaurantDetails.notes.join('<br /><br />')
    htmlPhone.textContent = restaurantDetails.phone
    htmlAddress.textContent = restaurantDetails.address
    htmlHours.textContent = restaurantDetails.hours
    
    fetch(`https://nominatim.openstreetmap.org/search/?q=${restaurantDetails.address}&format=json`).then((data) =>{
        return data.json()
    }).then ((locInfo) => {
        let info = locInfo[0]
        let lat = info.lat
        let lon = info.lon
        myMap.setView([lat, lon], 18)
        L.marker([lat, lon]).addTo(myMap)
    })
}

locationDetails()

/* ----------------------- Map deets ----------------------- */


let myMap = L.map('mapid').setView([44.4759, -73.2121], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)
