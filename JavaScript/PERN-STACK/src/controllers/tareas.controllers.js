import {pool} from '../db.js';

export const listarTareas = (req,res)=> res.send(`obteniendo tareas`);

export const listarTarea = (req,res)=> res.send(`obteniendo tarea unica`)

export const crearTarea = async(req,res, next)=> {
    const { titulo, descripcion } = req.body;
    

    
    try {   
        throw new Error('Algo salió mal');
        const {rows} = await pool.query('INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2)', [titulo,descripcion]);
        console.log(rows);
        res.send(`creando tarea`);    
    } catch (error) {
        if (error.code === '23505') {
            return res.send({ error: 'La tarea ya existe' });
        }
        console.log(error);
        next(error)
        
    } 
    
}

export const actualizarTarea = (req,res)=> res.send(`actualizando tarea unica`)

export const eliminarTarea = (req,res)=> res.send(`eliminando tarea unica`)