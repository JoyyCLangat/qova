/**
 * Qova API entry point -- Bun-native HTTP server.
 * @author Qova Engineering <eng@qova.cc>
 */

import { app } from "./app.js";

const port = Number(process.env.PORT) || 3001;

console.log(`Qova API starting on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};
