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


function hola(nombre,miCallback){
    setTimeout(function(){
        console.log("Hola "+nombre)
        miCallback(nombre)
    }, 1000)//AGREGAMOS 1 seg 
}

function hablar(callBackHablar){
    setTimeout(function(){
        console.log("bla bla bla bla")
        callBackHablar();
    }, 1000)
}

function adios(nombre,otroCallback){
    setTimeout(function(){
        console.log("Adios "+nombre);
        otroCallback();
    },1500)//AGREGAMOS 1,5 seg
}