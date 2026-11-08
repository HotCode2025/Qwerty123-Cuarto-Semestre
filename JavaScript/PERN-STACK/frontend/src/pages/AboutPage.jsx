import React from 'react'

function AboutPage() {
  return (
    <div>
      <h1 className="text-center font-bold py-4 px-3 text-4xl">Tecnologías Utilizadas </h1>
      <h2 className='text-2xl py-4 px-2'>Antes de profundizar en el desarrollo, echemos un vistazo a las tecnologías clave que usaremos en este proyecto</h2>
      <h3 className='py-4 px-2'>
        {" "}
        PostgreSQL: Una potente base de datos relacional que nos permitirá almacenar y gestionar nuestros datos de manera eficiente.
        Express: Un marco de desarrollo de Node.js que proporcionará un servidor para la aplicación y gestionará las sollicitudes de API
        React: La biblioteca de JavaScript que utilizaremos para construir la interfaz de usuario de nuestra aplicación.
        Node.js: El entorno de ejecución de JavaScript que ejecutará nuestro servidor y la lógica del lado del servidor.
        JSON web Tokens (JWT): Utilizaremos JWT para la autenticación de usuarios, permitiendo que los usuarios se autentiquen y accedan a sus tareas de manera segura.
      </h3>

      <h2 className='text-2xl py-4 px-2'> Configuración del Proyecto</h2>
      <h3>
        {" "}
        Antes de comenzar a escribir código, debemos configurar nuestro proyecto. Crearemos un nuevo proyecto de Node.js y configuraremos las dependencias necesarias, incluyendo Express, React y PostgreSQL. También configuraremos la estructura de carpetas para mantener nuestro código organizado.
      </h3>
      <h2 className='text-2xl py-4 px-2'> Ventajas de la Autentización de Usuarios y CRUD de Tareas</h2>
      <h3 className='py-4 px-2'>
        {" "}
        Este proyecto ofrece varias ventajas: Seguridad: La autentificación de usuarios garantiza que solo los usuarios autorizados puedan acceder a sus tareas. Gestión de Tareas: Los usuarios pueden crear, leer, actualizar y eliminar tareas según sus necesidades. Experiencia del Usuario: Una interfaz de usuario intuitiva y receptiva mejora la experiencia del usuario al interactuar con la aplicación.
      </h3>
    </div>
  )
}

export default AboutPage