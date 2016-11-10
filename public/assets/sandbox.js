/* eslint-disable */
(function(window) {
	var Mocha = window.Mocha;
	var mocha = window.mocha;

	function onEvent(e) {
		var data = {
			title: e.title,
			err: {
				message: e.err.message,
				stack: e.err.stack
			},
			type: e.type,
			body: e.body,
			state: e.state
		};

		window.parent.postMessage(data, '*');
	}

	function onException(reason, file, row, column, err) {
		var data = {
			state: 'exception',
			err: {
				message: err.message,
				stack: err.stack
			}
		};

		window.parent.postMessage(data, '*');
	}

	function onEnd() {
		var data = {
			state: 'end'
		};

		window.parent.postMessage(data, '*');
	}

	function customReporter(runner) {
		Mocha.reporters.Base.call(this, runner);

		runner.on('pass', onEvent);
		runner.on('fail', onEvent);
		runner.on('end', onEnd);
	}

	function onMessage(e) {
		// Reset mocha.
		mocha.suite.suites = [];

		// Setup mocha.
		mocha.setup({
			reporter: customReporter,
			ignoreLeaks: false,
			bail: false,
			ui: 'bdd'
		});

		// Inject code.
		eval(e.data.code);

		// Inject suite.
		eval(e.data.suite);

		// Run mocha.
		mocha.run();
	}

	window.onerror = onException;
	window.addEventListener('message', onMessage);
}(window))
