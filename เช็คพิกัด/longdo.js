function init() {
  var map = new longdo.Map({
    placeholder: document.getElementById('map')
  });

  map.Event.bind('ready', function() {
    // 1. THE INSPECTOR UI
    const inspector = document.createElement('div')
    inspector.style = `
      position: absolute; top: 20px; right: 20px; z-index: 1000;
      background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
      padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); width: 280px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
    `
    inspector.innerHTML = `
      <div style="font-weight: 800; margin-bottom: 12px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
        GEOMETRY INSPECTOR
      </div>
      <div id="inspect-content" style="color: #64748b;">
        Click any shape on the map to inspect its data...
      </div>
    `
    document.getElementById('map').appendChild(inspector)
    
    // 2. THE EVENT HANDLER
    map.Event.bind('overlayClick', function (overlay) {
      let type = 'Unknown'
      let color = '#64748b'
    
      if (overlay instanceof longdo.Marker) {
        type = 'Marker'
        color = '#ef4444'
      } else if (overlay instanceof longdo.Polyline) {
        type = 'Polyline'
        color = '#3b82f6'
      } else if (overlay instanceof longdo.Rectangle) {
        type = 'Rectangle'
        color = '#f59e0b'
      } // Check Rectangle before Polygon
      else if (overlay instanceof longdo.Polygon) {
        type = 'Polygon'
        color = '#8b5cf6'
      } else if (overlay instanceof longdo.Dot) {
        type = 'Dot'
        color = '#10b981'
      } else if (overlay instanceof longdo.Circle) {
        type = 'Circle'
        color = '#ec4899'
      } else if (overlay instanceof longdo.Polycurve) {
        type = 'Polycurve'
        color = '#06b6d4'
      }
    
      const content = document.getElementById('inspect-content')
      content.innerHTML = `
            <div style="background: ${color}; color: white; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px; font-weight: bold;">
                ${type.toUpperCase()}
            </div>
            <div style="display: grid; gap: 6px;">
                <div><b style="color:#1e293b">ID:</b> ${overlay.Z || 'N/A'}</div>
                <div><b style="color:#1e293b">Weight:</b> ${overlay.weight || 'Default'}</div>
                <div><b style="color:#1e293b">Visible:</b> ${overlay.visible ? 'Yes' : 'No'}</div>
                <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; pt: 8px; word-break: break-all;">
                    <b style="color:#1e293b">Location Data:</b><br/>
                    ${JSON.stringify(overlay.location()).substring(0, 100)}...
                </div>
            </div>
        `
    })
    
    // 3. DRAW ALL TYPES
    const center = { lon: 100.523, lat: 13.736 }
    
    const shapes = [
      new longdo.Marker({ lon: 100.52, lat: 13.74 }, { title: 'Marker' }),
    
      new longdo.Dot({ lon: 100.522, lat: 13.74 }, { lineWidth: 10, lineColor: '#10b981' }),
    
      new longdo.Circle({ lon: 100.525, lat: 13.74 }, 0.001, {
        fillColor: 'rgba(236, 72, 153, 0.3)',
        lineColor: '#ec4899'
      }),
    
      new longdo.Rectangle(
        { lon: 100.52, lat: 13.734, width: 0.002, height: 0.002 },
        { fillColor: 'rgba(245, 158, 11, 0.3)', lineColor: '#f59e0b' }
      ),
    
      new longdo.Polygon(
        [
          { lon: 100.526, lat: 13.736 },
          { lon: 100.529, lat: 13.736 },
          { lon: 100.527, lat: 13.733 }
        ],
        { fillColor: 'rgba(139, 92, 246, 0.3)', lineColor: '#8b5cf6' }
      ),
    
      new longdo.Polyline(
        [
          { lon: 100.518, lat: 13.732 },
          { lon: 100.522, lat: 13.73 },
          { lon: 100.525, lat: 13.732 }
        ],
        { lineColor: '#3b82f6', lineWidth: 4 }
      ),
    
      new longdo.Polycurve(
        [
          { lon: 100.513, lat: 13.736 }, // Start
          { lon: 100.523, lat: 13.746 }, // Control Point 1 (Pull Up)
          { lon: 100.523, lat: 13.726 }, // Control Point 2 (Pull Down)
          { lon: 100.533, lat: 13.736 }
        ],
        {
          lineWidth: 10,
          lineColor: 'rgba(0, 0, 0, 0.9)',
          weight: longdo.OverlayWeight.Top
        }
      )
    ]
    
    shapes.forEach((s) => map.Overlays.add(s))
    
    // 4. BOUND THE VIEW
    map.bound({
      minLon: 100.515,
      minLat: 13.728,
      maxLon: 100.536,
      maxLat: 13.745
    })
    
  });
}
