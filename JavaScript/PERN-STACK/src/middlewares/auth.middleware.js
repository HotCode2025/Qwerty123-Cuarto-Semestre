import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const isAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "No estas autorizado"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "No estas autorizado"
            });
        }

        req.usuarioId = decoded.id;
        next();
    });
};