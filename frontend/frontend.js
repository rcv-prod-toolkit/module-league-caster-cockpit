const namespace = 'module-league-lobby'

function displayData (e) {
  const data = e.data

  console.log(data)
}

async function initUi () {
  const data = await window.LPTE.request({
    meta: {
      namespace: 'module-league-state',
      type: 'request-lobby',
      version: 1
    }
  })

  displayData(data)
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-league-state', 'lobby-update', displayData)
})
