
const api = new Proxy(core, {
	get(target, key) {
		if (!isPublic(key)) {
			return undefined;
		}

		const value = target[key];

		if (typeof value === 'function') {
			return value.bind(target);
		}

		return value;
	},
	set(target, key, value) {
		if (!isPublic(key)) {
			return false;
		}

		target[key] = value;

		return true;
	},
	has(target, key) {
		return isPublic(key) ? key in target : false;
	},
	ownKeys(target) {
		return Reflect.ownKeys(target).filter(isPublic);
	},
	defineProperty(target, key, descriptor) {
		if (!isPublic(key)) {
			return false;
		}

		Object.defineProperty(target, key, descriptor);

		return true;
	},
	deleteProperty(target, key) {
		if (!isPublic(key)) {
			return false;
		}

		delete target[key];

		return true;
	}
});

function isPublic(key) {
	return key && key[0] !== '_';
}
