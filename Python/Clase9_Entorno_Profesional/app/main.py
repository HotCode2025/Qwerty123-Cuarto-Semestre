from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

import charts
import utils

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data.csv"

app = FastAPI(
    title="Qwerty123 - Population API",
    description=(
        "Mini API de poblacion mundial usada para practicar el entorno "
        "profesional con Docker. Expone datos del CSV y genera graficos."
    ),
    version="1.0.0",
)


def load_dataframe() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="No se encontro data.csv")
    return pd.read_csv(DATA_PATH)


def find_country(country: str) -> dict:
    df = load_dataframe()
    matches = df[df["Country"].str.casefold() == country.strip().casefold()]

    if matches.empty:
        raise HTTPException(
            status_code=404,
            detail=f"Pais no encontrado: {country}",
        )

    return matches.iloc[0].to_dict()


@app.get("/", tags=["info"])
def root():
    return {
        "app": "Qwerty123 Population API",
        "docs": "/docs",
        "endpoints": [
            "GET /health",
            "GET /countries",
            "GET /population/{country}",
            "GET /charts/pie",
            "GET /charts/bar/{country}",
        ],
    }


@app.get("/health", tags=["info"])
def health():
    return {"status": "ok"}


@app.get("/countries", tags=["data"])
def list_countries(continent: str | None = None):
    df = load_dataframe()

    if continent:
        df = df[df["Continent"].str.casefold() == continent.strip().casefold()]

    if df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No hay paises para el continente: {continent}",
        )

    return sorted(df["Country"].tolist())


@app.get("/population/{country}", tags=["data"])
def population(country: str):
    row = find_country(country)
    labels, values = utils.get_population(row)

    return {
        "country": row["Country"],
        "continent": row["Continent"],
        "population": {year: int(value) for year, value in zip(labels, values)},
    }


@app.get(
    "/charts/pie",
    tags=["charts"],
    responses={200: {"content": {"image/png": {}}}},
)
def pie_chart(continent: str = "Africa"):
    df = load_dataframe()
    df = df[df["Continent"].str.casefold() == continent.strip().casefold()]

    if df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No hay paises para el continente: {continent}",
        )

    path = charts.generate_pie_chart(
        df["Country"].tolist(),
        df["World Population Percentage"].tolist(),
        name=f"pie-{continent}",
    )
    return FileResponse(path, media_type="image/png", filename=path.name)


@app.get(
    "/charts/bar/{country}",
    tags=["charts"],
    responses={200: {"content": {"image/png": {}}}},
)
def bar_chart(country: str):
    row = find_country(country)
    labels, values = utils.get_population(row)

    path = charts.generate_bar_chart(
        row["Country"],
        list(labels),
        list(values),
    )
    return FileResponse(path, media_type="image/png", filename=path.name)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
