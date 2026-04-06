# The Burgery - Sistema de Gestión de Producción y Compras

¡Hola! He completado el desarrollo del sistema web fullstack para **The Burgery**. 

## Entregables
1. **Backend Completo**: Spring Boot 3 + Java 21 ubicado en la carpeta `backend/`.
2. **Frontend Completo**: React + Vite ubicado en la carpeta `frontend/`.
3. **Database Script**: Archivo `database.sql` en la raíz de la carpeta.
4. **Instrucciones de Ejecución**: Detalladas en este documento.

## Instrucciones paso a paso para correr el proyecto

### 1. Configurar la Base de Datos
1. Abre tu gestor de base de datos MySQL (por ejemplo, DBeaver, MySQL Workbench o XAMPP/phpMyAdmin).
2. Asegúrate de que tu base de datos esté corriendo en `localhost` por el puerto `3306` (usuario `root` sin contraseña por defecto, como lo configuramos en Spring Boot).
3. Abre el archivo `database.sql` proporcionado en el directorio raíz o ejecútalo en tu gestor.
4. Esto creará la base de datos `burgery_db` junto con todas las tablas necesarias y sus relaciones.

### 2. Correr el Backend (Spring Boot)
1. Abre la carpeta `backend` en tu IDE favorito para Java (IntelliJ IDEA, Eclipse o VS Code).
2. Deja que el IDE descargue e importe las dependencias automáticamente usando el archivo `pom.xml` (Maven).
3. Navega hasta el archivo principal: `src/main/java/com/theburgery/backend/BackendApplication.java`.
4. Haz clic derecho y selecciona **"Run BackendApplication.main()"**.
5. Verás en la consola que la aplicación arranca exitosamente en el puerto `8080`.

### 3. Correr el Frontend (React + Vite)
Para levantar la interfaz gráfica orientada a uso en cocina:
1. Abre una terminal (como PowerShell o CMD).
2. Navega al directorio del frontend:
   ```bash
   cd c:\Users\SEBASTIAN\Desktop\CocinaApp\frontend
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Levanta el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
5. Abre en tu navegador la ruta que te indica la terminal (por defecto suele ser `http://localhost:5173`).

---

## 🚀 Funcionalidades Incluidas

- **Diseño minimalista UX/UI**: Adaptado completamente al español, colores blanco, negro y grises. Botones grandes y una interfaz enfocada a la utilización fluida y fácil aprendizaje en tablets por el personal de cocina. Sin marcos adicionales ni distracciones.
- **Dashboard**: Panel central con un resumen general de las entidades del sistema y los ingredientes registrados.
- **Módulo de Recetas**: Permite crear recetas desde cero, añadiendo de forma ágil múltiples ingredientes de la base de datos e indicando la dosis exacta.
- **Checklist de Producción**: El módulo principal, al abrir una receta puedes marcar individualmente cada ingrediente como "Hay", "No Hay", o "Falta Cantidad". El sistema inteligentemente recabará estos datos.
- **Generadores Automáticos**: Agrupación automática de pedidos (filtrando por la carencia indicada en el checklist), consolidado y separados lógicamente por "Proveedor".
- **Exportación en PDF**: Sistema habilitado para descargar las listas de provisión con formato limpio.
- **WhatsApp Directo**: Generador de enlaces inteligentes a web.whatsapp.com/wa.me para procesar el pedido a los proveedores pre-alimentando un mensaje predefinido con las listas y cantidades precisadas.

## Ejemplos de Endpoints REST
El backend es una API REST con arquitectura por capas, validaciones y manejo global de errores:

- `GET /api/ingredients` - Obtiene listado de todos los ingredientes.
- `POST /api/ingredients` - Crea un ingrediente nuevo con validación Jakarta.
- `GET /api/recipes` - Retorna toda la información de recetas (incluyendo relacionales en JSON).
- `POST /api/purchase_orders` - Toma los ingredientes faltantes, crea una orden e historial de requerimiento.

> ¡Todo el código lo he proporcionado directamente! Revísalo y dime qué te parece.


-Verduras Don Lopez 
Cebolla blanca
Cebolla larga
Ajo
Tomate chonto
Tomate riñón 
Platano maduro 
Platano verde
Pimentón
Perejil
Papa pastusa
Piña

-Bj 
Queso mozarella en bloque
Queso mozarella en lonchas
Queso criollo
Papas en cascos
Papa criolla
Aros de cebolla
Vinagre
Humo
Salsa soya
Salsa dulce maíz 

-Atlantic
Panko
Carne de hamburguesa
Espaldilla
Pancetta
Aros de cebolla


-Calypso
Salsa cheddar
Tocineta

-Quesera la 13
Levadura
Harina de trigo
Margarina Natura
Azucar
Sal
Amapola
Ajonjoli

-Mundo marino
Huevos

-Juan DHoyos
Adobo completo 
Siracha
Amazon trufa 
Pepinillos
Pimienta
Paprika
Ajo molido
Color
Finas Hierbas 
Orégano molido
Laurel
Albahaca
Nuez moscada

-Colanta 
Queso crema

-D1
Miga de pan
Bbq
Miel
Aceite claro
Parmesano
Harina de maíz
Mayonesa 
Salsa de tomate
Azucar morena
Vinagre de manzana
Aceite de oliva
Frijol

-Supermercados laureles 
Queso azul
Cilantro
Nachos

-Maple Leaf
Cheddar en lonchas de 20 gr
Cheddar de 40 gr
Monterrey  de 60 gr
Colby de 20 gr

-Proveedor del cogollo
Cogollo europeo

-Mac Pollo
Pechuga de pollo
Colombinas

