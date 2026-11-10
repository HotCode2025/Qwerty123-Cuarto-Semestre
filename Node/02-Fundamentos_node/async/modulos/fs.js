const fs = require('fs');

// Primero leemos el archivo.txt
function leer(ruta, cb) {
    fs.readFile(ruta, (err, data) => {
        cb(data.toString());
    });
}

leer(`${__dirname}/archivo.txt`, console.log); //sintaxis ES6

// Segundo escribimos el archivo1.txt creandolo

function escribir(ruta, contenido) {
    fs.writeFile(ruta, contenido, (err) => {
        if (err) {
            console.error('No se ha podido escribir', err);
        } else {
            console.log('Se ha escrito correctamente');
        }
    });}


// Tercero Eliminamos el archivo1.txt
function borrar(ruta, cb) {
    fs.unlink(ruta, cb);  //elimina de manera asincrona el archivo
} 

borrar(`${__dirname}/archivo1.txt`, console.log); //sintaxis ES6


//escribir(`${__dirname}/archivo1.txt`, 'Soy un archivo nuevo', console.log); 
//leer(`${__dirname}/archivo.txt`, console.log); //sintaxis ES6
