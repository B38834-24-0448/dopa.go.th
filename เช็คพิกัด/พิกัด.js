var locationList = []
var map
var areaPolygon // Store reference to clear later if needed

function init() {
  map = new longdo.Map({
    placeholder: document.getElementById('map')
  })

  map.Event.bind('ready', function () {
    randomMarker()
  })
}

function randomMarker() {
  locationList = [] // Reset list

  for (var i = 0; i < 6; ++i) {
    var loc = {
      lon: Math.random() * (101.0 - 100.0) + 100.0,
      lat: Math.random() * (15.0 - 13.5) + 13.5
    }
    locationList.push(loc)
    map.Overlays.add(new longdo.Marker(loc))
  }

  drawAreaAndBound()
}

/**
 * Calculates the bounding box and draws a polygon background
 * to highlight the markers' territory.
 */
function drawAreaAndBound() {
  if (locationList.length === 0) return

  // 1. Calculate the Envelope (Bounding Box)
  var boundValue = longdo.Util.locationBound(locationList)

  // 2. Create a Polygon as a background highlight
  // Note: For a true boundary, you'd use a Convex Hull,
  // but for a "background" we use the bounding box coordinates.
  if (areaPolygon) map.Overlays.remove(areaPolygon)

  areaPolygon = new longdo.Polygon(
    [
      { lon: boundValue.minLon, lat: boundValue.maxLat },
      { lon: boundValue.maxLon, lat: boundValue.maxLat },
      { lon: boundValue.maxLon, lat: boundValue.minLat },
      { lon: boundValue.minLon, lat: boundValue.minLat }
    ],
    {
      fillColor: 'rgba(37, 99, 235, 0.1)', // Light blue tint
      lineColor: 'rgba(37, 99, 235, 0.4)', // Subtle border
      lineWidth: 2,
      weight: longdo.OverlayWeight.Bottom // Ensure it stays behind the markers
    }
  )

  map.Overlays.add(areaPolygon)

  // 3. Zoom the map to fit the area
  map.bound(boundValue)
}
