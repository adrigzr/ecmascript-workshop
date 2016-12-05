const { expect } = chai;

describe('Archer contest', function() {
	it('does not starts if there are not archers', function() {
		contest.archers = [];

		expect(contest.archersReady()).to.be(false);
	});

	it('does not starts if there are less than 10 archers', function() {
		contest.archers = [
			{ arrows: 5 }
		];

		expect(contest.archersReady()).to.be(false);
	});

	it('does not starts if there are 2 archers', function() {
		contest.archers = [
			{ arrows: 5 },
			{ arrows: 5 }
		];

		expect(contest.archersReady()).to.be(false);
	});

	it('starts if there are more than 2 archers', function() {
		contest.archers = [
			{ arrows: 5 },
			{ arrows: 5 },
			{ arrows: 5 }
		];

		expect(contest.archersReady()).to.be(true);
	});

	it('does not starts if archers does not have enough arrows', function() {
		contest.archers = [
			{ arrows: 5 },
			{ arrows: 1 },
			{ arrows: 5 }
		];

		expect(contest.archersReady()).to.be(false);
	});

	it('does not starts if archers does not have enough arrows', function() {
		contest.archers = [
			{ arrows: 1 },
			{ arrows: 1 },
			{ arrows: 1 }
		];

		expect(contest.archersReady()).to.be(false);
	});

	it('starts if archers have enough arrows', function() {
		contest.archers = [
			{ arrows: 5 },
			{ arrows: 5 },
			{ arrows: 5 }
		];

		expect(contest.archersReady()).to.be(true);
	});

	it('starts if archers have a lot of arrows', function() {
		contest.archers = [
			{ arrows: 9999 },
			{ arrows: 9999 },
			{ arrows: 9999 }
		];

		expect(contest.archersReady()).to.be(true);
	});
});
