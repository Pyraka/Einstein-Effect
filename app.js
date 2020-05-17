let map;
  // define global array to store markers added
  let markersArray = []; 
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: 41.833, lng: 15.333 },  // centre de france.
        mapTypeId: 'terrain'
    });
    var elevator = new google.maps.ElevationService;
    var infowindow = new google.maps.InfoWindow({ map: map });
    
    // Add a listener for the click event. Display the elevation for the LatLng of
    // the click inside the infowindow.

    map.addListener('click', function(event) {
        console.log(event);
        addMarker(event.latLng);
      });
    map.addListener('click', function (event) {
        displayLocationElevation(event.latLng, elevator, infowindow);
        addMarker(event.latLng)
    });

    
}


var g = 9.81;
var c = 299792458; //en m/s
var Mt = 6.38 * Math.pow(10, 6);
var R = (2 * g * Mt * Mt) / (c * c);



let elevationObserver = {
    value1: undefined,
    value2: undefined,
    setValue: (newVal) => {
        if (!this.value1) {
            this.value1 = newVal;
            /*this.value1 = {
                elevation: newVal,
                lat: undefined,
                long: undefined,
            };*/
        }
        else if (!this.value2) {
            this.value2 = newVal;
            var ra = value1 + 6371000; //en m 
            var rb = value2 + 6371000; //en m
            var freq = Math.sqrt((1 - R / rb) / (1 - R / ra));

            var ele1 = document.getElementById('h1');
            ele1.textContent = value1 + 'm';
            var ele2 = document.getElementById('h2');
            ele2.textContent = value2 + 'm';

            var f = document.getElementById('f');
            f.textContent = freq;

            console.log(freq);
        }
        else {
            this.value1 = newVal;
            this.value2 = undefined;
        }

    }
}

function displayLocationElevation(location, elevator, infowindow) {
    // Initiate the location request
    elevator.getElevationForLocations({
        'locations': [location]
    }, function (results, status) {
        infowindow.setPosition(location);
        if (status === 'OK') {
            // Retrieve the first result
            if (results[0]) {
                // Open the infowindow indicating the elevation at the clicked position.
                infowindow.setContent('La hauteur en ce point <br>est ' +
                    results[0].elevation + ' m');
                elevationObserver.setValue(results[0].elevation);
            } else {
                infowindow.setContent('Aucun résultat');
            }
        } else {
            infowindow.setContent('Impossible de trouver la hauteur à cause de: ' + status);
        }
    });
}

function addMarker(latLng) {
    let marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true
    });
    markersArray.push(marker);
}