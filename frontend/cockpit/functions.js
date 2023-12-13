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

/* ----- */

function mapZoomIn() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-caster-cockpit',
      type: 'MapZoomIn',
      version: 1
    }
  })
}
function mapZoomOut() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-caster-cockpit',
      type: 'MapZoomOut',
      version: 1
    }
  })
}

/* ----- */

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

/* ----- */

function showGoldGraph() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-gold-graph',
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