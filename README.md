# API REST con Express - Gestión de tareas (mvc)

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una API REST para la gestión de tareas utilizando **Node.js y Express**, implementada siguiendo el patrón de arquitectura **MVC (Modelo - Controlador)**.

La API permite realizar operaciones CRUD sobre tareas utilizando una lista en memoria como almacenamiento temporal. Cada tarea contiene un identificador, un título y un estado que indica si la tarea está completada o no.

Los datos se intercambian en formato **JSON** mediante diferentes endpoints que permiten crear, consultar, actualizar y eliminar tareas.



## Instalación

Para instalar las dependencias del proyecto ejecutar:

```bash
npm install
```


## Ejecutar el Proyecto

Para iniciar el servidor ejecutar:

```bash
npm run dev
```

El servidor se ejecutará en:

```
http://localhost:3000
```


## Endpoints Disponibles

GET /api/tareas

GET /api/tareas/buscar?titulo=nombre

GET /api/tareas/:id

POST /api/tareas

PUT /api/tareas/:id

PATCH /api/tareas/:id

DELETE /api/tareas/:id


## Obtener todas
![Obtener todas](./screenshots/getall.png)

## Obtener por título
![Obtener por título](./screenshots/titulo.png)

## Obtener por ID
![Obtener por ID](./screenshots/getid.png)

## Crear tarea
![Crear tarea](./screenshots/creartarea.png)

## Actualizar tarea
![Actualizar tarea](./screenshots/actualizarTarea.png)

## Actualizar tarea parcialmente
![Actualizar tarea parcialmente](./screenshots/actualizarTarea.png)

## Eliminar tarea
![Eliminar tarea](./screenshots/eliminarTarea.png)

## Obtener en formato de texto
![Obtener en formato de texto](./screenshots/formatoText.png)
