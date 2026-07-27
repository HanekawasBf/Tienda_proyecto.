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
from schemas import ProductoSchema, ProductoUpdateSchema, ClienteSchema, ClienteUpdateSchema

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


@app.post("/productos/actualizar")
def actualizar_producto(datos: ProductoUpdateSchema):
    producto_encontrado = None
    for producto in database.productos_db:
        if producto.id == datos.id:
            producto_encontrado = producto
            break

    if producto_encontrado is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")

    if datos.nombre is not None:
        producto_encontrado.nombre = datos.nombre
    if datos.precio is not None:
        producto_encontrado.precio = datos.precio
    if datos.stock is not None:
        producto_encontrado.stock = datos.stock
    if datos.categoria is not None:
        producto_encontrado.categoria = datos.categoria.lower()

    return {"mensaje": "Producto actualizado correctamente.", "producto": producto_encontrado.to_dict()}


@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int):
    for producto in database.productos_db:
        if producto.id == producto_id:
            database.productos_db.remove(producto)
            return {"mensaje": f"Producto {producto_id} eliminado correctamente."}

    raise HTTPException(status_code=404, detail="Producto no encontrado.")


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


@app.post("/clientes/actualizar")
def actualizar_cliente(datos: ClienteUpdateSchema):
    cliente_encontrado = None
    for cliente in database.clientes_db:
        if cliente.id == datos.id:
            cliente_encontrado = cliente
            break

    if cliente_encontrado is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    if datos.nombre is not None:
        cliente_encontrado.nombre = datos.nombre
    if datos.edad is not None:
        cliente_encontrado.edad = datos.edad
    if datos.correo is not None:
        cliente_encontrado.correo = datos.correo

    return {"mensaje": "Cliente actualizado correctamente.", "cliente": cliente_encontrado.to_dict()}


@app.delete("/clientes/{cliente_id}")
def eliminar_cliente(cliente_id: int):
    for cliente in database.clientes_db:
        if cliente.id == cliente_id:
            database.clientes_db.remove(cliente)
            return {"mensaje": f"Cliente {cliente_id} eliminado correctamente."}

    raise HTTPException(status_code=404, detail="Cliente no encontrado.")


@app.get("/")
def raiz():
    return {"mensaje": "API de Tienda Online activa. Visita /docs para probar los endpoints."}
