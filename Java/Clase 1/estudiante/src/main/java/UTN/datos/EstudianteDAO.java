package UTN.datos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import static UTN.conexion.Conexion.getConnection;
import UTN.dominio.Estudiante;

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

    //Método por id -> find by id
    public boolean buscarEstudiantePorId(Estudiante estudiante){
        PreparedStatement ps;
        ResultSet rs;
        Connection con = getConnection();
        String sql = "SELECT * FROM estudiantes2022 WHERE idestudiantes2022=?";
        try{
            ps = con.prepareStatement(sql);
            ps.setInt(1, estudiante.getIdEstudiante2022());
            rs = ps.executeQuery();
            if(rs.next()){
                estudiante.setNombre(rs.getString("nombre"));
                estudiante.setApellido(rs.getString("apellido"));
                estudiante.setTelefono(rs.getString("telefono"));
                estudiante.setEmail(rs.getString("email"));
                return true; //Se encontro un registro
            }//Fin if   
        } catch(Exception e){
            System.out.println("Ocurrió un error al buscar un estudiante: "+e.getMessage());
        }//Fin catch
        finally{
            try {
                con.close();
            } catch (Exception e) {
                System.out.println("Ocurrió un error al cerrar la conexión: "+e.getMessage());
            }//Fin catch
        }//Fin finally
        return false;
    }


    //METODO AGREGAR ESTUDIANTE (INSERT)
    public boolean agregarEstudiante(Estudiante estudiante){
    PreparedStatement ps;
    Connection con = getConnection();
    String sql = "INSERT INTO estudiantes2022 (nombre,apellido,telefono,email) VALUES (?, ?, ?, ?)";
    try {
        ps = con.prepareStatement(sql);
        ps.setString(1,estudiante.getNombre());
        ps.setString(2,estudiante.getApellido());
        ps.setString(3,estudiante.getTelefono());
        ps.setString(4,estudiante.getEmail());
        ps.execute();
        return true;
    } catch (Exception e) {
        System.out.println("Ocurrio un error al agregar estudiante" + e.getMessage());
    }
    finally{
        try {
            con.close();
        } catch (Exception e) {
            System.out.println("Ocurrio un error al cerrar conexion"+ e.getMessage());
        }
    }
    return false;
    }//Fin metodo agregarEstudiante

    //Metodo para modificar estudiante
    public boolean modificarEstudiante(Estudiante estudiante){
        PreparedStatement ps;
        Connection con = getConnection();
        String sql = "UPDATE estudiantes2022 SET nombre=?, apellido=?, telefono=?, email=? WHERE idestudiantes2022=?";
        try{
            ps = con.prepareStatement(sql);
            ps.setString(1, estudiante.getNombre());
            ps.setString(2, estudiante.getApellido());
            ps.setString(3, estudiante.getTelefono());
            ps.setString(4, estudiante.getEmail());
            ps.setInt(5, estudiante.getIdEstudiante2022());
            ps.execute();
            return true;
        } catch (Exception e){
            System.out.println("Error al modificar estudiante: "+ e.getMessage());
        }//Fin cath
        finally {
            try {
                con.close();
            }catch (Exception e){
                System.out.println("Error al cerrar la conexion: "+ e.getMessage());
            }//Fin cath
        }//Fin finally
        return false;
    }//Fin metodo modificarEstudiante

    public static void main(String[] args) {
        //Listar los estudiantes
        var estudianteDao = new EstudianteDAO();
        System.out.println("Listado de estudiantes: ");
        List<Estudiante> estudiantes = estudianteDao.listarEstudiantes();
        estudiantes.forEach(System.out::println);// Función lambda para imprimir

        // Agregar estudiante
        //var nuevoEstudiante = new Estudiante("Carlos","Lara","5495544223","carlosl@mail.com");
        //var agregado = estudianteDao.agregarEstudiante(nuevoEstudiante);
        //if (agregado)
        //    System.out.println("Estudiante agregado: "+nuevoEstudiante);
        //else
        //    System.out.println("No se ha agregado estudiante: "+nuevoEstudiante);

        // Buscar por id
        //var estudiante1 = new Estudiante(1);
        //System.out.println("Estudiantes antes de la busqueda: "+estudiante1);
        //var encontrado = estudianteDao.buscarEstudiantePorId(estudiante1);
        //if (encontrado)
            //System.out.println("Estudiante encontrado: "+estudiante1);
        //else
            //System.out.println("No se encontro el estudiante: "+estudiante1.getIdEstudiante2022());

    }
}
