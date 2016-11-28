const computedName = 'xg3r992h3e';

describe('Class', () => {
	context('Nerd', () => {
		it('exists', () => {
			expect(Nerd).to.be.a('function');
		});

		it('creates with default name', () => {
			const nerd = new Nerd(90, 'foo');

			expect(nerd.name).to.be('foo');
		});

		it('isHungry is not a function', () => {
			const nerd = new Nerd(90, 'foo');

			expect(nerd.isHungry).to.be.a('boolean');
		});

		it('returns true when is hungry', () => {
			const nerd = new Nerd(10, 'foo');

			expect(nerd.isHungry).to.be(true);
		});

		it('returns false when is not hungry', () => {
			const nerd = new Nerd(90, 'foo');

			expect(nerd.isHungry).to.be(false);
		});

		it('has a computed property', () => {
			const nerd = new Nerd(90, 'foo');

			expect(nerd[computedName]).to.be('I\'m foo');
		});

		it('has a removable computed property', () => {
			const nerd = new Nerd(90, 'foo');

			expect(delete nerd[computedName]).to.be(true);
		});
	});
});
