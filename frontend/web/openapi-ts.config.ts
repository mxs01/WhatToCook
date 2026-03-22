import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8000/openapi.json', // Die URL deines FastAPI Backends
  output: 'src/client',                         // Wo der Code landen soll
  client: 'axios',                              // Oder 'fetch', falls du kein Axios nutzt
});