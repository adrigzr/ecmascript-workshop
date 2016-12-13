const symbol = Symbol.for('secret');

const blackbox = {
	[symbol]: function() {
		return true;
	}
};
