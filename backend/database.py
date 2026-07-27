"""
database.py
"Base de datos" en memoria. En lugar de usar diccionarios sueltos para representar
cada producto/cliente, guardamos listas de INSTANCIAS de las clases definidas
en models.py.
"""

from models import Producto, Cliente

productos_db = [
    Producto(1, "Laptop Gamer", 18500.0, 12, "electronica"),
    Producto(2, "Mouse Inalambrico", 350.0, 50, "electronica"),
    Producto(3, "Playera Basica", 199.0, 100, "ropa"),
    Producto(4, "Tenis Deportivos", 999.0, 30, "ropa"),
    Producto(5, "Cafetera", 1200.0, 15, "hogar"),
]

clientes_db = [
    Cliente(1, "Diego Ortega", 21, "diego@example.com"),
    Cliente(2, "Ana Lopez", 28, "ana@example.com"),
]

# Contadores simples para generar nuevos ids
siguiente_id_producto = 6
siguiente_id_cliente = 3
