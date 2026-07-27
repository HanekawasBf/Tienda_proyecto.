# Tienda Online

Proyecto de una tienda en línea con backend en **FastAPI** (Python) y frontend en **JavaScript** con **Bootstrap**. Permite gestionar productos y clientes: listarlos con filtros, crearlos, actualizarlos y eliminarlos, además de un carrito de compras básico.

- Ortega Plaza Diego
- Matrícula: 240323000
- Proyecto Integrador - 3er Parcial
- Asignatura: Desarrollo Backend I, Desarrollo Frontend I
- 6to Cuatrimestre - Ingeniería en Desarrollo de Software

## Tecnologías

- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Frontend:** HTML, CSS, JavaScript (ES Modules), Bootstrap 5 (servido localmente)

## Estructura del proyecto

```
tienda-online/
├── backend/
│   ├── main.py           # Endpoints de la API (GET, POST, DELETE)
│   ├── models.py         # Clases nativas Producto y Cliente con validaciones manuales
│   ├── schemas.py        # Esquemas Pydantic (BaseModel) para validar los Request Body
│   ├── database.py       # "Base de datos" en memoria (listas de instancias)
│   └── requirements.txt  # Dependencias del backend
│
├── frontend/
│   ├── index.html        # Vista principal (productos, carrito, clientes)
│   ├── login.html        # Vista de inicio de sesión
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js        # Lógica principal: carga, filtra, crea, edita y elimina
│   │   ├── login.js      # Lógica exclusiva del login
│   │   ├── producto.js   # Clase Producto (template + fábrica crearDesdeObjeto)
│   │   ├── cliente.js    # Clase Cliente (template + fábrica crearDesdeObjeto)
│   │   └── carrito.js    # Clase Carrito (usa find() y filter())
│   └── vendor/
│       └── bootstrap/    # Bootstrap servido desde archivos locales (sin CDN)
│
└── .gitignore
```

## Cómo ejecutar el proyecto

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`, con documentación interactiva en `http://127.0.0.1:8000/docs`.

### Frontend

Abre `frontend/login.html` en el navegador (recomendado usar la extensión **Live Server** de VS Code.
Credenciales de demo: `admin` / `1234`

## Endpoints de la API

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/productos` | Lista productos. Acepta `?nombre=` y `?categoria=` como QueryParams para filtrar |
| POST | `/productos` | Crea un producto (datos en el Request Body como JSON) |
| POST | `/productos/actualizar` | Actualiza un producto existente por `id` |
| DELETE | `/productos/{id}` | Elimina un producto por `id` |

### Clientes

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clientes` | Lista clientes. Acepta `?nombre=` como QueryParam para filtrar |
| POST | `/clientes` | Crea un cliente |
| POST | `/clientes/actualizar` | Actualiza un cliente existente por `id` |
| DELETE | `/clientes/{id}` | Elimina un cliente por `id` |

## Funcionalidades principales

**Backend**
- Datos representados con clases nativas (`Producto`, `Cliente`) en lugar de diccionarios sueltos.
- Validaciones manuales en el constructor de cada clase (tipo de dato y rangos, por ejemplo `edad` como `int` entre 0 y 99).
- Validaciones automáticas equivalentes con `BaseModel` de Pydantic para lo que llega por el Request Body.
- Filtros vía QueryParams en los endpoints GET.
- Creación y actualización de datos vía JSON en el cuerpo de la petición (POST).
- Eliminación de datos vía el método DELETE.

**Frontend**
- Código separado en módulos independientes (`login.js`, `app.js`, `producto.js`, `cliente.js`, `carrito.js`) usando `<script type="module">`, `import` y `export`.
- Cada clase (`Producto`, `Cliente`) arma y retorna su propio template HTML.
- Los datos que llegan del backend se convierten en instancias reales con `crearDesdeObjeto()` (`new Producto(...)`, `new Cliente(...)`) en lugar de usarse como objetos planos.
- Al editar un valor (precio de un producto, edad de un cliente), se muestra un mensaje de confirmación con el valor anterior y el valor nuevo antes de aplicar el cambio.
- Uso de `find()` para localizar elementos y `filter()` para filtrar/eliminar en arreglos (búsqueda de productos, manejo del carrito).
