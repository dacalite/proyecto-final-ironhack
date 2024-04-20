window.addEventListener('load', main)

const startGame = (dificultad) => {
  const playerName = prompt('Nombre del jugador')
  window.location.href = `/game.html?dificultad=${dificultad}&player=${playerName}`
}

function main() {
  const botonFacil = document.getElementById('boton-facil')
  const botonMedio = document.getElementById('boton-medio')
  const botonDificil = document.getElementById('boton-dificil')
  const botonResetLeaderboard = document.getElementById('boton-reset')
  const startButton = document.getElementById('boton-jugar')
  const introDiv = document.getElementById('intro')
  const controlesDiv = document.getElementById('controles')

  const audio = new Audio('/assets/music.mp3')
  audio.loop = true
  audio.volume = .3
  startButton.addEventListener('click', () => {
    audio.play()
    introDiv.style.display = 'none'
    controlesDiv.style.display = 'flex'
  })

  botonFacil.addEventListener('click', () => {
    startGame('facil')
  })
  botonMedio.addEventListener('click', () => {
    startGame('medio')
  })
  botonDificil.addEventListener('click', () => {
    startGame('dificil')
  })

  botonResetLeaderboard.addEventListener('click', () => {
    window.localStorage.removeItem('leaderboard-facil')
    window.localStorage.removeItem('leaderboard-medio')
    window.localStorage.removeItem('leaderboard-dificil')
  })
}
