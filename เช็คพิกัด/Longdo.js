var map

function init() {
  map = new longdo.Map({
    placeholder: document.getElementById('map'),
    location: { lon: 100.5231, lat: 13.7367 },
    zoom: 12
  })

  map.Event.bind('ready', function () {
    map.Ui.lockMap()

    const lockButton = map.placeholder().querySelector('.ldmap_lock_button')

    if (lockButton) {
      lockButton.style.cssText = `
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: #18181b;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
        white-space: nowrap;
        width: fit-content;
      `

      let locked = true

      const updateButton = (isLocked) => {
        lockButton.innerHTML = isLocked
          ? `Map Locked &nbsp;<span style="opacity:0.5;font-weight:400;">Click to unlock</span>`
          : `Map Unlocked &nbsp;<span style="opacity:0.5;font-weight:400;">Click to lock</span>`
        lockButton.style.background = isLocked ? '#18181b' : '#68b3ff'
      }

      // check state via overlay screen
      const lockOverlay = map.placeholder().querySelector('.ldmap_lock_overlay')

      const setLocked = (isLocked) => {
        locked = isLocked
        if (lockOverlay) {
          lockOverlay.style.display = isLocked ? '' : 'none'
        }
        updateButton(locked)
      }

      // Set initial state
      updateButton(locked)

      lockButton.addEventListener('mouseenter', function () {
        this.style.opacity = '0.85'
      })
      lockButton.addEventListener('mouseleave', function () {
        this.style.opacity = '1'
      })

      lockButton.addEventListener('click', function () {
        setLocked(!locked)
      })
    }
  })
}
