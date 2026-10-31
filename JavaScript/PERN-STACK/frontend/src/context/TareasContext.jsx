import { createContext, useContext, useState } from "react";
import {
  eliminarTareaRequest,
  listarTareasRequest,
  crearTareaRequest,
  listarTareaRequest,
  actualizarTareaRequest,
} from "../api/tareas.api";
import { response } from "express";
import { id } from "zod/v4/locales";

const TareasContext = createContext();

export const useTareas = () => {
  const context = useContext(TareasContext);

  if (!context) {
    throw new Error("useTareas debe estar dentro del Provider");
  }
  return context;
};

export const TareasProvider = ({ children }) => {
  const [tareas, setTareas] = useState([]);
  const [errors, setError] = useState([]);

  //CARGAR TAREAS
  const cargarTareas = async () => {
    const res = await listarTareasRequest();
    setTareas(res.data)
  };

  //CARGAR UNA TAREA
  const cargarTarea = async (id,tarea)=>{
    const res = await listarTareaRequest(id,tarea);
    return res.data
  }

  
  //EDITAR TAREA
  const editarTarea = async (id,tarea) =>{
    try {
      const res = actualizarTareaRequest(id,tarea)
      return res.data
    } catch (error) {
      if (error.response){
        setError([error.response.data.message])
      }
    }
  }

    //CREAR TAREA
  const crearTarea = async (tarea) => {
    try {
      const res = await crearTareaRequest(tarea);
      setTareas([...tareas, res.data]);
      return res.data;
    } catch (error) {
      if (error.response) {
        setError([error.response.data.message]);
      }
    }
  };

    //ELIMINAR TAREA
  const eliminarTarea = async (id) => {
    const res = await eliminarTareaRequest(id);
    if (res.status === 204) {
      setTareas(tareas.filter((tarea) => tarea.id !== id));
    }
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        cargarTareas,
        eliminarTarea,
        crearTarea,
        cargarTarea,
        errors,
        editarTarea,
      }}
    >
      {children}{" "}
    </TareasContext.Provider>
  );
};
