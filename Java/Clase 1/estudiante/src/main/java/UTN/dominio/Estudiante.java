package UTN.dominio;

public class Estudiante {
    private int idEstudiante2022;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

    public Estudiante(){} //Constructor Vacio

    public Estudiante(int idEstudiante2022){ //Constructor para la llave primaria
        this.idEstudiante2022 = idEstudiante2022;
    }

    //Constructor para Ingresar un nuevo estudiante
    public Estudiante(String nombre, String apellido, String telefono, String email){
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    //Constructor para Modificar un estudiante
    public Estudiante(int idEstudiante2022, String nombre, String apellido, String email, String telefono){
        this.idEstudiante2022 = idEstudiante2022;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    public int getIdEstudiante2022() {
        return idEstudiante2022;
    }

    public void setIdEstudiante2022(int idEstudiante2022) {  // ✅ CORREGIDO
        this.idEstudiante2022 = idEstudiante2022;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    @Override
    public String toString() {
        return "Estudiante{" +
                "idEstudiante2022=" + idEstudiante2022 +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                '}';
    }
}