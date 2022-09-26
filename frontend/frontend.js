const blueTeam = document.querySelector('.team.blue')
const redTeam = document.querySelector('.team.red')

function displayData(e) {
  console.log(e)
  const data = e.state?.lcu.lobby?.player ?? e.data

  blueTeam.innerHTML = ''
  redTeam.innerHTML = ''

  if (data === undefined) {
    return
  }

  let blueMultiLink = 'https://euw.op.gg/multisearch/euw?summoners='
  let redMultiLink = 'https://euw.op.gg/multisearch/euw?summoners='

  for (const player of data) {
    const playerRow = document.createElement('div')
    playerRow.classList.add('playerRow')

    const playerIcon = document.createElement('img')
    playerIcon.classList.add('playerIcon')
    playerIcon.src = `/serve/module-league-static/img/profileicon/${player.icon}.png`

    playerRow.appendChild(playerIcon)

    const name = document.createElement('h3')
    name.classList.add('name')
    name.innerText = player.name

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
    playerLink.href = player.opgg
    playerLink.target = '_blank'
    playerLink.innerHTML = '<i class="fa fa-external-link"></i>'

    playerRow.appendChild(playerLink)

    if (player.team === 100) {
      blueMultiLink += player.name + ','
      blueTeam.appendChild(playerRow)
    } else {
      redMultiLink += player.name + ','
      redTeam.appendChild(playerRow)
    }
  }

  const blueMultiLinkBtn = document.createElement('a')
  blueMultiLinkBtn.classList.add(
    'multiLinkBtn',
    'btn',
    'btn-primary',
    'btn-block'
  )
  blueMultiLinkBtn.href = encodeURI(blueMultiLink.slice(0, -1))
  blueMultiLinkBtn.target = '_blank'
  blueMultiLinkBtn.innerHTML = 'OP.GG Overview'

  blueTeam.appendChild(blueMultiLinkBtn)

  const redMultiLinkBtn = document.createElement('a')
  redMultiLinkBtn.classList.add(
    'multiLinkBtn',
    'btn',
    'btn-primary',
    'btn-block'
  )
  redMultiLinkBtn.href = encodeURI(redMultiLink.slice(0, -1))
  redMultiLinkBtn.target = '_blank'
  redMultiLinkBtn.innerHTML = 'OP.GG Overview'

  redTeam.appendChild(redMultiLinkBtn)
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
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-league-state', 'lobby-update', displayData)
})
