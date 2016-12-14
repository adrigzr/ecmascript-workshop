const { expect } = chai;

class Human {
	constructor(name) {
		this.food = 100;
		this.name = name;
	}

	talk(word) {
		return this.isHungry() ? 'I\'m hungry' : word;
	}
}

describe('Class', () => {
	context('Nerd', () => {
		it('exists', () => {
			expect(Nerd).to.be.a('function');
		});

		it('creates with default food', () => {
			const nerd = new Nerd(0);

			expect(nerd.food).to.equal(100);
			expect(nerd.name).to.equal(undefined);
		});

		it('creates with constructor params', () => {
			const nerd = new Nerd(90, 'foo');

			expect(nerd.food).to.equal(90);
			expect(nerd.name).to.equal('foo');
		});

		it('isHungry is a function', () => {
			const nerd = new Nerd(90);

			expect(nerd.isHungry).to.be.a('function');
		});

		it('returns hungry state', () => {
			const nerd = new Nerd(90);

			expect(nerd.isHungry()).to.equal(false);

			nerd.food = 25;

			expect(nerd.isHungry()).to.equal(false);

			nerd.food = 24;

			expect(nerd.isHungry()).to.equal(true);
		});

		it('talks when he\'s hungry', () => {
			const nerd = new Nerd(90);

			expect(nerd.talk('foo')).to.equal('Hola k ase, foo');
		});

		it('does not talks when he\'s hungry', () => {
			const nerd = new Nerd(24);

			expect(nerd.talk()).to.equal('Hola k ase, I\'m hungry');
		});
	});
});
