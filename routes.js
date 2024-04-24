const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
router.use(
  "/bootstrap_css",
  express.static("./node_modules/bootstrap/dist/css")
);
router.use("/bootstrap_js", express.static("./node_modules/bootstrap/dist/js"));
router.use("/jquery", express.static("./node_modules/jquery/dist"));
router.use("/public", express.static("./public"));

// El array de objetos lo creo por medio del middleware siguiente( pregunta 1 continuacion parte 4):
router.use((req, res, next) => {
  fs.readdir(path.join(__dirname, "archivos"), (err, archivos) => {
    if (err) {
      console.error("Error al leer el directorio:", err);
      res.status(500).send("Error interno del servidor");
    }

    res.locals.archivos = archivos.filter(
      (archivo) => !archivo.startsWith(".")
    );
    next();
  });
});
router.get("/", (req, res) => {
  res.render("inicio", { archivos: res.locals.archivos });
});

router.get("/datos", (req, res) => {
  res.json(res.locals.archivos);
});


// 1. Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida (2 Puntos)
router.get("/crear", (req, res) => {
  const { archivo, contenido } = req.query;

  res.locals.archivos.push({ archivo, contenido });
  fs.writeFile(
    path.join(__dirname, `archivos/${archivo}.txt`),
    contenido,
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al crear el archivo");
      } else {
        console.log("Archivo creado correctamente");
        res.locals.archivos.push({ archivo, contenido });
        res.status(200).send("Archivo creado correctamente");
      }
    }
  );
});

// 2. Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es declarado en los parámetros de la consulta recibida (2 Puntos)
router.get("/leer", (req, res) => {
  const { archivo } = req.query;

  fs.readFile(
    path.join(__dirname, `archivos/${archivo}`),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al leer el archivo");
      } else {
        res.render("contenido", {
          archivo,
          data: `${obtenerFechaFormateada()}-${data}`,
        });
      }
    }
  );
});

// 6. Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato “dd/mm/yyyy”. 
// Considera que si el día o el mes es menor a 10, concatenar un “0” a la izquierda. (Opcional)
function obtenerFechaFormateada() {
  const fecha = new Date();

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const year = fecha.getFullYear();

  const fechaFormateada = `${dia}/${mes}/${year}`;

  return fechaFormateada;
}
// 3. Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es declarado en los parámetros de la consulta recibida (2 Puntos)
// tambien cumple con la 7. En la ruta para renombrar, devuelve un mensaje de éxito, incluyendo el nombre anterior del archivo y su nuevo nombre de forma dinámica. (Opcional)
router.get("/renombrar", (req, res) => {
  const { nombre_seleccionado, nombre_nuevo } = req.query;

  fs.rename(
    path.join(__dirname, `archivos/${nombre_seleccionado}`),
    path.join(__dirname, `archivos/${nombre_nuevo}.txt`),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al renombrar el archivo");
      } else {
        res.status(200).json({
          mensaje: "Exito, archivo renombrado",
          nombre_seleccionado,
          nombre_nuevo,
        });
      }
    }
  );
});

// 4. Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los parámetros de la consulta recibida (2 Puntos)
router.get("/eliminar", (req, res) => {
  const { nombre_archivo } = req.query;

  fs.unlink(path.join(__dirname, `archivos/${nombre_archivo}`), (err) => {
    if (err) {
      console.error("Error al eliminar el archivo:", err);
      res.status(500).send("Error al renombrar el archivo");
    } else {
      res.status(200).send("Archivo eliminado correctamente");
    }
  });
});


// esta funcion hace que se elimine los archivos cada 5 minutos para que no se junten muchos

// function eliminarArchivosDeCarpeta() {
//   const carpeta = path.join(__dirname, "archivos");
//   fs.readdir(carpeta, (err, archivos) => {
//     if (err) {
//       console.error("Error al leer el directorio:", err);
//       return;
//     }

//     archivos.forEach((archivo) => {
//       const rutaArchivo = path.join(carpeta, archivo);

//       fs.unlink(rutaArchivo, (err) => {
//         if (err) {
//           console.error("Error al eliminar el archivo:", err);
//         } else {
//           console.log("Archivo eliminado:", rutaArchivo);
//         }
//       });
//     });
//   });
// }

// setInterval(eliminarArchivosDeCarpeta, 5 * 60 * 1000);

// eliminarArchivosDeCarpeta();

module.exports = router;
