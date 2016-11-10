/* eslint-disable */
(function(window) {
	var Mocha = window.Mocha;
	var mocha = window.mocha;

	function onTestEvent(test, err) {
		var data = {
			title: test.title,
			type: test.type,
			body: test.body,
			state: test.state
		};

		if (err) {
			data.err = {
				message: err.message,
				stack: err.stack
			};
		}

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

		runner.on('test', onTestEvent);
		runner.on('fail', onTestEvent);
		runner.on('pending', onTestEvent);
		runner.on('test end', onTestEvent);
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
