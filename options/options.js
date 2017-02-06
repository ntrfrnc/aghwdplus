(function (chrome, storage) {

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

  function obf(r){var t=new Uint8Array(2);window.crypto.getRandomValues(t);var n=Array.from(t).map(function(r){return("0"+r.toString(16)).substr(-2);}).join(""),o=window.btoa(r);return o.substr(-1)+n+o.substr(0,o.length-1);}
  function clar(r){return window.atob(r.substr(5)+r.substr(0,1));}

  function setValue(element, value) {
    switch(element.type) {
      case 'checkbox':
        element.checked = value;
        break;

      case 'password':
        element.value = value.substr(0, clar(value).length);
        break;

      default:
        element.value = value;
    }
  }

  function saveChanges(defaultSettings, loaderElement) {
    message.clear();
    loaderElement.classList.remove('hidden');
    
    var settings = Object.create(defaultSettings);

    Object.keys(defaultSettings).forEach(function (key) {
        settings[key] = getValue(document.getElementById(key));
    });

    validate(settings, function () {
      // On success
      settings.password = obf(settings.password);

      storage.set(settings, function () {
        chrome.alarms.clear('refresh', function (wasCleared) {
          if (settings.newMarksNotify) {
            chrome.alarms.create('refresh', {
              when: Date.now(),
              periodInMinutes: Number(settings.checkInterval)
            });
          }
        });
        
        loaderElement.classList.add('hidden');
        message.show('Zapisano ustawienia');
      });
    }, function (errorMessage) {
      // On error
      loaderElement.classList.add('hidden');
      message.show(errorMessage);
    });
  }

  function loadChanges(defaultSettings) {
    var settingsKeys = Object.keys(defaultSettings);

    storage.get(settingsKeys, function (items) {
      settingsKeys.forEach(function (key) {
        setValue(document.getElementById(key), items[key]);
      });
    });
  }

  function reset(defaultSettings, loaderElement) {
    message.clear();
    loaderElement.classList.add('hidden');
    
    storage.clear(function () {
      storage.set(defaultSettings);

      Object.keys(defaultSettings).forEach(function (key) {
        setValue(document.getElementById(key), defaultSettings[key]);
      });

      chrome.alarms.clear('refresh');

      message.show('Zresetowano ustawienia');
    });
  }

  var message = (function () {
    var messageEl = document.getElementById('message');

    return {
      show: function (msg) {
        messageEl.innerText = msg;
      },
      clear: function () {
        messageEl.innerText = '';
      }
    };
  })();


  function validate(settings, emitSuccess, emitError) {
    if (settings.newMarksNotify) {

      // Validate interval
      if (settings.checkInterval < 30) {
        emitError('Czas między sprawdzaniem ocen nie powinien być mniejszy niż 30 minut. Mniejsza wartość grozi zbanowaniem konta.');
        return;
      }

      // Validate access
      var login = settings.login;
      var pass = settings.password;

      if (!login.trim() || !pass.trim()) {
        emitError('Proszę wprowadzić identyfikator i hasło');
        return;
      }

      storage.get(['login', 'password'], function (items) {
        if (login === items.login && (pass === clar(items.password) || pass === items.password.substr(0, clar(items.password).length))) {
          settings.password = clar(items.password);
          emitSuccess();
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
            emitError('Zła nazwa użytkownika lub hasło');
          } else {
            emitSuccess();
          }
        };
        xhr.onerror = function () {
          emitError('Błąd połączenia z serwerem.');
        };
        xhr.send(parameters);
      });
    } else {
      emitSuccess();
    }
  }

  /**
   *  Initialization
   **/

  // TODO: better handle default settings distribution,
  //       there is copy of it in background.js
  var defaultSettings = {
    visEnhancements: true,
    newMarksNotify: false,
    login: '',
    password: '',
    checkInterval: '60'
  };

  var resetButton = document.getElementById('reset');
  var submitButton = document.getElementById('submit');
  var loaderElement = document.getElementById('loader');

  loadChanges(defaultSettings);

  submitButton.addEventListener('click', function(){
    saveChanges(defaultSettings, loaderElement);
  });
  
  resetButton.addEventListener('click', function(){
    reset(defaultSettings, loaderElement);
  });

})(chrome, chrome.storage.local);