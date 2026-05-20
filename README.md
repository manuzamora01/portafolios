# 👨‍💻 Manuel Zamora del Cerro | Cloud & Infrastructure Portfolio

Bienvenido al código fuente de mi portafolio profesional. 

Este proyecto no es solo una página web estática, sino una **Single Page Application (SPA)** construida con una arquitectura modular y escalable, diseñada bajo una estética de terminal para reflejar mi enfoque en sistemas, cloud y automatización.

🌐 **[Ver Portafolio en Vivo](https://github.com/manuzamora01/portafolios/)** *(Nota: Actualizaremos este enlace cuando lo despliegues)*

## 🏗️ Arquitectura del Proyecto

Para garantizar el máximo rendimiento, seguridad y mantenibilidad, he optado por evitar frameworks pesados (como React o Angular) y librerías externas. El proyecto se basa en los siguientes principios:

* **Separación de Responsabilidades (MVC ligero):** * **Vista:** HTML5 semántico y CSS3 moderno (CSS Grid, Flexbox, Scroll Snap nativo).
    * **Datos:** Un archivo estático local `data.json` actúa como única fuente de la verdad.
    * **Controlador:** Vanilla JavaScript (ES6+) que consume el JSON de forma asíncrona mediante la API `fetch()` y renderiza el DOM dinámicamente.
* **Desescalabilidad Inmediata:** Añadir una nueva certificación, proyecto o *skill* no requiere tocar código HTML o JS. Basta con añadir un bloque al archivo JSON y el motor JS recalcula las cuadrículas y las renderiza al instante.
* **Intersección Observer API:** Implementado para gestionar las animaciones de carga a medida que el usuario hace scroll, ahorrando recursos del navegador.

## 📁 Estructura de Directorios

```text
/
├── index.html          # Esqueleto semántico principal.
├── data.json           # Base de datos local (Contenido, links, assets).
├── README.md           # Documentación del proyecto.
│
├── /css
│   └── styles.css      # Variables CSS, tema terminal, responsive layout.
│
└── /js
    └── main.js         # Motor de renderizado dinámico, efectos e inyección DOM.
