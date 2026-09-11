const fs = require("fs");
const path = require("path");
const selfsigned = require("selfsigned");

const certDir = path.join(__dirname, "..", "certs");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost.pem");

fs.mkdirSync(certDir, { recursive: true });

const attrs = [
  { name: "commonName", value: "MoliRecursos RRHH" },
  { name: "organizationName", value: "Municipalidad de La Molina" },
];

const pems = selfsigned.generate(attrs, {
  days: 825,
  keySize: 2048,
  algorithm: "sha256",
  extensions: [
    {
      name: "basicConstraints",
      cA: false,
    },
    {
      name: "keyUsage",
      digitalSignature: true,
      keyEncipherment: true,
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
    },
    {
      name: "subjectAltName",
      altNames: [
        { type: 2, value: "localhost" },
        { type: 7, ip: "127.0.0.1" },
        { type: 7, ip: "192.168.7.223" },
        { type: 7, ip: "0.0.0.0" },
      ],
    },
  ],
});

fs.writeFileSync(keyPath, pems.private);
fs.writeFileSync(certPath, pems.cert);

console.log("Certificados HTTPS generados en:");
console.log(" ", keyPath);
console.log(" ", certPath);
