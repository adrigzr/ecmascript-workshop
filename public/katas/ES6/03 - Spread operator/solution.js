function spread({fn, args}, ...rest) {
	fn(...args);

	return rest[rest.length - 1];
}
