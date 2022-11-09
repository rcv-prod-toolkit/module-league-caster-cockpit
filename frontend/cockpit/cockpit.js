const bluePlayers = document.querySelector('#bluePlayers')
const redPlayers = document.querySelector('#redPlayers')
const blueMultiLinkBtn = document.querySelector('#blueMultiLinkBtn')
const redMultiLinkBtn = document.querySelector('#redMultiLinkBtn')

let server = 'euw'

function displayData(e) {
  const data = e.state?.lcu.lobby ?? e.data

  bluePlayers.innerHTML = ''
  redPlayers.innerHTML = ''

  if (data === undefined) return
  if (!data._available) return

  let blueMultiLink = `https://euw.op.gg/multisearch/${server}?summoners=`
  let redMultiLink = `https://euw.op.gg/multisearch/${server}?summoners=`

  for (const player of data.members) {
    const playerRow = document.createElement('li')
    playerRow.classList.add('playerRow')
    playerRow.dataset.team = player.teamId

    const playerIcon = document.createElement('img')
    playerIcon.classList.add('playerIcon')
    playerIcon.src = `/serve/module-league-static/img/profileicon/${player.summonerIconId}.png`

    playerRow.appendChild(playerIcon)

    const name = document.createElement('h3')
    name.classList.add('name')
    name.innerText = player.summonerName

    const level = document.createElement('p')
    level.classList.add('level')
    level.innerText = 'Level:' + player.level

    const playerInfo = document.createElement('div')
    playerInfo.classList.add('playerInfo')
    playerInfo.appendChild(name)
    playerInfo.appendChild(level)

    playerRow.appendChild(playerInfo)

    const eloIcon = document.createElement('img')
    eloIcon.classList.add('eloIcon')

    const elo = document.createElement('p')
    elo.classList.add('elo')

    if (player.elo !== undefined && player.elo.tier !== 'NONE') {
      eloIcon.src = `/serve/module-league-static/img/elo/${player.elo.tier.toLowerCase()}.png`
      elo.innerText = `${player.elo.tier} ${player.elo.division}`
    } else {
      eloIcon.src = '/serve/module-league-static/img/elo/unranked.png'
    }

    const eloInfo = document.createElement('div')
    eloInfo.classList.add('eloInfo')
    eloInfo.appendChild(eloIcon)
    eloInfo.appendChild(elo)

    playerRow.appendChild(eloInfo)

    const playerLink = document.createElement('a')
    playerLink.classList.add('playerLink')
    playerLink.href = `https://www.op.gg/summoners/${server}/${player.summonerName}`
    playerLink.target = '_blank'
    playerLink.innerHTML = '<i class="fa fa-external-link"></i>'

    playerRow.appendChild(playerLink)

    if (player.teamId === 100) {
      blueMultiLink += player.summonerName + ','
      bluePlayers.appendChild(playerRow)
    } else {
      redMultiLink += player.summonerName + ','
      redPlayers.appendChild(playerRow)
    }
  }

  blueMultiLinkBtn.href = encodeURI(blueMultiLink.slice(0, -1))
  redMultiLinkBtn.href = encodeURI(redMultiLink.slice(0, -1))
}

async function initUi() {
  const data = await window.LPTE.request({
    meta: {
      namespace: 'module-league-state',
      type: 'request',
      version: 1
    }
  })

  displayData(data)

  const serverReq = await window.LPTE.request({
    meta: {
      namespace: 'plugin-webapi',
      type: 'fetch-location',
      version: 1
    }
  })

  server = serverReq.server.toLowerCase().replace(/[0-9]/g, '')
}

function showPlatings() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-platings',
      version: 1
    }
  })
}

function showGold() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-caster-cockpit',
      type: 'show-gold',
      version: 1
    }
  })
}

function mapZoom() {
  LPTE.emit({
    meta: {
      namespace: 'module-vmix',
      type: 'map-zoom',
      version: 1
    }
  })
}


window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-league-state', 'lobby-update', displayData)
})
