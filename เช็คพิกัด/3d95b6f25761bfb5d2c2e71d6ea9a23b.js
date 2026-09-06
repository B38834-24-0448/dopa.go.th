const apiKey = '3d95b6f25761bfb5d2c2e71d6ea9a23b' // Replace with your Longdo API key
let map
let searchCircle
let resultMarkers = []

function init() {
  // 1. Inject styles
  const style = document.createElement('style')
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    .status-panel {
      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 999px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
      padding: 10px 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
      font-weight: 500; color: #0f172a; z-index: 1000; text-align: center;
      transition: all 0.2s ease;
    }
  `
  document.head.appendChild(style)

  map = new longdo.Map({
    placeholder: document.getElementById('map'),
    location: { lon: 100.5, lat: 13.755 },
    zoom: 15
  })

  map.Event.bind('ready', function () {
    map.Event.bind('click', function (event) {
      performSpatialSearch(event)
    })

    showStatus('Click anywhere to find places within 500m')
  })
}

async function performSpatialSearch(location) {
  // Clear previous results and shapes
  map.Overlays.clear()
  resultMarkers = []

  const loc = map.location(location)

  // Draw a ~500m radius circle (0.005 degrees is roughly 500 meters)
  searchCircle = new longdo.Circle(loc, 0.005, {
    fillColor: 'rgba(59, 130, 246, 0.15)',
    lineColor: 'rgba(59, 130, 246, 0.6)',
    lineWidth: 2
  })
  map.Overlays.add(searchCircle)

  showStatus('Searching nearby places...')

  try {
    // Call the real Longdo POI API with a 500m span
    const url = `https://api.longdo.com/POIService/json/search?lon=${loc.lon}&lat=${loc.lat}&span=500m&limit=10&key=${apiKey}`
    const response = await fetch(url)
    const result = await response.json()

    if (result.data && result.data.length > 0) {
      result.data.forEach((item) => {
        const marker = new longdo.Marker(
          { lon: item.lon, lat: item.lat },
          {
            title: item.name,
            detail: `
              <div style="font-family: 'JetBrains Mono', monospace; padding: 4px;">
                <p style="font-size: 12px; color: #64748b; margin-bottom: 6px;">${item.address || 'No address provided'}</p>
                ${item.tel ? `<p style="font-size: 12px; color: #0f172a; font-weight: 500;">📞 ${item.tel}</p>` : ''}
              </div>
            `
          }
        )

        map.Overlays.add(marker)
        resultMarkers.push(marker)
      })

      showStatus(`Found ${result.data.length} places nearby`)
    } else {
      showStatus('No places found within 500m.')
    }
  } catch (error) {
    console.error('API Error:', error)
    showStatus('Error fetching nearby places.')
  }
}

function showStatus(msg) {
  let el = document.getElementById('status-box')
  if (!el) {
    el = document.createElement('div')
    el.id = 'status-box'
    el.className = 'status-panel'
    document.getElementById('map').parentElement.appendChild(el)
  }
  el.innerHTML = msg
}
