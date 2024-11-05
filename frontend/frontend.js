const updateUi = async () => {
  const server = await window.constants.getModuleURL()
  const location = `${server}/cockpit`

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#cockpit-embed').value = `${location}/index.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
}

updateUi()
