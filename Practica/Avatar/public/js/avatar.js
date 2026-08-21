function iniciarJuego(){
  let botonPersonajeJugador = document.getElementById('btn-personaje'); 
  botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador); // Escucha el click del botón y llama a la función
}

function seleccionarPersonajeJugador() {
  let inputZuko = document.getElementById('zuko')
  let inputKatara = document.getElementById('katara')
  let inputAang = document.getElementById('aang')
  let inputToph = document.getElementById('toph')
  let spanPersonajeJugador = document.getElementById('personaje-jugador')

  if(inputZuko.checked){
    spanPersonajeJugador.innerHTML = 'Zuko'
  }else if(inputKatara.checked){
    spanPersonajeJugador.innerHTML = 'Katara'
  }else if(inputAang.checked){
    spanPersonajeJugador.innerHTML = 'Aang'
  }else if(inputToph.checked){
    spanPersonajeJugador.innerHTML = 'Toph'
  }else{
    alert('Selecciona un personaje')
  }

  aleatoria() //Llamamos a la función que elije el personaje enemigo
}

function aleatoria() { //Función que elije aleatoriamente un personaje para el enemigo
  let personajes = ['Zuko', 'Katara', 'Aang', 'Toph']
  let numeroAleatorio = Math.floor(Math.random() * personajes.length)

  let spanPersonajeEnemigo = document.getElementById('personaje-enemigo')
  spanPersonajeEnemigo.innerHTML = personajes[numeroAleatorio]
}

window.addEventListener('load', iniciarJuego)