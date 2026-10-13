function hola(nombre,miCallback){
    setTimeout(function(){
        console.log("Hola"+nombre)
        miCallback()
    },1000)//AGREGAMOS 1 seg 
}

function hablar(callBackHablar){
    setTimeout(function(){
        console.log("bla bla bla bla")
        callBackHablar
    },1000)
}

function adios(nombre,otroCallback){
    setTimeout(function(){
        console.log("Adios"+nombre)
        otroCallback()
    },1500)//AGREGAMOS 1,5 seg
}

//FUNCION RECURSIVA
function conversacion(nombre,veces,callback){
    if (veces > 0){
        hablar(function(){
            conversacion(nombre, --veces,callback)
        })
    }else
        callBack(nombre,callback)
}

//PROCESO PRINCIPAL
console.log("Iniciando el proceso...")  // PRIMERA EJECUCIÓN

hola("Ariel", function(nombre) {        // Callback 1: recibe el nombre procesado
    conversacion(nombre, 4, function() {// Callback 2: repite 4 veces (recursivo)
        console.log("Terminando el proceso...") // Se ejecuta al finalizar
    })
})

/*
ESTO ES UN CALLBACK HELL, muchas funciones anidadas,un embole
Se llama “hell” porque cuanto más lógica agregás,
 más difícil es leer, depurar y mantener el código.

hola("Carlos",function(){
    hablar(function(){
        hablar(function(){
            hablar(function(){
                adios("Carlos",function(){
                    console.log("Terminando el proceso...")
                })
            })
        })
    })
    
})
*/
