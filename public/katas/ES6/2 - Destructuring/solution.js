const letters = ['a', 'e', 'i', 'o', 'u'];

// Override this!
function iconize([, , a = '', , b = 'a'] = '') {
	if (letters.indexOf(a) > -1) {
		if (letters.indexOf(b) < 0) {
			return '★';
		}

		return '✓';
	}

	return '☢';
}
