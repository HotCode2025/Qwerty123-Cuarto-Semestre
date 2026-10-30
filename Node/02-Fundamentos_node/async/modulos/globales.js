// Mostrar algo en consola
// console.log();

// Mostrar un mensaje de error
// console.error();

// Ejecutar un código después de un intervalo de tiempo
// setTimeout(() => {});

// Ejecutar un código de manera repetida
// setInterval(() => {});

// Programar una función para la fase check del bucle de eventos
// setImmediate(() => {});

// Prueba del objeto global realizada durante la clase
// console.log(global);

// Mostrar la función setInterval
// console.log(setInterval);

/*
let i = 0
let intervalo = setInterval(() => {
    console.log("Hola")
    if(i === 3){
        clearInterval(intervalo) //detenemos la funcion
    }
    i++
}, 1000)
*/

setImmediate(() => {
  console.log("Saludo inmediato");
});

// require();

//console.log(process)
/*
se imprime en la terminal la información completa del objeto global process, 
el cual representa el proceso de Node.js que se está ejecutando en ese preciso instante
*/

//console.log(__dirname)
console.log(__filename)