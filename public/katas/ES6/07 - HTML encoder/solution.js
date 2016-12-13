// HTML chars to replace.
const htmlChars = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

// Function to replace HTML chars.
function scapeHTML(str) {
	return String.prototype.replace.call(str, /[&<>]/g, (char) => htmlChars[char]);
}

function precompile(parts, ...substitutions) {
	// Write your code here!
	let result = scapeHTML(parts[0]);

	for (let i = 0; i < substitutions.length; ++i) {
		result += substitutions[i] + scapeHTML(parts[i + 1]);
	}

	return result;
}
