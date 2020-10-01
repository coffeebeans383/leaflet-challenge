var myMap = L.map('map', {
  center: [39.83, -98.58],
  zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

function magColorScale(mag) {
  switch(true) {
      case mag < 1:
          return "#ffe6e6";
          break;
      case mag < 2:
          return "#ffb3b3";
          break;
      case mag < 3:
          return "#ff6666";
          break;
      case mag < 4:
          return "#ff3333";
          break;
      case mag < 5:
          return "#b30000";
          break;
      default:
          return "#660000";
  }
}
//pull in API data from USGS
var query = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//funnel data and link to color specific marker
d3.json(query, data => {
  console.log(data.features);
  data.features.forEach(d => {
      L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
          fillOpacity: 0.2 + d.properties.mag / 10,
          color: '#ffe6e6',
          weight: .5,
          fillColor: magColorScale(d.properties.mag),
          radius: d.properties.mag * 7
//bind info to clickable popup
      }).bindPopup("Site: " + d.properties.place
                  + "<br/>Magnitude: " + d.properties.mag
                  + "<br/>Time:" + d.properties.time
                      ).addTo(myMap);
  });
  
// Add color scale legend
var legend = L.control({ position: "bottomleft" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = [0,1,2,3,4,5]
  var colors = ["#ffe6e6", "#ffb3b3","#ff6666","#ff3333","#b30000","#660000"]
  var labels = ['0 - .99','1 - .99','2 - 2.99','3 - 3.99','4 - 4.99','5+'];

  // Add legend
  var leg = "<h2>Scale of Magnitude</h2>"

  div.innerHTML = leg;

  limits.forEach(function(limits, index) {
    div.innerHTML += "<li style=\"background-color: " + colors[index] + "\">"+labels[index]+"</li>"
  });
  return div;
};
  legend.addTo(myMap);
});