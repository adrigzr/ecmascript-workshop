function mandatory(number) {
	return function(target, key, descriptor) {
		const func = descriptor.value;

		descriptor.value = function(...args) {
			if (arguments.length < number) {
				throw new Error();
			}

			return func.apply(target, args);
		}

		return descriptor;
	}
}
