describe('Destructuring', function() {
	it('has correct type with string arg', function() {
		const result = iconize('');

		expect(result).to.be.a('string');
	});

	it('has correct type whitout args', function() {
		const result = iconize();

		expect(result).to.be.a('string');
	});

	it('returns 1º condition with a vocal', function() {
		const result = iconize('--e');

		expect(result).to.be('✓');
	});

	it('returns 1º condition with two vocals', function() {
		const result = iconize('--e-a');

		expect(result).to.be('✓');
	});

	it('returns 2º condition with a vocals and a letter', function() {
		const result = iconize('--e-b');

		expect(result).to.be('★');
	});

	it('returns 3º condition without params', function() {
		const result = iconize('');

		expect(result).to.be('☢');
	});

	it('returns 3º condition without letters', function() {
		const result = iconize('-----');

		expect(result).to.be('☢');
	});
});
