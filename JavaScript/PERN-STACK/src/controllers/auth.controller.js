import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import md5 from "md5";
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
};

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
    res.cookie("token", token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    gravatar: result.rows[0].gravatar,
});
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        md5(email);
        const gravatar = "https://www.gravatar.com/avatar/" + md5(email) ;
        const result = await pool.query(
            "INSERT INTO usuarios (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, gravatar]
        );

        const user = result.rows[0];
        const token = await createAccessToken({ id: user.id });

        // 7.4 Guardar el token en una cookie
        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
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

export const signout = (req, res) => {
    res.clearCookie("token", cookieOptions);
    return res.json({ message: "Sesión cerrada correctamente" });
};

    
export const profile = async (req, res) => {
    const result = await pool.query(
    "SELECT id, name, email, gravatar FROM usuarios WHERE id = $1",
    [req.usuarioId]
);
    return res.json(result.rows[0]);
}