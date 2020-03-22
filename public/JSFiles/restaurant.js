/* -------------------- Restaurant details ----------------- */

// pull ID out of page name
let url = window.location.search
let urlArray = url.split('?')
let id = urlArray.pop()

// Breakdown of the detail sections
let htmlName = document.getElementById('name')
let htmlNotes = document.getElementById('notes')
let htmlPhone = document.getElementById('phone')
let htmlAddress = document.getElementById('address')
let htmlHours = document.getElementById('hours')


async function locationDetails() {
    // fetch restaurant info from API
    let restaurantDetails = await fetch(`/api/${id}.json`)
        .then(res => res.json())
        .then((jsonObject) => {
            return jsonObject
        })
    // Assign restaurant information to each section
    htmlName.textContent = restaurantDetails.name
    htmlNotes.innerHTML = restaurantDetails.notes.join('<br/><br/>')
    htmlPhone.textContent = restaurantDetails.phone
    htmlAddress.textContent = restaurantDetails.address
    htmlHours.textContent = restaurantDetails.hours

    // Fetch the address in nominatim to get Lat/Lon
    fetch(`https://nominatim.openstreetmap.org/search/?q=${restaurantDetails.address}&format=json`).then((data) => {
        return data.json()
    }).then((locInfo) => {
        let info = locInfo[0]
        let lat = info.lat
        let lon = info.lon
        // Set Map view and drop pin
        myMap.setView([lat, lon], 18)
        L.marker([lat, lon]).addTo(myMap)
    })

}

locationDetails()


/* ---------------------- Map details ----------------------- */

// Start map with a view of burlington
let myMap = L.map('mapid').setView([44.4759, -73.2121], 15);

// Map tile details
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)



// -----------------------------------------------------------



// Demo for saving to local storage. 



// let commentForm = document.getElementById('comments')
// let myStorage = window.localStorage
// commentForm.addEventListener('submit', (event) => {
//     let commentArray = myStorage.getItem('comments' + id) || []
//     commentArray.push({ name: event.target.body.name, comment: event.target.body.comment })
//     myStorage.getItems('comments' + id) ? myStorage.removeItem('comments' + id) : null
//     myStorage.setItem('comments' + id, commentArray)
//     commentArray.forEach((comment) => {
//         document.getElementById('comment-display').innerHTML += `<p>${comment.name}:</p><p>${comment.comment}</p>`
//         })
// })