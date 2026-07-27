"""
API principal de la Tienda Online.

Endpoints:
  GET    /productos            -> lista + filtros por QueryParams (nombre, categoria)
  POST   /productos            -> crear un producto (Request Body JSON)
  POST   /productos/actualizar -> actualizar un producto existente (Request Body JSON)
  DELETE /productos/{id}       -> eliminar un producto

  GET    /clientes             -> lista + filtro por QueryParams (nombre)
  POST   /clientes             -> crear un cliente
  POST   /clientes/actualizar  -> actualizar un cliente existente
  DELETE /clientes/{id}        -> eliminar un cliente
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import database

app = FastAPI(title="Tienda Online API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# PRODUCTOS 

@app.get("/productos")
def obtener_productos(nombre: Optional[str] = Query(None), categoria: Optional[str] = Query(None)):
    resultado = []

    for producto in database.productos_db:
        coincide_nombre = True
        coincide_categoria = True

        if nombre:
            coincide_nombre = nombre.lower() in producto.nombre.lower()
        if categoria:
            coincide_categoria = producto.categoria == categoria.lower()

        if coincide_nombre and coincide_categoria:
            resultado.append(producto.to_dict())

    return resultado


# CLIENTES 

@app.get("/clientes")
def obtener_clientes(nombre: Optional[str] = Query(None)):
    resultado = []

    for cliente in database.clientes_db:
        if nombre is None or nombre.lower() in cliente.nombre.lower():
            resultado.append(cliente.to_dict())

    return resultado


@app.get("/")
def raiz():
    return {"mensaje": "API de Tienda Online activa. Visita /docs para probar los endpoints."}
