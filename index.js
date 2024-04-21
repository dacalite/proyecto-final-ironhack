// Cuando se carguen los elementos del DOM ejecutamos la función main
window.addEventListener('load', main)

// Función para empezar el juego (redirigir con los queryparams adecuados)
const startGame = (dificultad) => {
  // Se pide el nombre del jugador
  const playerName = prompt('Nombre del jugador')

  // Se redirige a la página game.html
  window.location.href = `/game.html?dificultad=${dificultad}&player=${playerName}`
}

// Función principal
function main() {
  // Cogemos los elementos del Dom que queremos manipular
  const botonFacil = document.getElementById('boton-facil')
  const botonMedio = document.getElementById('boton-medio')
  const botonDificil = document.getElementById('boton-dificil')
  const botonResetLeaderboard = document.getElementById('boton-reset')
  const startButton = document.getElementById('boton-jugar')
  const introDiv = document.getElementById('intro')
  const controlesDiv = document.getElementById('controles')

  // Cargamos la música de fondo, la ponemos en bucle y ajustamos el volumen
  const audio = new Audio('/assets/music.mp3')
  audio.loop = true
  audio.volume = 0.3

  // Cuando el usuario haga click en el botón de empezar se reproduce la música y se muestran las opciones de dificultad
  startButton.addEventListener('click', () => {
    audio.play()
    introDiv.style.display = 'none'
    controlesDiv.style.display = 'flex'
  })

  // Si selecciona la dificultad fácil se empieza el juego
  botonFacil.addEventListener('click', () => {
    startGame('facil')
  })

  // Si selecciona la dificultad media se empieza el juego
  botonMedio.addEventListener('click', () => {
    startGame('medio')
  })

  // Si selecciona la dificultad difícil se empieza el juego
  botonDificil.addEventListener('click', () => {
    startGame('dificil')
  })

  // Si selecciona "resetear las tablas de puntuación" se eliminan del localStorage las 3 leaderboards correspondientes a las 3 dificultades
  botonResetLeaderboard.addEventListener('click', () => {
    window.localStorage.removeItem('leaderboard-facil')
    window.localStorage.removeItem('leaderboard-medio')
    window.localStorage.removeItem('leaderboard-dificil')
    alert('¡Tablas de puntuación reseteadas!')
  })
}
