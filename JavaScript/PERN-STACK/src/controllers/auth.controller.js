import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";

// export const signin = (req, res) => res.send("ingresando");

export const signin = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rowCount === 0) {
        return res.status(400).json({ message: "El correo no está registrado" });
    }

    const validPassword = await bcrypt.compare(password, result.rows[0].password);

    if (!validPassword) {
        return res.status(400).json({ message: "La contraseña es incorrecta" });
    }

    const token = await createAccessToken({ id: result.rows[0].id });
    console.log(result);
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1000, // 1 day
    });
    return res.json(result.rows[0]);
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO usuarios (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = await createAccessToken({ id: user.id });

        // 7.4 Guardar el token en una cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }
        next(error);
    }
};

export const signout = (req, res) => res.send("Cerrando sesion");

export const profile = (req, res) => res.send("Perfil de usuario");