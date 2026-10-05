# Modelo de grafos para optimizar la ubicación y transitabilidad en el Bloque A de la UPEA

Práctica integradora de **Investigación Operativa II / Estructuras Discretas**
Carrera de Ingeniería de Sistemas - Universidad Pública de El Alto (UPEA)
Docente: M.Sc. Ing. Juan Carlos Catunta Choquecalle

## Integrantes

| N.º | Integrante 
|---|---|---|
- Limber Churata Quispe 
- Noemi Wendy Avalos Chura 
- Deyvid Brian Yapuchura Quispe 
- Diego Kevin Mamani Rodriguez 
- Yoel Brian Cumara Yampara 
- José Gabriel Dorado Alanoca 
- Jhonatan Saul Nina Limachi 
- Saul Elmer Suxo Choque 
- Joel Suxo Jahuira 
- Victor Hugo Mamani Angulo 

## Descripción

Sistema web que modela el Bloque A de la UPEA como un grafo no dirigido y ponderado
(14 vértices y 16 aristas, distancias a pie en metros) y aplica los algoritmos
DFS, BFS, Dijkstra, Kruskal y Prim. Permite editar los datos, cargar archivos CSV o JSON,
ver los resultados resaltados en el grafo y generar un reporte.

## Cómo ejecutarlo

No necesita instalación. Descargue el proyecto y abra el archivo `index.html`
en un navegador (Edge o Chrome). Los tres archivos `index.html`, `estilos.css` y `script.js`
deben estar en la misma carpeta.

## Estructura del proyecto

- `index.html` - estructura de la interfaz
- `estilos.css` - estilos
- `script.js` - lógica, algoritmos y dibujo del grafo
- `datos/` - `vertices.csv` y `aristas.csv` con el grafo real levantado en campo
- `evidencias/croquis/` - mapa del Bloque A con las distancias
- `evidencias/fotografias/` - fotografías del contexto real (portería, pasillos, inscripciones)
- `evidencias/capturas/` - capturas del sistema: interfaz principal, matriz, reporte y los 10 casos de prueba
- `documentacion/` - informe del proyecto y figuras generadas para el informe

## Datos

El formato de los archivos es:

- `vertices.csv`: `id,nombre,descripcion`
- `aristas.csv`: `origen,destino,peso,unidad`

Las distancias se midieron con la aplicación GPS Fields Area Measure y conteo de pasos
(1 paso = 0,7 m), y se verificaron con Google Earth.

## Casos de prueba

Las capturas de los 10 casos de prueba están en `evidencias/capturas/` (archivos `figura_16` a `figura_25`).
El sistema permite cargar varios de estos casos desde el menú «Casos de prueba».

## Uso de inteligencia artificial

Se utilizaron herramientas de inteligencia artificial como apoyo en el proyecto.
La declaración de uso está en el Anexo A del informe.
