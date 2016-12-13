function patch(object, property, value) {
	// Patch the App object here!
	Object.defineProperty(object, property, {
		writable: false,
		enumerable: false,
		value
	});
}
