import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenidos a mi proyecto' });
});

export default app;