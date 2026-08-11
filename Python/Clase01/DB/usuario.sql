CREATE TABLE IF NOT EXISTS public.usuario (
    id_usuario SERIAL PRIMARY KEY,
    username   VARCHAR NOT NULL,
    password   VARCHAR NOT NULL
);

INSERT INTO public.usuario (username, password) VALUES
('jperez', '123'),
('kgomez', '456');