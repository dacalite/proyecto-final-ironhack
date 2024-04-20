window.addEventListener('load', startGame)

function startGame() {
  const audio = new Audio('/assets/music.mp3')
  audio.loop = true
  audio.volume = 0.4
  document.addEventListener('mousedown', () => {
    audio.play()
    const laserGun = new Audio('/assets/gun.mp3')
    laserGun.volume = 0.8
    laserGun.play()
  })
  document.addEventListener('mousemove', drawLaser)

  var canvas = document.getElementById('myCanvas')
  var ctx = canvas.getContext('2d')
  var counterElement = document.getElementById('countdown')
  var finalTextElement = document.getElementById('finalText')
  const restartButtonElement = document.getElementById('restartButton')
  restartButtonElement.addEventListener('click', () => {
    window.location.href = '/index.html'
  })
  restartButtonElement.style.display = 'none'
  finalTextElement.textContent = ''

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const urlParams = new URLSearchParams(window.location.search)
  const dificultad = urlParams.get('dificultad')
  const playerName = urlParams.get('player')
  let countdown

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

  var score = 0 // Puntuación inicial

  counterElement.textContent = 'Tiempo restante: ' + countdown

  var circle = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * (130 - 70) + 70,
  }

  function drawSpaceship() {
    var spaceshipImage = new Image()
    spaceshipImage.onload = function () {
      var x = circle.x - circle.radius
      var y = circle.y - circle.radius
      var width = circle.radius
      var height = circle.radius
      ctx.drawImage(spaceshipImage, x, y, width, height)
    }
    spaceshipImage.src = 'assets/alien.png'
  }

  function drawExplosion() {
    var explosionImage = new Image()
    explosionImage.onload = function () {
      var x = circle.x - circle.radius
      var y = circle.y - circle.radius
      var width = circle.radius
      var height = circle.radius
      ctx.drawImage(explosionImage, x, y, width, height)
    }
    explosionImage.src = 'assets/explosion.png'
  }

  function generateRandomAlien() {
    circle.x = Math.random() * canvas.width * 0.4 + canvas.width * 0.3
    circle.y = Math.random() * canvas.height * 0.4 + canvas.height * 0.3
    circle.radius = Math.random() * (130 - 70) + 70
    drawSpaceship()
  }

  function updateCountdown() {
    countdown--
    counterElement.textContent = 'Tiempo restante: ' + countdown
    if (countdown <= 0) {
      endGame()
      loadScoreToLeaderboard()
      showLeaderboard()
    }
  }

  function endGame() {
    clearInterval(countdownInterval)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    counterElement.textContent = ''
    canvas.removeEventListener('click', handleClick)
    document.removeEventListener('mousemove', drawLaser)
  }

  function loadScoreToLeaderboard() {
    // Obtener el leaderboard del localStorage
    let leaderboard =
      JSON.parse(localStorage.getItem(`leaderboard-${dificultad}`)) || {}

    // Actualizar la puntuación del jugador si es mayor que la anterior
    if (!leaderboard[playerName] || score > leaderboard[playerName]) {
      leaderboard[playerName] = score
    }

    // Guardar el leaderboard actualizado en el localStorage
    localStorage.setItem(
      `leaderboard-${dificultad}`,
      JSON.stringify(leaderboard)
    )
  }
  let lastLaserRef = undefined
  // Función para dibujar la línea del rayo láser
  function drawLaser(event) {
    !lastLaserRef && ctx.clearRect(0, lastLaserRef.y - 3, canvas.width, 3)
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, canvas.height) // Inicio desde el centro inferior del canvas
    ctx.lineTo(event.clientX, event.clientY) // Fin en la posición del ratón
    ctx.strokeStyle = 'rgba(0,255,0,0.5)' // Color del rayo láser
    ctx.lineWidth = 3 // Grosor del rayo láser
    ctx.stroke() // Dibujar el rayo láser
    lastLaserRef = { x: event.clientX, y: event.clientY }
  }

  function showLeaderboard() {
    // Obtener el leaderboard del localStorage
    let leaderboard =
      JSON.parse(localStorage.getItem(`leaderboard-${dificultad}`)) || {}

    // Convertir el leaderboard en un array de objetos [playerName, score]
    let leaderboardArray = Object.entries(leaderboard)

    // Ordenar el array por la puntuación en orden descendente
    leaderboardArray.sort((a, b) => b[1] - a[1])

    // Tomar solo los primeros 5 elementos del array (o menos si hay menos de 5 jugadores)
    leaderboardArray = leaderboardArray.slice(0, 3)

    // Crear el texto del leaderboard
    let leaderboardText = `TOP 3 (${dificultad})<br>`
    leaderboardArray.forEach((player, index) => {
      leaderboardText += `${index + 1}. <b>${player[0]}:</b> ${player[1]}<br>`
    })

    // Mostrar el leaderboard en el elemento finalTextElement
    finalTextElement.innerHTML += leaderboardText

    restartButtonElement.style.display = 'block'
  }

  function handleClick(event) {
    var clickX = event.offsetX
    var clickY = event.offsetY
    var distance = Math.sqrt(
      (clickX - circle.x) ** 2 + (clickY - circle.y) ** 2
    )

    if (distance <= circle.radius) {
      score++

      // Mostrar explosión sobre el alien
      drawExplosion()

      // Limpiar el canvas después de un breve retraso para que se vea la explosión
      setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        generateRandomAlien()
      }, 100)
    }
  }

  ctx.font = '24px Arial'
  ctx.fillStyle = '#000'

  generateRandomAlien()
  var countdownInterval = setInterval(updateCountdown, 1000)
  canvas.addEventListener('click', handleClick)
}
