const { expect } = chai;

let instance;

class Authenticator {
	@mandatory(2)
	login(user, password) {
		return { user, password };
	}
}

instance = new Authenticator;

describe('Decorator #mandatory', () => {
	it('exists', () => {
		expect(mandatory).to.exist;
	});
	it('throws error when a method is called with less arguments', () => {
		expect(() => {
			instance.login('foo');
		}).to.throw(Error);
	});
	it('does not throw error when a method is called with right arguments', () => {
		expect(() => {
			instance.login('foo', 'bar');
		}).to.not.throw(Error);
	});
	it('returns method values', () => {
		const { user, password } = instance.login('foo', 'bar');

		expect(user).to.equal('foo');
		expect(password).to.equal('bar');
	});
});

