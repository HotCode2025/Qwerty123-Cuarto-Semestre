
let nombre = process.env.NOMBRE || 'Sin nomrbe';
let web = process.env.MI_WEB || 'No tengo web';

console.log('Hola '+nombre);
console.log('Mi web es: '+web);