import re
from pathlib import Path

import matplotlib

# Backend sin interfaz grafica: necesario para generar imagenes dentro de Docker.
matplotlib.use("Agg")

import matplotlib.pyplot as plt

BASE_DIR = Path(__file__).resolve().parent
IMGS_DIR = BASE_DIR / "imgs"


def _safe_name(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9_-]+", "_", value.strip()).strip("_")
    return slug or "chart"


def _save(fig, filename: str) -> Path:
    IMGS_DIR.mkdir(parents=True, exist_ok=True)
    path = IMGS_DIR / filename
    fig.savefig(path)
    plt.close(fig)
    return path


def generate_bar_chart(name, labels, values) -> Path:
    fig, ax = plt.subplots()
    ax.bar(labels, values)
    ax.set_title(f"Poblacion historica de {name}")
    ax.set_ylabel("Habitantes")
    ax.tick_params(axis="x", rotation=45)
    fig.tight_layout()
    return _save(fig, f"{_safe_name(name)}.png")


def generate_pie_chart(labels, values, name="pie") -> Path:
    fig, ax = plt.subplots()
    ax.pie(values, labels=labels)
    ax.axis("equal")
    ax.set_title("Porcentaje de poblacion mundial")
    fig.tight_layout()
    return _save(fig, f"{_safe_name(name)}.png")
