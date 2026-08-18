package UTN.presentacion;

import UTN.conexion.Conexion;
import UTN.datos.EstudianteDAO;
import UTN.dominio.Estudiante;

import java.util.Scanner;

public class SistemaEstudianteApp {
    public static void main(String[] args) {
        var salir = false; //recuerden esto ya lo hicimos antes
        var consola = new Scanner(System.in); // Para leer informacioón de la consola
        //Se crea una instacia de la clase servicio, esto lo hacemos fuera del ciclo
        var estudianteDao = new EstudianteDAO(); //Esta instancia debe hacerse una vez
        while(!salir){
            try{
                mostrarMenu();//Mostramos el menu
                // Este será el método ejecutarOpciones que devolverá un booleano
                salir = ejecutarOpciones(consola, estudianteDao); // Este arrooja una exception
            } catch (Exception e){
                System.out.println("Ocurrió un error al ejecutar la operación: "e.getMessage());
            }
        }// Fin While
    } //Fin main


} //Fin de clase