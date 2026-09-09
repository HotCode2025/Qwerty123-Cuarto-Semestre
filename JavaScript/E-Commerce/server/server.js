require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------------------------------------------------
// Cliente de Mercado Pago
// Necesitás tu Access Token de PRUEBA (test) del panel de
// Mercado Pago Developers: https://www.mercadopago.com.ar/developers/panel
// Nunca lo pongas escrito directamente acá: va en el archivo .env
// ---------------------------------------------------------
if (!process.env.MP_ACCESS_TOKEN) {
    console.warn(
        "⚠️  Falta MP_ACCESS_TOKEN en tu archivo .env. Las compras van a fallar hasta que lo configures."
    );
}

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

app.use(cors());
app.use(express.json());

// Sirve todo el frontend (carpeta client) como archivos estáticos
app.use(express.static(path.join(__dirname, "../client")));

// Ruta principal -> muestra el index.html del front
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ---------------------------------------------------------
// Crear preferencia de pago a partir del carrito
// El frontend manda: { items: [{ productName, price, quanty }, ...] }
// ---------------------------------------------------------
app.post("/create_preference", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        const preferenceItems = items.map((item) => ({
            title: item.productName,
            unit_price: Number(item.price),
            quantity: Number(item.quanty),
            currency_id: "ARS",
        }));

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: preferenceItems,
                // Nota: en producción (con dominio propio) acá agregarías
                // back_urls + auto_return: "approved" para redirigir solo
                // automáticamente. En local, Mercado Pago no acepta
                // localhost en back_urls, así que el comprador vuelve
                // manualmente con el botón "Volver al sitio".
                back_urls: {
                    success: `http://localhost:${PORT}`,
                    failure: `http://localhost:${PORT}`,
                    pending: `http://localhost:${PORT}`,
                },
            },
        });

        // init_point: redirección de producción
        // sandbox_init_point: redirección para cuentas de PRUEBA (la que vas a usar ahora)
        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).json({ error: "Error al crear la preferencia de pago" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});