$(function () {
  const formularioCrear = $("#formulario_crear");
  const formularioRenombrar = $("#formulario_renombrar");
  const formularioEliminar = $("#formulario_eliminar");

  formularioCrear.on("submit", function (e) {
    e.preventDefault();
    fetch(window.location.origin + "/datos")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al leer desde el servidor"); // throw Error("Error al leer desde el servidor");
        }
      })
      .then((response) => {
        const formData = new FormData(this);

        if (!response.includes(formData.get("archivo") + ".txt")) {
          crearArchivo(this, formData);
        } else {
          alert("El archivo ya existe");
        }
      });
  });

  // El código en el lado del cliente es el siguiente (parte 2 de preguna 3):
  formularioRenombrar.on("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    const nombreAntiguo = formData.get("nombre_seleccionado");
    const nombreNuevo = formData.get("nombre_nuevo");
    const url = this.action + "?" + params.toString();
    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("La petición CREAR falló");
          throw new Error("La petición CREAR falló");
        }
      })
      .catch((error) => {
        console.error("Hubo un error en la petición CREAR:", error);
      })
      .then((response) => {
        window.location.href = window.location.origin;
        alert(
          `${response.mensaje} ${response.nombre_seleccionado} a ${response.nombre_nuevo}.txt`
        );
      });
  });
  // De lado del cliente, respuesta 1 (parte 2 pregunta 1):
  formularioEliminar.on("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    const url = this.action + "?" + params.toString();
    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = window.location.origin;
          alert("Archivo eliminado con éxito");
        } else {
          console.error("La petición CREAR falló");
        }
      })
      .catch((error) => {
        console.error("Hubo un error en la petición CREAR:", error);
      });
  });
});

// función crearArchivo( parte 3 de pregunta 1):
function crearArchivo(formulario, formData) {
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  const url = formulario.action + "?" + params.toString();
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = window.location.origin;
        alert("Archivo creado con éxito");
      } else {
        console.error("La petición CREAR falló");
      }
    })
    .catch((error) => {
      console.error("Hubo un error en la petición CREAR:", error);
    });
}
