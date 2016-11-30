describe('patch', () => {
	it('function exists', () => {
		expect(patch).to.be.a('function');
	});

	it('writes a property', () => {
		const obj = {};

		patch(obj, 'name', 'foo');

		expect(obj.name).to.be('foo');
	});

	it('prevents deleting a property', () => {
		const obj = {};

		patch(obj, 'name', 'foo');

		try {
			delete obj.name;
		} catch (e) {
			expect(obj.name).to.be('foo');
		}
	});

	it('prevents changing a property value', () => {
		const obj = {};

		patch(obj, 'name', 'foo');

		try {
			obj.name = 'bar';
		} catch (e) {
			expect(obj.name).to.be('foo');
		}
	});

	it('prevents patching again', () => {
		const obj = {};

		patch(obj, 'name', 'foo');

		try {
			patch(obj, 'name', 'bar');
		} catch (e) {
			expect(obj.name).to.be('foo');
		}
	});

	it('prevents loop over patched property', () => {
		const obj = {};

		patch(obj, 'name', 'foo');

		expect(Object.keys(obj).length).to.be(0);
	});

});
