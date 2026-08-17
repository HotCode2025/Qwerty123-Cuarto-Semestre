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
    public List<Estudiante> listar() {
        List<Estudiante> estudiantes = new ArrayList<>();
        //Creamos algunos objetos necesarios para comunicarnos con la base de datos
        PreparedStatement ps; //Envia la sentencia a la base de datos
        ResultSet rs;//Obtenemos el resultado de la base de datos
        //Creamos un objeto de tipo conexión
        Connection con = getConnection();
        String sql = "SELECT * FROM estudiante2026 ORDER BY idestudiantes2026";
        try {
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            while(rs.next()) {
               var estudiante = new Estudiante();
               estudiante.setIdestudiante2026(rs.getInt("idestudiantes2026"));
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
}
