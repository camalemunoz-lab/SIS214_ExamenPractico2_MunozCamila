# 🎨 Estilos y Arquitectura CSS - Portafolio Web (Ingeniería de Sistemas)

Documentación técnica de los estilos, diseño modular, variables de tema y correcciones visuales implementadas en el portafolio web de **Camila Muñoz**.

---

## 📋 Tabla de Contenidos
1. [Arquitectura y Organización](#-arquitectura-y-organización)
2. [Sistema de Variables y Temas (Claro / Oscuro)](#-sistema-de-variables-y-temas-claro--oscuro)
3. [Buscador Flotante (Corrección de Opacidad y Posicionamiento)](#-buscador-flotante-corrección-de-opacidad-y-posicionamiento)
4. [Formulario de Contacto (Estados Visuales)](#-formulario-de-contacto-estados-visuales)
5. [Módulo Asíncrono de Repositorios (Fetch API States)](#-módulo-asíncrono-de-repositorios-fetch-api-states)

---

## 📁 Arquitectura y Organización
El diseño visual está desarrollado bajo una metodología modular y adaptativa (**Mobile-First**), garantizando una experiencia de usuario fluida y accesible en múltiples dispositivos. Las reglas se estructuran para evitar conflictos de especificidad y asegurar un rendimiento óptimo.

---

## 🌗 Sistema de Variables y Temas (Claro / Oscuro)
El sistema implementa variables CSS personalizadas sobre el elemento raíz (`:html[data-theme]`), permitiendo la persistencia visual y la transición fluida entre modos:
* **Fondo dinámico (`--bg-color`):** Adapta los tonos base de la interfaz según el modo seleccionado.
* **Tarjetas y contenedores (`--card-bg` y `--card-hover-bg`):** Elevan el contraste y la profundidad visual mediante sombras y bordes calibrados.
* **Colores de acento (`--accent-color` y `--accent-bg`):** Resaltan elementos interactivos, insignias y botones principales.

---

## 🔍 Buscador Flotante (Corrección de Opacidad y Posicionamiento)
Para evitar solapamientos con títulos de fondo y asegurar una lectura limpia, el buscador interactivo cuenta con una estructura flotante absoluta de alta prioridad (`z-index` elevado):
* **Fondo 100% Sólido:** Se utiliza `background-color: var(--card-bg) !important;` y `background-color: var(--bg-color) !important;` en los elementos y enlaces de la lista desplegable para evitar que se trasluzcan los textos y títulos inferiores.
* **Posicionamiento Absoluto Dinámico:** El contenedor posee `position: relative` y la lista utiliza `top: calc(100% + 8px);` para flotar exactamente debajo del campo de entrada sin desplazar el contenido del DOM.

---

## 📝 Formulario de Contacto (Estados Visuales)
Las clases de validación interactiva modifican en tiempo real los bordes y sombras de los campos de entrada:
* **Estado Inválido (`.form-input.invalid`):** Aplica un borde rojo y sombra difuminada para alertar al usuario sobre errores o campos requeridos incompletos (`#ef4444`).
* **Estado Válido (`.form-input.valid`):** Destaca sutilmente el campo con tonos verdes (`#10b981`).
* **Alerta de Éxito (`.success-alert`):** Contenedor estilizado con bordes y fondos traslúcidos suaves para confirmar el procesamiento correcto del mensaje sin recargar la página.

---

## 🔄 Módulo Asíncrono de Repositorios (Fetch API States)
Estilos específicos dedicados a reflejar de forma transparente los tres estados de la petición REST:
1. **Estado Cargando (`.status-loading` y `.spinner`):** Incluye una animación circular giratoria (`keyframes spin`) para indicar la sincronización de datos con GitHub.
2. **Estado Error (`.status-error`):** Diseñado con alertas en tonos rojos para notificar caídas de conexión o códigos de estado HTTP (400, 404, 500).
3. **Tarjetas de Repositorios (`.repo-card`):** Estructura de grilla flexible con efectos de elevación al pasar el cursor (`transform: translateY(-4px)`) y etiquetas distintivas para lenguajes de programación y estrellas.

---

## 👩‍💻 Autora
* **Camila Alejandra Muñoz Mamani**  
* Estudiante de Ingeniería de Sistemas — Universidad Católica Boliviana (UCB)  
* *La Paz, Bolivia*