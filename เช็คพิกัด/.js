var map
var allMarkers = []
var counterEl

function init() {
  map = new longdo.Map({
    placeholder: document.getElementById('map'),
    ui: longdo.UiComponent.Full
  })

  map.Event.bind('ready', function () {
    // 1. Setup UI for feedback
    const infoBox = document.createElement('div')
    infoBox.style.cssText = `
      position: absolute; top: 40px; right: 20px; z-index: 1000;
      background: white; padding: 15px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-family: sans-serif;
    `

    counterEl = document.createElement('div')
    counterEl.style.cssText = 'font-size: 24px; color: #2563eb; font-weight: bold; margin: 10px 0;'
    counterEl.innerText = '0 Markers'

    const title = document.createElement('b')
    title.style.fontSize = '14px'
    title.innerText = 'Spatial Analysis'

    const hint = document.createElement('p')
    hint.style.cssText = 'font-size: 11px; color: #64748b; margin: 0;'
    hint.innerHTML = 'Use the <b>Polygon Tool</b> in the top toolbar to draw an area.'

    infoBox.appendChild(title)
    infoBox.appendChild(counterEl)
    infoBox.appendChild(hint)

    document.getElementById('map').appendChild(infoBox)

    // 2. Generate 50 random markers in the Bangkok area
    generateRandomMarkers(50)

    // 3. Enable the Toolbar
    map.Ui.Toolbar.visible(true)

    map.Event.bind('overlayChange', function (overlay) {
      if (overlay instanceof longdo.Polygon) {
        countMarkersInside(overlay)
      }
    })
  })
}

function generateRandomMarkers(count) {
  const center = { lat: 13.75, lon: 100.5 }
  for (var i = 0; i < count; i++) {
    const loc = {
      lat: center.lat + (Math.random() - 0.5) * 0.5,
      lon: center.lon + (Math.random() - 0.5) * 0.5
    }
    const marker = new longdo.Marker(loc, { weight: longdo.OverlayWeight.Top })
    allMarkers.push(marker)
    map.Overlays.add(marker)
  }
}

function countMarkersInside(polygon) {
  let insideCount = 0

  allMarkers.forEach((marker) => {
    if (polygon.contains(marker)) {
      insideCount++
    }
  })

  counterEl.innerText = `${insideCount} Markers` 
}
