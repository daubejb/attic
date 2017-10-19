/*
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */
// DONE - Get successes to be green.
// DONE - Make failures red.
// TODO - Show stack traces for failures.
// TODO - Only show stack traces if you click expand.
// TODO - Output summary statistics to the DOM.

var utilities = {
  displayTestStatistics: function(tests, failures) {
    var numberOfTests = Object.keys(tests).length;
    var successes = numberOfTests - failures;
    var summaryString = 'Ran ' + numberOfTests + ' tests: '
                        + successes + ' successes, '
                        + failures + ' failures';
    
    var summaryElement = document.createElement('h1');
    summaryElement.textContent = summaryString;
    document.body.appendChild(summaryElement);
  }
};
var TinyTest = {

      run: function(tests) {
          var failures = 0;
          for (var testName in tests) {
              var testAction = tests[testName];
              try {
                  testAction.apply(this);
                  console.log("%cTest: " + testName + " OK", "color: green;");
              } catch (e) {
                  failures++;
                  console.groupCollapsed("%cTest: " + testName + " FAILED", "color: red;");
                  console.error(e.stack);
                  console.groupEnd();
              }
          }
          setTimeout(function() { // Give document a chance to complete
              if (window.document && document.body) {
                  document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
                utilities.displayTestStatistics(tests, failures);
              }
          }, 0);
      },

      fail: function(msg) {
          throw new Error('fail(): ' + msg);
      },

      assert: function(value, msg) {
          if (!value) {
              throw new Error('assert(): ' + msg);
          }
      },

      assertEquals: function(expected, actual) {
          if (expected != actual) {
              throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
          }
      },

      assertStrictEquals: function(expected, actual) {
          if (expected !== actual) {
              throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
          }
      },

  };

  var fail               = TinyTest.fail.bind(TinyTest),
      assert             = TinyTest.assert.bind(TinyTest),
      assertEquals       = TinyTest.assertEquals.bind(TinyTest),
      eq                 = TinyTest.assertEquals.bind(TinyTest), // alias for assertEquals
      assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
      tests              = TinyTest.run.bind(TinyTest);