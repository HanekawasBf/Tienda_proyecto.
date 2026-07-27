"""
Clases nativas de dominio (en lugar de usar diccionarios sueltos para representar
cada producto o cliente). Incluyen validacion manual en el constructor.
"""


class Producto:
    def __init__(self, id, nombre, precio, stock, categoria):
        # --- Validaciones manuales ---
        if type(nombre) != str or nombre.strip() == "":
            raise ValueError("El nombre debe ser un texto no vacío.")

        if type(precio) != int and type(precio) != float:
            raise ValueError("El precio debe ser numérico.")
        if precio < 0:
            raise ValueError("El precio no puede ser negativo.")

        if type(stock) != int:
            raise ValueError("El stock debe ser un número entero.")
        if stock < 0:
            raise ValueError("El stock no puede ser negativo.")

        if type(categoria) != str or categoria.strip() == "":
            raise ValueError("La categoría debe ser un texto no vacío.")

        # Asignacion 
        self.id = id
        self.nombre = nombre
        self.precio = precio
        self.stock = stock
        self.categoria = categoria.lower()

    def to_dict(self):
        """Convierte la instancia a dict solo para poder devolverla como JSON."""
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "stock": self.stock,
            "categoria": self.categoria,
        }


class Cliente:
    def __init__(self, id, nombre, edad, correo):
        # Validaciones manuales 
        if type(nombre) != str or nombre.strip() == "":
            raise ValueError("El nombre debe ser un texto no vacío.")

        # Validación estricta: la edad debe ser int puro, entre 0 y 99
        if type(edad) != int:
            raise ValueError("La edad debe ser un número entero (int).")
        if edad < 0 or edad > 99:
            raise ValueError("La edad debe estar en el rango de 0 a 99.")

        if type(correo) != str or "@" not in correo:
            raise ValueError("El correo no tiene un formato válido.")

        # Asignacion 
        self.id = id
        self.nombre = nombre
        self.edad = edad
        self.correo = correo

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "edad": self.edad,
            "correo": self.correo,
        }
