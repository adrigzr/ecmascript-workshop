
// Modificar la declaración del objeto `api` para hacer un proxy
// al objeto `core` que prohiba el acceso a propiedad privadas, es decir,
// propiedades que empiezan por `_`.

function isPublic(key) {
	return key && key[0] !== '_';
}

const api = new Proxy(core, {
	get(target, key) {
		// Write here!
	},
	set(target, key, value) {
		// Write here!
	},
	has(target, key) {
		// Write here!
	},
	ownKeys(target) {
		// Write here!
	},
	defineProperty(target, key, descriptor) {
		// Write here!
	},
	deleteProperty(target, key) {
		// Write here!
	}
});
