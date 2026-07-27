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

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import database
from models import Producto, Cliente
from schemas import ProductoSchema, ClienteSchema

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


@app.post("/productos")
def crear_producto(datos: ProductoSchema):
    try:
        nuevo = Producto(
            id=database.siguiente_id_producto,
            nombre=datos.nombre,
            precio=datos.precio,
            stock=datos.stock,
            categoria=datos.categoria,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    database.productos_db.append(nuevo)
    database.siguiente_id_producto += 1
    return {"mensaje": "Producto creado correctamente.", "producto": nuevo.to_dict()}


# CLIENTES 

@app.get("/clientes")
def obtener_clientes(nombre: Optional[str] = Query(None)):
    resultado = []

    for cliente in database.clientes_db:
        if nombre is None or nombre.lower() in cliente.nombre.lower():
            resultado.append(cliente.to_dict())

    return resultado


@app.post("/clientes")
def crear_cliente(datos: ClienteSchema):
    try:
        nuevo = Cliente(
            id=database.siguiente_id_cliente,
            nombre=datos.nombre,
            edad=datos.edad,
            correo=datos.correo,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    database.clientes_db.append(nuevo)
    database.siguiente_id_cliente += 1
    return {"mensaje": "Cliente creado correctamente.", "cliente": nuevo.to_dict()}


@app.get("/")
def raiz():
    return {"mensaje": "API de Tienda Online activa. Visita /docs para probar los endpoints."}
