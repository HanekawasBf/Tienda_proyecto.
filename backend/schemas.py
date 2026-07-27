"""
schemas.py
Versión con Pydantic: las mismas reglas que validamos "a mano" en models.py,
pero declaradas de forma automática usando BaseModel + Field.
Estos son los esquemas que usa FastAPI para validar lo que llega en el Request Body.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ProductoSchema(BaseModel):
    nombre: str = Field(..., min_length=1)
    precio: float = Field(..., ge=0)
    stock: int = Field(..., ge=0)
    categoria: str = Field(..., min_length=1)


class ProductoUpdateSchema(BaseModel):
    # Para actualizar: el id es obligatorio, el resto de campos son opcionales
    id: int
    nombre: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    categoria: Optional[str] = None


class ClienteSchema(BaseModel):
    nombre: str = Field(..., min_length=1)
    edad: int = Field(..., ge=0, le=99)
    correo: str = Field(..., min_length=3)


class ClienteUpdateSchema(BaseModel):
    id: int
    nombre: Optional[str] = None
    edad: Optional[int] = Field(None, ge=0, le=99)
    correo: Optional[str] = None
