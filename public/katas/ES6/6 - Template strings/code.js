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

}
