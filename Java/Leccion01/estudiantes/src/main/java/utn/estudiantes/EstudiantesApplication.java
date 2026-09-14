package utn.estudiantes;

import java.util.List;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import utn.estudiantes.modelo.Estudiantes2022;
import utn.estudiantes.servicio.EstudianteServicio;

@SpringBootApplication
public class EstudiantesApplication implements CommandLineRunner {

    @Autowired
    private EstudianteServicio estudianteServicio;
    private static final Logger logger = LoggerFactory.getLogger(EstudiantesApplication.class);

    String nl = System.lineSeparator();

    public static void main(String[] args) {
        logger.info("iniciando la aplicación...");
        // levantar la fábrica de Spring
        SpringApplication.run(EstudiantesApplication.class, args);
        logger.info("Aplicación finalizada!");
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info(nl + "Ejecutando el método run de Spring..." + nl);
        var salir = false;
        var consola = new Scanner(System.in);
        while (!salir) {
            mostrarMenu();
            salir = ejecutarOpciones(consola);
            logger.info(nl);
        } // Fin del ciclo while
    }

    private void mostrarMenu() {
        logger.info("""
				******* Sistemas de Estudiantes *******
				1. Listar Estudiante
				2. Buscar Estudiante
				3. Agregar Estudiante
				4. Modificar Estudiante
				5. Eliminar Estudiante
				6. Salir
				Eliga una opción:""");
    }

    private boolean ejecutarOpciones(Scanner consola) {
        var salir = false;
        int opcion;

        // NUEVO: manejamos la excepción si se ingresa algo que no es un número (ej. una letra)
        try {
            opcion = Integer.parseInt(consola.nextLine());
        } catch (NumberFormatException e) {
            logger.info("Opcion invalida. Intente nuevamente." + nl);
            return salir; // corta acá y vuelve a mostrar el menú (salir sigue siendo false)
        }

        switch (opcion) {
            case 1 -> { // Listar estudiantes
                logger.info(nl + "Listado de estudiantes: " + nl);
                List<Estudiantes2022> estudiantes = estudianteServicio.listarEstudiantes();
                estudiantes.forEach((estudiante -> logger.info(estudiante.toString() + nl)));
            }
            case 2 -> { // Buscar estudainte por id
                logger.info("Digite el id estudiante a buscar: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                Estudiantes2022 estudiante = estudianteServicio.buscarEstudiantePorId(idEstudiante);
                if (estudiante != null)
                    logger.info("Estudiante encontrado: " + estudiante + nl);
                else
                    logger.info("Estudiante NO encontrado: " + idEstudiante + nl);
            }

            case 3 -> {// Agregar estudiante
                logger.info("Agregar estudiante: " + nl);
                logger.info("Nombre: ");
                var nombre = consola.nextLine();
                logger.info("Apellido: ");
                var apellido = consola.nextLine();
                logger.info("Teléfono: ");
                var telefono = consola.nextLine();
                logger.info("Email: ");
                var email = consola.nextLine();
                // Crear el objeto estudiante sin el id
                var estudiante = new Estudiantes2022();
                estudiante.setNombre(nombre);
                estudiante.setApellido(apellido);
                estudiante.setTelefono(telefono);
                estudiante.setEmail(email);
                estudianteServicio.guardarEstudiante(estudiante);
                logger.info("Estudiante agregado: " + estudiante + nl);
            }
            case 4 -> { // Modificar estudiante
                logger.info("Modificar estudiante: " + nl);
                logger.info("Ingrese el id estudiante: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                // buscamos el estudiante a modificar
                Estudiantes2022 estudiante = estudianteServicio.buscarEstudiantePorId(idEstudiante);
                if (estudiante != null) {
                    logger.info("Nombre: ");
                    var nombre = consola.nextLine();
                    logger.info("Apellido: ");
                    var apellido = consola.nextLine();
                    logger.info("Telefono: ");
                    var telefono = consola.nextLine();
                    logger.info("Email: ");
                    var email = consola.nextLine();
                    estudiante.setNombre(nombre);
                    estudiante.setApellido(apellido);
                    estudiante.setTelefono(telefono);
                    estudiante.setEmail(email);
                    estudianteServicio.guardarEstudiante(estudiante);
                    logger.info("Estudiante modificado: " + estudiante + nl);
                } else
                    logger.info("Estudiante NO encontrado con el id: " + idEstudiante + nl);
            }
            //ELIMINAR ESTUDIANTE
            case 5 -> {
                logger.info("Digite el id del estudiante que quiere eliminar: "+nl);
                var idEstudiante = Integer.parseInt(consola.nextLine());

                var estudiante = estudianteServicio.buscarEstudiantePorId(idEstudiante);

                if(estudiante != null){
                    estudianteServicio.eliminarEstudiante(estudiante);
                    logger.info("Estudiante eliminado: "+estudiante+nl);
                }
                else
                    logger.info("Estudiante NO encontrado con id: "+idEstudiante+nl);
            }

            case 6 -> {
                logger.info("Saliendo de la aplicacion...");
                salir = true;
            }
            default -> {
                logger.info("Opcion invalida. Intente nuevamente.");
            }
        }
        return salir;
    }

}