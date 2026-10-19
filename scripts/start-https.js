const { createServer } = require("https");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3005);
const certDir = path.join(__dirname, "..", "certs");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost.pem");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  require("./generate-https-certs");
}

const app = next({
  dev: false,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
      (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      },
    ).listen(port, hostname, () => {
      console.log("");
      console.log("PWA HTTPS listo:");
      console.log(`  https://localhost:${port}`);
      console.log(`  https://192.168.7.223:${port}`);
      console.log("");
      console.log(
        "En el celular: abre esa URL HTTPS, acepta el aviso del certificado",
      );
      console.log(
        "y luego usa Instalar aplicación / Agregar a pantalla de inicio.",
      );
      console.log("");
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
