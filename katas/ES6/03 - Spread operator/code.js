// Override this ES5 function to make it simple!
function spread() {
	const params = [].slice.apply(arguments);
	const obj = arguments[0];
	obj.fn.apply(this, obj.args);

	return params[params.length - 1];
}
