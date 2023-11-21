const bluePlayers = document.querySelector('#bluePlayers')
const redPlayers = document.querySelector('#redPlayers')
const blueMultiLinkBtn = document.querySelector('#blueMultiLinkBtn')
const redMultiLinkBtn = document.querySelector('#redMultiLinkBtn')

let gameServer = 'euw'
let lobby
let champselect
let inGame

let server

function setLobbyData(e) {
  const data = e.state?.lcu.lobby ?? e.data ?? lobby

  if (data === undefined) return

  lobby = data
  displayData()
}
function setChampselectData(e) {
  const data = e.state?.lcu.champselect ?? e.data ?? champselect

  if (data === undefined) return

  champselect = data
  displayData()
}
function setInGameData(e) {
  const data = e.state?.live ?? e.gameState ?? inGame

  if (data === undefined) return

  inGame = data
  displayData()
}

function displayData() {
  if (lobby.members === undefined) return

  bluePlayers.innerHTML = ''
  redPlayers.innerHTML = ''

  let blueMultiLink = `https://euw.op.gg/multisearch/${gameServer}?summoners=`
  let redMultiLink = `https://euw.op.gg/multisearch/${gameServer}?summoners=`

  for (const player of lobby.members) {
    const playerRow = document.createElement('li')
    playerRow.classList.add('playerRow')

    // Summoner Icon
    const playerIcon = document.createElement('img')
    playerIcon.classList.add('playerIcon')
    playerIcon.src = `/serve/module-league-static/img/profileicon/${player.summonerIconId}.png`
    playerRow.appendChild(playerIcon)

    // Summoner Name
    const name = document.createElement('h4')
    name.classList.add('name')
    name.innerText = player.nickname

    // Summoner level
    const level = document.createElement('p')
    level.classList.add('level')
    level.innerText = 'Level:' + player.summonerLevel

    // Summoner info
    const playerInfo = document.createElement('div')
    playerInfo.classList.add('playerInfo')
    playerInfo.appendChild(name)
    playerInfo.appendChild(level)
    playerRow.appendChild(playerInfo)

    // Summoner Elo
    const eloIcon = document.createElement('img')
    eloIcon.classList.add('eloIcon')
    const elo = document.createElement('p')
    elo.classList.add('elo')

    if (player.elo !== undefined && player.elo.tier !== 'NONE') {
      eloIcon.src = `/serve/module-league-static/img/elo/${player.elo.tier.toLowerCase()}.png`
      elo.innerText = `${player.elo.tier} ${
        player.elo.division !== 'NA' ? player.elo.division : ''
      }`
    } else {
      eloIcon.src = '/serve/module-league-static/img/elo/unranked.png'
    }

    const eloInfo = document.createElement('div')
    eloInfo.classList.add('eloInfo')
    eloInfo.appendChild(eloIcon)
    eloInfo.appendChild(elo)
    playerRow.appendChild(eloInfo)

    // Summoner Highlight
    const playerHighlight = document.createElement('button')
    playerHighlight.classList.add('player-highlight', 'btn', 'btn-primary')
    playerHighlight.innerHTML = 'Highlight'
    playerHighlight.onclick = () => {
      LPTE.emit({
        meta: {
          namespace: 'module-league-in-game',
          type: 'highlight-player',
          version: 1
        },
        playerId: player.sortedPosition,
        teamId: player.teamId
      })
    }
    playerRow.appendChild(playerHighlight)

    // Game Information
    const gameDataDiv = document.createElement('div')
    gameDataDiv.classList.add('game-data')

    // Champselect
    const cs =
      player.teamId === 100 ? champselect?.blueTeam : champselect?.redTeam
    const csPlayer = cs?.picks?.find((p) => p.displayName === player.nickname)

    if (csPlayer !== undefined) {
      // Champion
      const championIcon = document.createElement('img')
      championIcon.classList.add('championIcon')
      championIcon.src = csPlayer.champion.squareImg
      gameDataDiv.appendChild(championIcon)

      // Summoner Spells
      const spell1Icon = document.createElement('img')
      spell1Icon.classList.add('spellIcon')
      spell1Icon.src = csPlayer.spell1.icon
      gameDataDiv.appendChild(spell1Icon)
      const spell2Icon = document.createElement('img')
      spell2Icon.classList.add('spellIcon')
      spell2Icon.src = csPlayer.spell2.icon
      gameDataDiv.appendChild(spell2Icon)
    }

    // inGame
    const igPlayer = inGame?.player?.find((p) => p.nickname === player.nickname)

    if (igPlayer !== undefined) {
      // items
      const itemsDiv = document.createElement('div')
      itemsDiv.classList.add('items')

      for (const item of igPlayer.items) {
        const itemIcon = document.createElement('img')
        itemIcon.classList.add('item')
        itemIcon.src = `/serve/module-league-static/img/item/${item}.png`
        itemsDiv.appendChild(itemIcon)
      }

      gameDataDiv.appendChild(itemsDiv)
    }

    playerRow.appendChild(gameDataDiv)

    // Add Summoner to team
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
  server = await window.constants.getWebServerPort()

  const data = await window.LPTE.request({
    meta: {
      namespace: 'module-league-state',
      type: 'request',
      version: 1
    }
  })

  const serverReq = await window.LPTE.request({
    meta: {
      namespace: 'plugin-webapi',
      type: 'fetch-location',
      version: 1
    }
  })

  const lolServer = serverReq.server
  switch (lolServer) {
    case 'BR1':
      gameServer = 'br'
      break;
    case 'EUN1':
      gameServer = 'eune'
      break;
    case 'EUW1':
      gameServer = 'euw'
      break;
    case 'JP1':
      gameServer = 'jp'
      break;
    case 'KR':
      gameServer = 'kr'
      break;
    case 'LA1':
      gameServer = 'lan'
      break;
    case 'LA2':
      gameServer = 'las'
      break;
    case 'NA1':
      gameServer = 'na'
      break;
    case 'TR1':
      gameServer = 'tr'
      break;
    case 'RU':
      gameServer = 'ru'
      break;
    case 'OC1':
      gameServer = 'oce'
      break;
    case 'PH2':
      gameServer = 'ph'
      break;
    case 'SG2':
      gameServer = 'sg'
      break;
    case 'TH2':
      gameServer = 'th'
      break;
    case 'TW2':
      gameServer = 'tw'
      break;
    case 'VN2':
      gameServer = 'vn'
      break;
    default:
      gameServer = 'euw'
  }

  setLobbyData(data)
  setChampselectData(data)
  setInGameData(data)
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
function hidePlatings() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-platings',
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

function mapZoomIn() {
  LPTE.emit({
    meta: {
      namespace: 'module-vmix',
      type: 'MapZoomIn',
      version: 1
    }
  })
}
function mapZoomOut() {
  LPTE.emit({
    meta: {
      namespace: 'module-vmix',
      type: 'MapZoomOut',
      version: 1
    }
  })
}

function showLeaderBoard(leaderboard) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-leader-board',
      version: 1
    },
    leaderboard
  })
}
function hideLeaderBoard() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-leader-board',
      version: 1
    }
  })
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-league-state', 'lobby-update', setLobbyData)
  window.LPTE.on(
    'module-league-state',
    'champselect-update',
    setChampselectData
  )
  window.LPTE.on('module-league-state', 'save-live-game-stats', setInGameData)
})
