const { expect } = chai;

const core = {
	id: 1,
	_user: 'test',
	_pass: '1234',
	login() {
		return Boolean(this._user && this._pass);
	}
};

describe('Proxy', () => {
	it('exists', () => {
		expect(api).to.exist;
	});
	it('forwards access to public properties', () => {
		core.id = 2;

		expect(api.id).to.equal(2);
	});
	it('forwards public methods', () => {
		expect(api.login()).to.be.true;
	});
	it('hides private properties', () => {
		expect(api._user).to.be.undefined;
		expect(api._pass).to.be.undefined;
	});
	it('lists public properties', () => {
		expect('id' in api).to.be.true;
	});
	it('does not list private properties', () => {
		expect('_user' in api).to.be.false;
		expect('_pass' in api).to.be.false;
	});
	it('lists public keys', () => {
		expect(Object.keys(api).includes('id')).to.be.true;
	});
	it('does not list private keys', () => {
		expect(Object.keys(api).includes('_user')).to.be.false;
		expect(Object.keys(api).includes('_pass')).to.be.false;
	});
	it('forwards write to public properties', () => {
		api.id = 3;

		expect(core.id).to.equal(3);
	});
	it('throws error when writing private properties', () => {
		expect(() => {
			api._user = 'foo';
			api._pass = 'foo';
		}).to.throw(TypeError);
	});
	it('allows public property deletion', () => {
		delete api.id;

		expect(api.id).to.be.undefined;
	});
	it('throws error on private property deletion', () => {
		expect(() => {
			delete api._user;
			delete api._pass;
		}).to.throw(TypeError);
	});
	it('does not allow to define private property', () => {
		expect(() => {
			Object.defineProperty(api, '_user', {
				value: 1
			});
		}).to.throw(TypeError);
	});
});
