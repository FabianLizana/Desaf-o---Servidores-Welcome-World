const express = require("express");

const app = express();
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 4000;

const rutas = require("./routes");

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      formatearNumber: function (numberString) {
        return (+numberString).toLocaleString();
      },
      primeraMayuscula: function (texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
      },
      boldHeroTitle: function (options) {
        return '<h1 class="fw-bold">' + options.fn(this) + "</h1>";
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.listen(PORT, () => {
  console.log(`El servidor está inicializado en el puerto ${PORT}`);
});

app.use("/", rutas);
module.exports = app;
