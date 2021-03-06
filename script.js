var addBtn = document.querySelectorAll('.button--add')[0];
var dellBtn = document.querySelectorAll('.button--delete')[0];
var startBtn = document.querySelectorAll('.button--starttest')[0];
var clearBtn = document.querySelectorAll('.button--clearresults')[0];

function addTestCaseHandler(value) {
  var wrapper = document.querySelectorAll('.testcases-wrapper')[0];
  var div = document.createElement('div');
  var titel = document.createElement('h5');
  var titelText = document.createTextNode('Test case ' + wrapper.children.length + ' :');
  var textarea = document.createElement('textarea');
  if (value && typeof value === 'string') {
    textarea.value = value;
  }
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
  showLoadingScreen();
  setTimeout(function(){
    var executions = document.getElementById('executions').value;
    var repeats = document.getElementById('repeats').value;
    var testCases = document.querySelectorAll('.testcase');
    var results = [];
    var testCasesValue = {};
    for (var i = 0; i < testCases.length; i++) {
      testCasesValue[i] = testCases[i].value;
      results.push(execute(testCases[i].value, +executions, +repeats));
    }
    showResults(results);
    hideLoadingScreen();
    saveValue(testCasesValue);
    }, 
  7);
}

function execute(code, executions, repeats) {
  var result = {}, start, end, ressArr = [], currentStart, mid, i, j;
  if (typeof executions === 'number' && typeof repeats === 'number' && executions > 0 && repeats > 0) {
    try {
      start = performance.now();
      for (i = 0; i < repeats; i++) {
        currentStart = performance.now();
        for (j = 0; j < executions; j++) {
          eval(code);
        }
        ressArr.push(performance.now() - currentStart);
      }
      end = performance.now();
      result.full = end - start;
      result.max = 0;
      result.min = Number.MAX_SAFE_INTEGER;
      for (i = 0; i < ressArr.length; i++) {
        if (ressArr[i] < result.min ){
          result.min = ressArr[i];
          continue;
        }
        if (ressArr[i] > result.max) {
          result.max = ressArr[i];
          continue;
        }
      }
      result.avg = result.full/repeats;
      ressArr.sort(function(a, b){ return a>b });
      mid = Math.floor(repeats / 2);
      if (repeats % 2 === 1 && repeats > 2) {
        result.median = (ressArr[mid - 1] + ressArr[mid] + ressArr[mid + 1]) / 3;
      } else {
         if (repeats === 1) {
          result.median = result.avg;
        } else {
           result.median = (ressArr[mid - 1] + ressArr[mid]) / 2;
        }
      }
      result.one = (result.full/executions)/repeats;
    } catch (e) {
      result.error = e;
    }
  } else {
    result.error = 'Wrong executions or repeats';
  }
  return result;
}
function prepareResults(result) {
  function prepareNumber(number) {
    var tmpNum = (number.toString()).split('.'),
    stdLength = 6;
    return tmpNum[1] && tmpNum[1].length > stdLength ? number.toFixed(stdLength) : number;
  }

  result.avg = prepareNumber(result.avg)
  result.median = prepareNumber(result.median);
  result.one = prepareNumber(result.one)

  return result;
}

function showResults(results) {
  var value = {
    full: 'Full time to execute:',
    max: 'Maximal time to execute:',
    min: 'Minimal time to execute:',
    avg: 'Average time to execute:',
    median: 'Median time to execute:',
    one: 'Average time to execute one statement:',
  }, wrapper = document.querySelectorAll('.results-wrapper')[0],
    div, titel, titelText, valueContainer, valueName, valueContent, divWrapper, result;

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
    if (typeof results[i].error === 'undefined') {
      result = prepareResults(results[i]);
      for (var j in result) {
        valueContainer = document.createElement('span');
        valueContainer.classList.add('valueContainer');
        valueName = document.createElement('span');
        valueContent = document.createElement('span');
        valueContent.classList.add('valueContent');
        valueName.appendChild(document.createTextNode(' ' + value[j]));
        valueContent.appendChild(document.createTextNode(' ' + result[j] + ' ms'));
        valueContainer.appendChild(valueName);
        valueContainer.appendChild(valueContent);
        divWrapper.appendChild(valueContainer);
      }
    } else {
      valueContent = document.createTextNode(results[i].error);
      divWrapper.appendChild(valueContent);
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

function showLoadingScreen() {
  var loadingOverlay = document.querySelectorAll('.loadingOverlay')[0];
  loadingOverlay.classList.toggle('loadingOverlay--hidden');
}

function hideLoadingScreen() {
  var loadingOverlay = document.querySelectorAll('.loadingOverlay')[0];
  loadingOverlay.classList.toggle('loadingOverlay--hidden');
}

function saveValue(testCasesValue) {
  location.hash = btoa(JSON.stringify(testCasesValue));
}

function restoreValue() {
  var values = location.hash.slice(1);
  try {
    values = JSON.parse(atob(values));
    for( var i in values ) {
      addTestCaseHandler(values[i]);
    }
  } catch(e) {
    addTestCaseHandler();
  }
}

restoreValue();
addBtn.addEventListener('click', addTestCaseHandler);
dellBtn.addEventListener('click', deleteTestCaseHandler);
startBtn.addEventListener('click', executeTests);
clearBtn.addEventListener('click', clearTestResults);
