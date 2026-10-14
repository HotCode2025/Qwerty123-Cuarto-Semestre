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
        }
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

    /**
     * Lee una línea de la consola y la convierte a número entero de forma segura.
     * Si el texto no es un número válido, devuelve null en vez de lanzar excepción.
     */
    private Integer leerEntero(Scanner consola, String mensaje) {
        if (!mensaje.isEmpty())
            logger.info(mensaje);
        try {
            return Integer.parseInt(consola.nextLine().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean ejecutarOpciones(Scanner consola) {
        var salir = false;

        Integer opcion = leerEntero(consola, "");
        if (opcion == null) {
            logger.info("Opcion invalida. Intente nuevamente." + nl);
            return salir;
        }

        switch (opcion) {
            case 1 -> { // Listar estudiantes
                logger.info(nl + "Listado de estudiantes: " + nl);
                List<Estudiantes2022> estudiantes = estudianteServicio.listarEstudiantes();
                estudiantes.forEach((estudiante -> logger.info(estudiante.toString() + nl)));
            }
            case 2 -> { // Buscar estudiante por id
                Integer idEstudiante = leerEntero(consola, "Digite el id estudiante a buscar: ");
                if (idEstudiante == null) {
                    logger.info("Id invalido, debe ser un número." + nl);
                    break;
                }
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
                Integer idEstudiante = leerEntero(consola, "Ingrese el id estudiante: ");
                if (idEstudiante == null) {
                    logger.info("Id invalido, debe ser un número." + nl);
                    break;
                }
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
            case 5 -> { // Eliminar estudiante
                Integer idEstudiante = leerEntero(consola, "Digite el id del estudiante que quiere eliminar: " + nl);
                if (idEstudiante == null) {
                    logger.info("Id invalido, debe ser un número." + nl);
                    break;
                }
                var estudiante = estudianteServicio.buscarEstudiantePorId(idEstudiante);
                if (estudiante != null) {
                    estudianteServicio.eliminarEstudiante(estudiante);
                    logger.info("Estudiante eliminado: " + estudiante + nl);
                } else
                    logger.info("Estudiante NO encontrado con id: " + idEstudiante + nl);
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