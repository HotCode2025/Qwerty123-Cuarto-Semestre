package UTN.dominio;

public class Estudiante {
    private int idestudiante2026;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

    public Estudiante(){} //Constructor Vacio

    public Estudiante(int idestudiante2026){ //Constructor para la llave primaria
        this.idestudiante2026 = idestudiante2026;

    }

    //Constructor para Ingresar un nuevo estudiante
    public Estudiante(String nombre, String apellido, String telefono, String email){
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    //Constructor para Modificar un estudiante
    public Estudiante(int idestudiante2026, String nombre, String apellido, String email, String telefono){
        this.idestudiante2026 = idestudiante2026;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
    }

    public int getIdestudiante2026() {
        return idestudiante2026;
    }

    public void setIdestudiante2026(int idestudiante2026) {
        this.idestudiante2026 = idestudiante2026;
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
                "idestudiante2026=" + idestudiante2026 +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                '}';
    }
}
