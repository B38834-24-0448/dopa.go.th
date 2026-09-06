var map

// Custom notification logic
const showStatus = (msg) => {
  const existing = document.getElementById('map-status-bubble')
  if (existing) existing.remove()

  const bubble = document.createElement('div')
  bubble.id = 'map-status-bubble'
  bubble.style = `
    position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: rgba(24, 24, 27, 0.9); color: white; padding: 10px 20px;
    border-radius: 99px; font-family: sans-serif; font-size: 13px;
    z-index: 2000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: opacity 0.3s; pointer-events: none;
  `
  bubble.innerHTML = msg
  document.getElementById('map').appendChild(bubble)

  setTimeout(() => {
    bubble.style.opacity = '0'
    setTimeout(() => bubble.remove(), 300)
  }, 2000)
}

function init() {
  map = new longdo.Map({
    placeholder: document.getElementById('map'),
    location: { lon: 100.5231, lat: 13.7367 },
    zoom: 12
  })

  map.Event.bind('beforeContextmenu', function (event) {
    // 1. Setup the MenuItem Creator
    const createItem = (label, icon, onClick) => {
      const div = document.createElement('div')
      div.style =
        'padding: 10px 15px; cursor: pointer; font-family: sans-serif; font-size: 13px; border-bottom: 1px solid #eee;'
      div.innerHTML = `<span style="margin-right:8px">${icon}</span> ${label}`

      div.onmouseover = () => (div.style.backgroundColor = '#f4f4f5')
      div.onmouseout = () => (div.style.backgroundColor = 'transparent')
      div.onclick = () => {
        map.Ui.ContextMenu.visible(false)
        onClick()
      }
      return div
    }

    // 2. Action: Copy Coordinates
    event.add(
      createItem('Copy Coordinates', '📋', () => {
        const coordStr = `${event.location.lat.toFixed(6)}, ${event.location.lon.toFixed(6)}`
        navigator.clipboard.writeText(coordStr)
        showStatus(`Copied: ${coordStr}`)
      })
    )

    // 3. Action: Add Permanent Pin
    event.add(
      createItem('Drop Pin Here', '📍', () => {
        const marker = new longdo.Marker(event.location, {
          title: 'Saved Point',
          detail: `Lat: ${event.location.lat.toFixed(4)}<br>Lon: ${event.location.lon.toFixed(4)}`,
          draggable: false
        })
        map.Overlays.add(marker)
        showStatus('Marker added to map')
      })
    )
  })
}
