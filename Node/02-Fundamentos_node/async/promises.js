/* 
Una promesa en JavaScript es un objeto que representa el resultado (éxito o fallo) de una operación asíncrona.
 Permite manejar tareas que tardan un tiempo en completarse 
—como consultar una API o leer un archivo— sin bloquear el hilo principal del programa.

Una promesa se encuentra siempre en uno de estos tres estados:
• Pendiente (pending): El estado inicial; la operación aún no termina.
• Cumplida (fulfilled): La operación terminó con éxito y la promesa devuelve un valor.
• Rechazada (rejected): Ocurrió un error y la operación falló.
Una vez que pasa a cumplida o rechazada, su estado ya no puede cambiar

Para consumir o trabajar con el resultado de una promesa se utilizan varios métodos:

• .then(): Se ejecuta cuando la promesa se cumple con éxito.
• .catch(): Se ejecuta si la promesa es rechazada o si ocurre un error.
• .finally(): Se ejecuta siempre al terminar,
 sin importar si fue cumplida o rechazada (útil para limpieza de datos o cerrar indicadores de carga)
*/ 


function hola(nombre){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
        console.log("Hola "+nombre)
        resolve(nombre)
    }, 1000);//AGREGAMOS 1 seg 
});
}

function hablar(nombre) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("bla bla bla bla");
            resolve(nombre);
        }, 1000);
    });
}

function adios(nombre){
    return new Promise((resolve, reject)=>{
        setTimeout(function(){
            console.log("Adios "+ nombre);
            //resolve();
            reject('Hay un error');
    },1000) ;//AGREGAMOS 1 seg
 }) 

}
// Llamamos a la funcion
console.log("Iniciando proceso...");

hola("Javier")
    .then(hablar)
    .then(hablar)
    .then(hablar)
    .then(adios)
    .then((nombre) => {
        console.log("Terminando proceso");
    })
    .catch(error => {
        console.log('Ha habido un error: ');
        console.log(error);
    }); 
    