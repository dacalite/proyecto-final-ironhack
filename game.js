// Cuando se cargan todos los elementos del DOM empezamos el juego
window.addEventListener('load', cuentaAtras)

// Función que muestra la cuenta atrás para empezar el juego
function cuentaAtras() {
  // Obtenemos el elemento del DOM
  const finalTextElement = document.getElementById('finalText')

  //Empezamos la cuenta atrás
  finalTextElement.innerText = 'Preparados...'

  setTimeout(function () {
    finalTextElement.innerText = '3'

    setTimeout(function () {
      finalTextElement.innerText = '2'

      setTimeout(function () {
        finalTextElement.innerText = '1'

        setTimeout(function () {
          finalTextElement.innerText = '¡Dispara!'
          setTimeout(startGame, 200) // Espera 0.2 segundos antes de llamar a startGame()
        }, 1000) // Espera 1 segundo
      }, 1000) // Espera 1 segundo
    }, 1000) // Espera 1 segundo
  }, 1000) // Espera 1 segundo
}

// Función principal
function startGame() {
  // Cargamos la música de fondo, la ponemos en bucle y ajustamos el volumen
  const audio = new Audio('/assets/music.mp3')
  audio.loop = true
  audio.volume = 0.4

  // Cuando hace click con el ratón empieza la música de fondo y además por cada click se reproduce el sonido de disparo láser
  document.addEventListener('mousedown', () => {
    audio.play()
    const laserGun = new Audio('/assets/gun.mp3')
    laserGun.volume = 0.8
    laserGun.play()
  })

  // Obtenemos los elementos del DOM que queramos manipular
  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')
  const counterElement = document.getElementById('countdown')
  const finalTextElement = document.getElementById('finalText')
  const restartButtonElement = document.getElementById('restartButton')

  // Mostramos la cuenta atrás
  counterElement.style.visibility = 'visible'

  // Cuando se pulse el botón de volver a jugar se redirige a la página de inicio
  restartButtonElement.addEventListener('click', () => {
    window.location.href = '/index.html'
  })

  // Inicialmente el botón de volver a jugar está oculto y el texto final de la puntuación también
  restartButtonElement.style.display = 'none'
  finalTextElement.textContent = ''

  // Se establece el canvas con ancho y alto de todo el viewport
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Se obtienen los settings de la partida de los queryparams (dificultad y nombre del jugador)
  const urlParams = new URLSearchParams(window.location.search)
  const dificultad = urlParams.get('dificultad')
  const playerName = urlParams.get('player')

  // Variable para la cuenta atrás hasta fin de partida
  let countdown

  // En función de la dificultad se le da más o menos tiempo al jugador
  switch (dificultad) {
    case 'facil':
    default:
      countdown = 20
      break
    case 'medio':
      countdown = 10
      break
    case 'dificil':
      countdown = 5
      break
  }

  // Puntuación inicial de la partida
  let score = 0

  // Ponemos en pantalla el tiempo que le queda al jugador
  counterElement.textContent = 'Tiempo restante: ' + countdown

  // Objeto alien que dibujaremos
  const alien = {
    x: Math.random() * canvas.width, // Posición X aleatoria
    y: Math.random() * canvas.height, // Posición Y aleatoria
    radius: Math.random() * (130 - 70) + 70, // Tamaño aleatorio entre 70 y 130 píxeles
  }

  // Función que dibuja la nave alienígena
  function drawSpaceship() {
    // Cargamos la imagen de la nave
    const spaceshipImage = new Image()

    // Cuando se carga le establecemos la posición X e Y y el tamaño
    spaceshipImage.onload = function () {
      const x = alien.x - alien.radius
      const y = alien.y - alien.radius
      const width = alien.radius
      const height = alien.radius

      // Dibujamos la imagen en el contexto 2D del canvas
      ctx.drawImage(spaceshipImage, x, y, width, height)
    }
    spaceshipImage.src = 'assets/alien.png'
  }

  // Función para dibujar una explosión encima del alien cuando este muere
  function drawExplosion() {
    // Cargamos la imagen de la explosión
    const explosionImage = new Image()

    // Cuando se carga la ponemos en la misma posición y con el mismo tamaño que el alien actual
    explosionImage.onload = function () {
      const x = alien.x - alien.radius
      const y = alien.y - alien.radius
      const width = alien.radius
      const height = alien.radius

      // Dibujamos la imagen en el canvas
      ctx.drawImage(explosionImage, x, y, width, height)
    }
    explosionImage.src = 'assets/explosion.png'
  }

  // Función que genera un alien aleatorio en el canvas
  function generateRandomAlien() {
    // Le establecemos la posición aleatoriamente en un área confinada en el centro del canvas
    alien.x = Math.random() * canvas.width * 0.4 + canvas.width * 0.3
    alien.y = Math.random() * canvas.height * 0.4 + canvas.height * 0.3

    // Le establecemos el tamaño entre 70 y 130
    alien.radius = Math.random() * (130 - 70) + 70

    // Dibujamos la nave alienígena
    drawSpaceship()
  }

  // Función que actualiza la cuenta atrás
  function updateCountdown() {
    // Le restamos 1 segundo al tiempo que le queda al jugador
    countdown--

    // Actualizamos el texto con el tiempo que le queda
    counterElement.textContent = 'Tiempo restante: ' + countdown

    // Cuando llega a 0 la cuenta atrás acabamos la partida, cargamos la puntuación en la leaderboard y la mostramos
    if (countdown <= 0) {
      endGame()
      loadScoreToLeaderboard()
      showLeaderboard()
    }
  }

  // Función que termina el juego
  function endGame() {
    // Quitamos los intervalos de la cuenta atrás
    clearInterval(countdownInterval)

    // Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Quitamos el temporizador
    counterElement.textContent = ''

    // Quitamos el listener
    canvas.removeEventListener('click', handleClick)
  }

  // Función que carga la puntuación en la leaderboard
  function loadScoreToLeaderboard() {
    // Obtener el leaderboard del localStorage
    let leaderboard =
      JSON.parse(localStorage.getItem(`leaderboard-${dificultad}`)) || {}

    // Actualizar la puntuación del jugador si es mayor que la anterior
    if (!leaderboard[playerName] || score > leaderboard[playerName]) {
      leaderboard[playerName] = score
    }

    // Guardar el leaderboard actualizado en el localStorage de nuevo
    localStorage.setItem(
      `leaderboard-${dificultad}`,
      JSON.stringify(leaderboard)
    )
  }

  // Función que muestra la tabla de puntuación
  function showLeaderboard() {
    // Obtener el leaderboard del localStorage
    let leaderboard =
      JSON.parse(localStorage.getItem(`leaderboard-${dificultad}`)) || {}

    // Convertir el leaderboard en un array de objetos [playerName, score]
    let leaderboardArray = Object.entries(leaderboard)

    // Ordenar el array por la puntuación en orden descendente
    leaderboardArray.sort((a, b) => b[1] - a[1])

    // Tomar solo los primeros 3 elementos del array (o menos si hay menos de 3 jugadores con puntuación)
    leaderboardArray = leaderboardArray.slice(0, 3)

    // Crear el texto que se mostrará en la pantalla
    let leaderboardText = `${score} PTS.<br><br>TOP 3 (${dificultad})<br>`
    leaderboardArray.forEach((player, index) => {
      leaderboardText += `${index + 1}. <b>${player[0]}:</b> ${player[1]}<br>`
    })

    // Poner la información el leaderboard en la pantalla
    finalTextElement.innerHTML += leaderboardText

    // Mostrar el elemento que estaba oculto antes
    restartButtonElement.style.display = 'block'

    // Limpiamos de nuevo el canvas por si quedó algún alien dibujado
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Función que maneja la pulsación del ratón
  function handleClick(event) {
    // Se calcula la posición en la que el usuario ha hecho click
    const clickX = event.offsetX
    const clickY = event.offsetY

    // Se calcula con el teorema de pitágoras la distancia de la hipotenusa que es desde el cursor hasta el alien actual
    const distance = Math.sqrt(
      (clickX - alien.x) ** 2 + (clickY - alien.y) ** 2
    )

    // Se mira si se ha acertado en el alien
    if (distance <= alien.radius) {
      // Se incrementa en 1 la puntuación actual
      score++

      // Se muestra la explosión encima del alien
      drawExplosion()

      // Se limpia el canvas después de 100ms para que de tiempo a ver la explosión
      setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        generateRandomAlien()
      }, 100)
    }
  }

  // Empezamos el juego generando un alien aleatorio
  generateRandomAlien()

  // Empieza la cuenta atrás
  const countdownInterval = setInterval(updateCountdown, 1000)

  // Registramos el listener para el click del ratón
  canvas.addEventListener('click', handleClick)
}
