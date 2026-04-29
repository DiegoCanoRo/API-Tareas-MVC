'use strict';
//archivo principal del servidor que configura HTTPS, sincroniza la base de datos y arranca la aplicación Express.
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();
const selfsigned = require('selfsigned');
const app = require('./src/app');
const db = require('./models');

const PORT = process.env.PORT || 3000;
const CERT_DIR = path.join(__dirname, 'certs');
const CERT_PATH = path.join(CERT_DIR, 'server.crt');
const KEY_PATH = path.join(CERT_DIR, 'server.key');

// verificar si el directorio de certificados existe, si no, crearlo
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

// verificar si los archivos de certificado y clave existen, si no, generarlos automáticamente
let key;
let cert;
if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
  cert = fs.readFileSync(CERT_PATH, 'utf8');
  key = fs.readFileSync(KEY_PATH, 'utf8');
} else {// generar certificados TLS autofirmados para desarrollo local
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    days: 365,
    keySize: 2048,
    algorithm: 'sha256',
    extensions: [{ name: 'basicConstraints', cA: true }],
  });
  // guardar los certificados generados en el sistema de archivos para su uso futuro
  cert = pems.cert;
  key = pems.private;
  fs.writeFileSync(CERT_PATH, cert, 'utf8');
  fs.writeFileSync(KEY_PATH, key, 'utf8');
  console.log('Certificados TLS autofirmados generados en /certs');
}

// sincronizar la base de datos y luego iniciar el servidor HTTPS
db.sequelize.sync()
  .then(() => {
    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`🚀 Servidor HTTPS corriendo en https://localhost:${PORT}`);
      console.log(`📚 Documentación de endpoints: https://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  });
