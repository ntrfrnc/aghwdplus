/**
 *  Functions definitions
 **/

function getValue(element) {
  switch (element.tagName) {
    case "INPUT":
      if (element.type === 'checkbox') {
        return element.checked;
      } else if (element.type === 'text' || element.type === 'password' || element.type === 'number') {
        return element.value;
      }
      break;

    case "SELECT":
      return element.options[element.selectedIndex].value;
      break;
  }
}

function setValue(element, value) {
  if (element.type === 'checkbox') {
    element.checked = value;
  } else {
    element.value = value;
  }
}

function saveChanges() {
  var settings = Object.create(defaultSettings);

  settingsKeys.forEach(function (key) {
    settings[key] = getValue(document.getElementById(key));
  });

  validate(settings, function (result) {
    if (result) {
      storage.set(settings, function () {
        chrome.alarms.clearAll();
        if (settings.newMarksNotify) {
          chrome.alarms.create("", {delayInMinutes: Number(settings.checkInterval)});
          chrome.runtime.sendMessage('updateMarks');
        }

        message('Zapisano ustawienia');
      });
    } else {
      message('Wprowadzono złe dane');
    }
  });
}


function loadChanges() {
  storage.get(settingsKeys, function (items) {
    settingsKeys.forEach(function (key) {
      setValue(document.getElementById(key), items[key]);
    });
  });
}

function reset() {
  storage.clear(function () {
    storage.set(defaultSettings);

    settingsKeys.forEach(function (key) {
      setValue(document.getElementById(key), defaultSettings[key]);
    });

    chrome.alarms.clearAll();

    message('Zresetowano ustawienia');
  });
}

function message(msg) {
  var message = document.getElementById('message');
  message.innerText = msg;
  setTimeout(function () {
    message.innerText = '';
  }, 3000);
}

function validate(settings, callback) {
  if (settings.newMarksNotify) {
    
    // Validate interval
    if (settings.checkInterval < 5) {
      callback(false);
      return;
    }

    // Validate access
    var login = settings.login;
    var pass = settings.password;

    if (!login.trim() || !pass.trim()) {
      callback(false);
      return;
    }

    storage.get(['login', 'password'], function (items) {
      if (login === items.login && pass === items.password) {
        callback(true);
        return;
      }

      var url = 'https://dziekanat.agh.edu.pl/Logowanie2.aspx';
      var parameters =
              'ctl00_ctl00_ScriptManager1_HiddenField=' +
              '&__EVENTTARGET=' +
              '&__EVENTARGUMENT=' +
              '&ctl00_ctl00_TopMenuPlaceHolder_TopMenuContentPlaceHolder_MenuTop3_menuTop3_ClientState=' +
              '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$txtHaslo=' + pass +
              '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$txtIdent=' + login +
              '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$rbKto=student' +
              '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$butLoguj=Zaloguj';

      xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('HTTP_USER_AGENT', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.13) Gecko/2009073022 Firefox/3.0.13');
      xhr.setRequestHeader('HTTP_ACCEPT', 'text/html,application/xhtml+xml,application/xml; q=0.9,*/*; q=0.8');
      xhr.onload = function () {
        if (/Zła nazwa użytkownika lub hasło/g.test(this.responseText)) {
          callback(false);
        } else {
          callback(true);
        }
      }
      xhr.send(parameters);
    });
  }
}

/**
 *  Logic
 **/
var storage = chrome.storage.local;

// TODO: better handle default settings distribution,
//       there is copy of it in background.js
var defaultSettings = {
  visEnhancements: true,
  newMarksNotify: false,
  login: '',
  password: '',
  checkInterval: '5'
};

var settingsKeys = Object.keys(defaultSettings);

var resetButton = document.getElementById('reset');
var submitButton = document.getElementById('submit');

loadChanges();

submitButton.addEventListener('click', saveChanges);
resetButton.addEventListener('click', reset);
