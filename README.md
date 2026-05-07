# Client Gateway

API Gateway del sistema de microservicios `products-app`. Es el único punto de entrada HTTP para los clientes externos. Recibe las peticiones REST, las valida y las reenvía al microservicio correspondiente mediante comunicación TCP (RPC).

---

## Rol en la arquitectura

```
Cliente HTTP
     │
     ▼
┌─────────────────┐   TCP / RPC   ┌──────────────────────┐
│  Client Gateway │ ────────────► │  Products Microservice│
│  (este servicio)│               │  (host:port via TCP)  │
└─────────────────┘               └──────────────────────┘
```

- **No** contiene lógica de negocio ni acceso a base de datos.
- Traduce errores RPC en respuestas HTTP con el código de estado correcto.
- Todas las rutas están prefijadas con `/api`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables. La validación se realiza al arrancar con **Joi** y el proceso aborta si alguna falta.

```env
PORT=3000

# Host y puerto donde escucha el microservicio de productos
PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001
```

---

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo (watch)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

---

## Endpoints disponibles

Base URL: `http://localhost:{PORT}/api`

| Método | Ruta | Descripción | Body / Query |
|--------|------|-------------|--------------|
| `GET` | `/api/products` | Listar productos paginados | `?page=1&limit=10` |
| `GET` | `/api/products/:id` | Obtener un producto por ID | — |
| `POST` | `/api/products` | Crear un producto | `{ name, price }` |
| `PATCH` | `/api/products/:id` | Actualizar un producto | `{ name?, price? }` |
| `DELETE` | `/api/products/:id` | Eliminar un producto | — |

### Ejemplo — Crear producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{ "name": "Teclado mecánico", "price": 89.99 }'
```

---

## Estructura del proyecto

```
src/
├── main.ts                          # Bootstrap: puerto, pipes globales, filtros
├── app.module.ts                    # Módulo raíz
├── config/
│   ├── envs.ts                      # Carga y validación de variables de entorno (Joi)
│   └── services.ts                  # Token de inyección: PRODUCT_SERVICE
├── common/
│   ├── dto/
│   │   └── pagination.dto.ts        # DTO reutilizable para paginación
│   └── exceptions/
│       └── rpc-exception.filter.ts  # Convierte RpcException → HTTP response
└── products/
    ├── products.module.ts           # Registra el cliente TCP hacia el microservicio
    ├── products.controller.ts       # Rutas REST → mensajes RPC
    └── dto/
        ├── create-product.dto.ts    # Validación de creación
        └── update-product.dto.ts    # Validación de actualización (PartialType)
```

---

## Decisiones de diseño relevantes

### Comunicación TCP con el microservicio
`ProductsModule` registra un `ClientProxy` de NestJS usando `Transport.TCP`. Al inyectarlo en el controlador con el token `PRODUCT_SERVICE`, se pueden enviar mensajes con `client.send({ cmd: '...' }, payload)`.

### Manejo de errores RPC → HTTP
El filtro `RpcCustomExceptionFilter` intercepta cualquier `RpcException`. Si el error contiene `{ status, message }`, lo reenvía al cliente HTTP con ese código de estado. En caso contrario responde con `400`.

### Validación de entradas
Se usa `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`, lo que significa que cualquier campo no declarado en los DTOs es rechazado automáticamente.

---

## Scripts disponibles

```bash
npm run start:dev    # Desarrollo con hot-reload
npm run build        # Compila a /dist
npm run start:prod   # Ejecuta el build compilado
npm run lint         # ESLint con auto-fix
npm run test         # Jest (unit tests)
npm run test:e2e     # Tests end-to-end
npm run test:cov     # Cobertura de tests
```
<div align="center">

Desarrollado con ❤️ por [Errold Núñez](https://www.linkedin.com/in/errold-n%C3%BA%C3%B1ez-s%C3%A1nchez) · Costa Rica 🇨🇷

[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github&style=flat-square)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin&style=flat-square)](https://linkedin.com/in/errold-n%C3%BA%C3%B1ez-s%C3%A1nchez)
[![Email](https://img.shields.io/badge/Email-errold222@gmail.com-D14836?logo=gmail&style=flat-square)](mailto:errold222@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+506_7802_7211-25D366?logo=whatsapp&logoColor=white&style=flat-square)](https://wa.me/50678027211)

</div>
