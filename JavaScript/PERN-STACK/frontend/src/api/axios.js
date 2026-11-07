import axios from "axios";

const clientes =  axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export default clientes;
