const { expect } = chai;

const asyncAPI = {
	getRoom: async function(id) {
		if (id !== 1) {
			throw new Error();
		}

		return 'MyRoom';
	},

	checkAvailability: async function(room) {
		if (room !== 'MyRoom') {
			throw Error;
		}

		return true;
	},

	bookRoom: async function(room) {
		if (room !== 'MyRoom') {
			throw Error;
		}

		return true;
	}
};

describe('Function #bookRoomAsync', function() {
    it('exists', function() {
        expect(bookRoomAsync).to.exist;
    });
    it('is an async function', () => {
        expect(bookRoomAsync).to.be.an.instanceof(Function);
        expect(bookRoomAsync(1)).to.be.an.instanceof(Promise);
    });
    it('calls #getRoom async method with self arguments', async function() {
        sinon.spy(asyncAPI, 'getRoom');

        await bookRoomAsync(2);

        expect(asyncAPI.getRoom).to.have.been.calledWith(2);

        asyncAPI.getRoom.restore();
    });
    it('calls #checkAvailability method with #getRoom result', async function() {
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.spy(asyncAPI, 'checkAvailability');

        await bookRoomAsync();

        expect(asyncAPI.checkAvailability).to.have.been.calledWith('foo');

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();
    });
    it('calls #bookRoom method when room is available', async function() {
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.stub(asyncAPI, 'checkAvailability').returns(Promise.resolve(true));
        sinon.spy(asyncAPI, 'bookRoom');

        await bookRoomAsync();

        expect(asyncAPI.bookRoom).to.have.been.calledWith('foo');

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();
        asyncAPI.bookRoom.restore();
    });
    it('does not call #bookRoom method when room is not available', async function() {
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.stub(asyncAPI, 'checkAvailability').returns(Promise.resolve(false));
        sinon.spy(asyncAPI, 'bookRoom');

        await bookRoomAsync();

        expect(asyncAPI.bookRoom).to.not.have.been.calledWith('foo');

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();
        asyncAPI.bookRoom.restore();
    });
    it('returns result from bookRoom method', async function() {
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.stub(asyncAPI, 'checkAvailability').returns(Promise.resolve(true));
        sinon.stub(asyncAPI, 'bookRoom').returns(Promise.resolve(true));

        let ret = await bookRoomAsync();

        expect(ret).to.be.true;

        asyncAPI.bookRoom.restore();
        sinon.stub(asyncAPI, 'bookRoom').returns(Promise.resolve(false));

        ret = await bookRoomAsync();

        expect(ret).to.be.false;

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();
        asyncAPI.bookRoom.restore();
    });
    it('does not book a room on error', async function() {
        // getRoom error.
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.reject());

        let ret = await bookRoomAsync();

        expect(ret).to.be.false;

        asyncAPI.getRoom.restore();

        // checkAvailability error.
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.stub(asyncAPI, 'checkAvailability').returns(Promise.reject());

        ret = await bookRoomAsync();

        expect(ret).to.be.false;

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();

        // bookRoom error.
        sinon.stub(asyncAPI, 'getRoom').returns(Promise.resolve('foo'));
        sinon.stub(asyncAPI, 'checkAvailability').returns(Promise.resolve(true));
        sinon.stub(asyncAPI, 'bookRoom').returns(Promise.reject());

        ret = await bookRoomAsync();

        expect(ret).to.be.false;

        asyncAPI.getRoom.restore();
        asyncAPI.checkAvailability.restore();
        asyncAPI.bookRoom.restore();
    });
});
