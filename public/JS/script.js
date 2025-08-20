const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude,accuracy} = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
        socket.emit("send-location", { latitude, longitude,accuracy })
    }, (error) => {
        console.log(error)
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,

    }
);
}

const map=L.map("map").setView([0,0],10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "openStreetMap"
}).addTo(map);

const markers={};

socket.on("receive-location",(data)=>{
    const {latitude,longitude,id}=data;
    map.panTo([latitude,longitude])

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
    }
})

