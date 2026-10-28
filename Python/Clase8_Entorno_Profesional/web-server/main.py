import store
from fastapi import FastAPI
from fastapi.responses import HTMLResponse


# Creamos la aplicación
app = FastAPI()


# Primera ruta: devuelve una lista
@app.get('/')
def get_list():
    return [1, 2, 3]


# Segunda ruta: devuelve una página HTML
@app.get('/contact', response_class=HTMLResponse)
def get_contact():
    return """
    <h1>Soy un sitio web</h1>
    <p>Soy un párrafo para que leas</p>
    """


def run():
    store.get_razas()


if __name__ == '__main__':
    run()