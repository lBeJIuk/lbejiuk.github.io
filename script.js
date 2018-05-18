var addBtn = document.querySelectorAll('.button--add')[0];
var dellBtn = document.querySelectorAll('.button--delete')[0];
var startBtn = document.querySelectorAll('.button--starttest')[0];
var clearBtn = document.querySelectorAll('.button--clearresults')[0];

function addTestCaseHandler() {
  var wrapper = document.querySelectorAll('.testcases-wrapper')[0];
  var div = document.createElement('div');
  var titel = document.createElement('h5');
  var titelText = document.createTextNode('Test case ' + wrapper.children.length + ' :');
  var textarea = document.createElement('textarea');
  div.classList.add('testcase__container');
  textarea.classList.add('testcase');
  textarea.id = 'testcase-' + wrapper.children.length;

  titel.appendChild(titelText);
  div.appendChild(titel);
  div.appendChild(textarea);
  wrapper.appendChild(div);
  startBtn.disabled = false;
  clearBtn.disabled = false;
}

function deleteTestCaseHandler() {
  var wrapper = document.querySelectorAll('.testcases-wrapper')[0];
  wrapper.removeChild(wrapper.lastChild);
  if (wrapper.children.length === 0) {
    startBtn.disabled = true;
    clearBtn.disabled = true;
  }
}

function executeTests() {
  var executions = document.getElementById('executions').value;
  var repeats = document.getElementById('repeats').value;
  var testCases = document.querySelectorAll('.testcase');
  var results = [];

  for (var i = 0; i < testCases.length; i++) {
    results.push(execute(testCases[i].value, +executions, +repeats));
  }
  showResults(results);
}

function execute(code, executions, repeats) {
  var result = {}, start, end;
  if (typeof executions === 'number' && typeof repeats === 'number') {
    try {
      start = performance.now();
      for (var i = 0; i < repeats; i++) {
        for (var j = 0; j < executions; j++) {
          eval(code);
        }
      }
      end = performance.now();
      result.full = end - start;
      result.avg = result.full/repeats;
      result.one = result.full/executions;
      return result;
    } catch (e) {
      return e;
    }
  }
  return 'err : executions or repeats is not a number';
}

function showResults(results) {
  var value = {
    full: 'Full time to execute:',
    avg: 'Average time to execute:',
    one: 'Average time to execute one statement:'
  }, wrapper = document.querySelectorAll('.results-wrapper')[0],
    div, titel, titelText, valueContainer, valueName, valueContent, divWrapper;

  clearTestResults();
  for (var i = 0; i < results.length; i++) {
    div = document.createElement('div');
    div.classList.add('result');
    titel = document.createElement('h5');
    titelText = document.createTextNode('Retult for testcase ' + i + ' :');
    titel.appendChild(titelText);
    div.appendChild(titel);

    divWrapper = document.createElement('div');
    divWrapper.classList.add('result-wrapper');
    for (var j in results[i]) {
      valueContainer = document.createElement('span');
      valueContainer.classList.add('valueContainer');
      valueName = document.createElement('span');
      valueContent = document.createElement('span');
      valueName.appendChild(document.createTextNode(' ' + value[j]));
      valueContent.appendChild(document.createTextNode(' ' + results[i][j] + ' ms'));
      valueContainer.appendChild(valueName);
      valueContainer.appendChild(valueContent);
      divWrapper.appendChild(valueContainer);
    }
    div.appendChild(divWrapper);
    wrapper.appendChild(div);
  }
  clearBtn.disabled = false;
}

function clearTestResults() {
  var wrapper = document.querySelectorAll('.results-wrapper')[0];
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  clearBtn.disabled = true;
}

addTestCaseHandler();
addBtn.addEventListener('click', addTestCaseHandler);
dellBtn.addEventListener('click', deleteTestCaseHandler);
startBtn.addEventListener('click', executeTests);
clearBtn.addEventListener('click', clearTestResults);
