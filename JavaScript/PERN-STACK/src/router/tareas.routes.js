import { Router } from "express";
import { actualizarTarea, crearTarea, eliminarTarea, listarTarea, listarTareas } from "../controllers/tareas.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(`/tareas`, isAuth, listarTareas);

router.get(`/tareas/:id`, isAuth, listarTarea);

router.post(`/tareas`, isAuth, crearTarea);

router.put(`/tareas/:id`, isAuth, actualizarTarea);

router.delete(`/tareas/:id`, isAuth, eliminarTarea);

export default router;