--
-- PostgreSQL database dump
--

\restrict lR2con5qUmF7aTDcUulx0mgt7dCUJT7xbvZvbCTc29LRss4IhsThpikMP9vj7ha

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-08-12 20:19:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 65571)
-- Name: estudiantes2022; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estudiantes2022 (
    nombre character varying(45),
    apellido character varying,
    telefono character varying,
    email character varying,
    idestudiantes2022 integer NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 65579)
-- Name: estudiantes2022_idestudiantes2022_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.estudiantes2022 ALTER COLUMN idestudiantes2022 ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estudiantes2022_idestudiantes2022_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5005 (class 0 OID 65571)
-- Dependencies: 219
-- Data for Name: estudiantes2022; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.estudiantes2022 OVERRIDING SYSTEM VALUE VALUES ('Juan', 'Perez', '2614545456', 'juan@mail.com', 1);
INSERT INTO public.estudiantes2022 OVERRIDING SYSTEM VALUE VALUES ('Carla', 'Roldan', '2604141414', 'Roldanc@mail.com', 2);
INSERT INTO public.estudiantes2022 OVERRIDING SYSTEM VALUE VALUES ('Carlos', 'Peralta', '2604131313', 'peraltac@mail.com', 3);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 220
-- Name: estudiantes2022_idestudiantes2022_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estudiantes2022_idestudiantes2022_seq', 3, true);


--
-- TOC entry 4857 (class 2606 OID 65587)
-- Name: estudiantes2022 estudiantes2022_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiantes2022
    ADD CONSTRAINT estudiantes2022_pk PRIMARY KEY (idestudiantes2022);


-- Completed on 2026-08-12 20:19:40

--
-- PostgreSQL database dump complete
--

\unrestrict lR2con5qUmF7aTDcUulx0mgt7dCUJT7xbvZvbCTc29LRss4IhsThpikMP9vj7ha

