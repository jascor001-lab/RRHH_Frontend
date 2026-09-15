/**
 * HTTP  :4009 → uso normal
 * HTTPS :4443 → PWA (Instalar / Abrir en aplicación) en la IP
 */
const http = require("http");
const https = require("https");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const next = require("next");

const hostname = "0.0.0.0";
const httpPort = Number(process.env.PORT || 4009);
const httpsPort = Number(process.env.HTTPS_PORT || 4443);
const root = path.join(__dirname, "..");
const certDir = path.join(root, "certs");

const candidates = [
  {
    key: path.join(certDir, "lan-key.pem"),
    cert: path.join(certDir, "lan.pem"),
  },
  {
    key: path.join(certDir, "localhost-key.pem"),
    cert: path.join(certDir, "localhost.pem"),
  },
];

function ensureCerts() {
  fs.mkdirSync(certDir, { recursive: true });

  for (const pair of candidates) {
    if (fs.existsSync(pair.key) && fs.existsSync(pair.cert)) {
      return pair;
    }
  }

  const keyPath = candidates[0].key;
  const certPath = candidates[0].cert;

  const mkcert = spawnSync(
    "mkcert",
    [
      "-cert-file",
      certPath,
      "-key-file",
      keyPath,
      "192.168.7.223",
      "localhost",
      "127.0.0.1",
      "::1",
    ],
    { encoding: "utf8", shell: true },
  );

  if (mkcert.status !== 0 || !fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    require("./generate-https-certs");
    return candidates[1];
  }

  return candidates[0];
}

const tlsFiles = ensureCerts();

const app = next({
  dev: false,
  hostname,
  port: httpPort,
  dir: root,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const requestListener = (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    };

    http.createServer(requestListener).listen(httpPort, hostname, () => {
      console.log("");
      console.log("MoliRecursos listo");
      console.log("----------------------------------------");
      console.log(`Uso diario (HTTP):  http://192.168.7.223:${httpPort}`);
      console.log(`Localhost (HTTP):   http://localhost:${httpPort}`);
    });

    https
      .createServer(
        {
          key: fs.readFileSync(tlsFiles.key),
          cert: fs.readFileSync(tlsFiles.cert),
        },
        requestListener,
      )
      .listen(httpsPort, hostname, () => {
        console.log("----------------------------------------");
        console.log("PWA — usa este puerto:");
        console.log(`  https://192.168.7.223:${httpsPort}/login`);
        console.log(`  https://localhost:${httpsPort}/login`);
        console.log("----------------------------------------");
        console.log(
          "En el celular: abre la URL HTTPS :4443,",
        );
        console.log(
          "acepta el aviso del certificado si sale,",
        );
        console.log(
          "y Chrome mostrará Instalar / Abrir en aplicación.",
        );
        console.log("----------------------------------------");
        console.log("");
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
