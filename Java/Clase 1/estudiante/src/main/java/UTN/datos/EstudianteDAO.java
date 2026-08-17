package UTN.datos;

import UTN.dominio.Estudiante;

import static  UTN.conexion.Conexion.getConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class EstudianteDAO {
    //Métod listar
    public List<Estudiante> listarEstudiantes() {
        List<Estudiante> estudiantes = new ArrayList<>();
        //Creamos algunos objetos necesarios para comunicarnos con la base de datos
        PreparedStatement ps; //Envia la sentencia a la base de datos
        ResultSet rs;//Obtenemos el resultado de la base de datos
        //Creamos un objeto de tipo conexión
        Connection con = getConnection();
        String sql = "SELECT * FROM estudiantes2022 ORDER BY idestudiantes2022";
        try {
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            while(rs.next()) {
               var estudiante = new Estudiante();
               estudiante.setIdEstudiante2022(rs.getInt("idestudiantes2022"));
               estudiante.setNombre(rs.getString("nombre"));
               estudiante.setApellido(rs.getString("apellido"));
               estudiante.setTelefono(rs.getString("telefono"));
               estudiante.setEmail(rs.getString("email"));
               estudiantes.add(estudiante);

            }
        }catch (Exception e) {
           System.out.println("Ocurrio un error al seleccionar datos"+e.getMessage());

        }
        finally {
            try {
                con.close();
            }catch (Exception e) {
                System.out.println("Ocurrió un error al cerrar la conexión");

            }
        }//Fin finally
        return estudiantes;
    }//Fin del Metodo Listar

    public static void main(String[] args) {
        //Listar los estudiantes
        var estudianteDao = new EstudianteDAO();
        System.out.println("Listado de estudiantes: ");
        List<Estudiante> estudiantes = estudianteDao.listarEstudiantes();
        estudiantes.forEach(System.out::println);// Función lambda para imprimir
    }
}
