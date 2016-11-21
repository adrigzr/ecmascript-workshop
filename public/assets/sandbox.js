/* eslint-disable */
"use strict";

function callCode(code) {
  eval(code);
}

(function(window) {
	var Mocha = window.Mocha;
	var mocha = window.mocha;

	function setProperties(src, dst, properties) {
		properties.forEach(function(property) {
			setProperty(src, dst, property);
		});
	}

	function setProperty(src, dst, property) {
		var value = dst[property];

		if (typeof value !== "undefined") {
			src[property] = value;
		}
	}

	function unfoldTest(test) {
		var properties = ['title', 'type', 'body', 'state', 'root'];
		var data = {};

		setProperties(data, test, properties);

		if (test.parent) {
			data.parent = unfoldTest(test.parent);
		}

		return data;
	}

	function onTestEvent(event) {
		return (test, err) => {
			var data = unfoldTest(test);

			data.event = event;

			if (err) {
				data.err = {
					message: err.message,
					stack: err.stack
				};
			}

			window.parent.postMessage(data, '*');
		};
	}

	function onException(reason, file, row, column, err) {
		err = err || { message: reason };
		var data = {
			event: 'exception',
			err: {
				message: err.message,
				stack: err.stack
			}
		};

		window.parent.postMessage(data, '*');
	}

	function onEnd() {
		var data = {
			event: 'end'
		};

		window.parent.postMessage(data, '*');
	}

	function customReporter(runner) {
		Mocha.reporters.Base.call(this, runner);

		runner.on('suite', onTestEvent('suite'));
		runner.on('test', onTestEvent('test'));
		runner.on('fail', onTestEvent('fail'));
		runner.on('pending', onTestEvent('pending'));
		runner.on('test end', onTestEvent('test end'));
		runner.on('suite end', onTestEvent('suite end'));
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

		// Append suite to code.
		var code = e.data.suite.concat(e.data.code);

		// Inject code.
		callCode(code);

		// Run mocha.
		mocha.run();
	}

	window.onerror = onException;
	window.addEventListener('message', onMessage);
}(window))
