/*!
 * deep-diff.
 * Licensed under the MIT License.
 */
(function(e, t){"use strict"; if (typeof define === "function" && define.amd){define([], function(){return t()})} else if (typeof exports === "object"){module.exports = t()} else{e.DeepDiff = t()}})(this, function(e){"use strict"; var t, n, r = []; if (typeof global === "object" && global){t = global} else if (typeof window !== "undefined"){t = window} else{t = {}}n = t.DeepDiff; if (n){r.push(function(){if ("undefined" !== typeof n && t.DeepDiff === p){t.DeepDiff = n; n = e}})}function i(e, t){e.super_ = t; e.prototype = Object.create(t.prototype, {constructor:{value:e, enumerable:false, writable:true, configurable:true}})}function a(e, t){Object.defineProperty(this, "kind", {value:e, enumerable:true}); if (t && t.length){Object.defineProperty(this, "path", {value:t, enumerable:true})}}function f(e, t, n){f.super_.call(this, "E", e); Object.defineProperty(this, "lhs", {value:t, enumerable:true}); Object.defineProperty(this, "rhs", {value:n, enumerable:true})}i(f, a); function l(e, t){l.super_.call(this, "N", e); Object.defineProperty(this, "rhs", {value:t, enumerable:true})}i(l, a); function u(e, t){u.super_.call(this, "D", e); Object.defineProperty(this, "lhs", {value:t, enumerable:true})}i(u, a); function s(e, t, n){s.super_.call(this, "A", e); Object.defineProperty(this, "index", {value:t, enumerable:true}); Object.defineProperty(this, "item", {value:n, enumerable:true})}i(s, a); function o(e, t, n){var r = e.slice((n || t) + 1 || e.length); e.length = t < 0?e.length + t:t; e.push.apply(e, r); return e}function c(e){var t = typeof e; if (t !== "object"){return t}if (e === Math){return"math"} else if (e === null){return"null"} else if (Array.isArray(e)){return"array"} else if (Object.prototype.toString.call(e) === "[object Date]"){return"date"} else if (typeof e.toString !== "undefined" && /^\/.*\//.test(e.toString())){return"regexp"}return"object"}function h(t, n, r, i, a, p, b){a = a || []; var d = a.slice(0); if (typeof p !== "undefined"){if (i){if (typeof i === "function" && i(d, p)){return} else if (typeof i === "object"){if (i.prefilter && i.prefilter(d, p)){return}if (i.normalize){var y = i.normalize(d, p, t, n); if (y){t = y[0]; n = y[1]}}}}d.push(p)}if (c(t) === "regexp" && c(n) === "regexp"){t = t.toString(); n = n.toString()}var v = typeof t; var g = typeof n; if (v === "undefined"){if (g !== "undefined"){r(new l(d, n))}} else if (g === "undefined"){r(new u(d, t))} else if (c(t) !== c(n)){r(new f(d, t, n))} else if (Object.prototype.toString.call(t) === "[object Date]" && Object.prototype.toString.call(n) === "[object Date]" && t - n !== 0){r(new f(d, t, n))} else if (v === "object" && t !== null && n !== null){b = b || []; if (b.indexOf(t) < 0){b.push(t); if (Array.isArray(t)){var k, m = t.length; for (k = 0; k < t.length; k++){if (k >= n.length){r(new s(d, k, new u(e, t[k])))} else{h(t[k], n[k], r, i, d, k, b)}}while (k < n.length){r(new s(d, k, new l(e, n[k++])))}} else{var j = Object.keys(t); var w = Object.keys(n); j.forEach(function(a, f){var l = w.indexOf(a); if (l >= 0){h(t[a], n[a], r, i, d, a, b); w = o(w, l)} else{h(t[a], e, r, i, d, a, b)}}); w.forEach(function(t){h(e, n[t], r, i, d, t, b)})}b.length = b.length - 1}} else if (t !== n){if (!(v === "number" && isNaN(t) && isNaN(n))){r(new f(d, t, n))}}}function p(t, n, r, i){i = i || []; h(t, n, function(e){if (e){i.push(e)}}, r); return i.length?i:e}function b(e, t, n){if (n.path && n.path.length){var r = e[t], i, a = n.path.length - 1; for (i = 0; i < a; i++){r = r[n.path[i]]}switch (n.kind){case"A":b(r[n.path[i]], n.index, n.item); break; case"D":delete r[n.path[i]]; break; case"E":case"N":r[n.path[i]] = n.rhs; break}} else{switch (n.kind){case"A":b(e[t], n.index, n.item); break; case"D":e = o(e, t); break; case"E":case"N":e[t] = n.rhs; break}}return e}function d(e, t, n){if (e && t && n && n.kind){var r = e, i = - 1, a = n.path?n.path.length - 1:0; while (++i < a){if (typeof r[n.path[i]] === "undefined"){r[n.path[i]] = typeof n.path[i] === "number"?[]:{}}r = r[n.path[i]]}switch (n.kind){case"A":b(n.path?r[n.path[i]]:r, n.index, n.item); break; case"D":delete r[n.path[i]]; break; case"E":case"N":r[n.path[i]] = n.rhs; break}}}function y(e, t, n){if (n.path && n.path.length){var r = e[t], i, a = n.path.length - 1; for (i = 0; i < a; i++){r = r[n.path[i]]}switch (n.kind){case"A":y(r[n.path[i]], n.index, n.item); break; case"D":r[n.path[i]] = n.lhs; break; case"E":r[n.path[i]] = n.lhs; break; case"N":delete r[n.path[i]]; break}} else{switch (n.kind){case"A":y(e[t], n.index, n.item); break; case"D":e[t] = n.lhs; break; case"E":e[t] = n.lhs; break; case"N":e = o(e, t); break}}return e}function v(e, t, n){if (e && t && n && n.kind){var r = e, i, a; a = n.path.length - 1; for (i = 0; i < a; i++){if (typeof r[n.path[i]] === "undefined"){r[n.path[i]] = {}}r = r[n.path[i]]}switch (n.kind){case"A":y(r[n.path[i]], n.index, n.item); break; case"D":r[n.path[i]] = n.lhs; break; case"E":r[n.path[i]] = n.lhs; break; case"N":delete r[n.path[i]]; break}}}function g(e, t, n){if (e && t){var r = function(r){if (!n || n(e, t, r)){d(e, t, r)}}; h(e, t, r)}}Object.defineProperties(p, {diff:{value:p, enumerable:true}, observableDiff:{value:h, enumerable:true}, applyDiff:{value:g, enumerable:true}, applyChange:{value:d, enumerable:true}, revertChange:{value:v, enumerable:true}, isConflict:{value:function(){return"undefined" !== typeof n}, enumerable:true}, noConflict:{value:function(){if (r){r.forEach(function(e){e()}); r = null}return p}, enumerable:true}}); return p});

(function (chrome, storage) {
  
  function checkForChanges(login, pass) {
    getMarksWebsite(login, pass, function (websiteContent) {
      if(websiteContent === null){
        chrome.runtime.sendMessage('marksUpdatingError');
        return;
      }
      
      var marks = getMarks(websiteContent);

      storage.get(['marks'], function (items) {
        var oldMarks = (items.marks) ? JSON.parse(items.marks) : null;

        if (oldMarks) {
          var changes = DeepDiff(marks, oldMarks);
          if (changes) {
            notify(changes);
          }
        }

        storage.set({'marks': JSON.stringify(marks), 'lastCheck': Date.now()}, function () {
          chrome.runtime.sendMessage('marksUpdated');
        });
      });
    });
  }

  function getMarks(websiteContent) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(websiteContent, "text/html");
    var marksTable = htmlDoc.getElementById('ctl00_ctl00_ContentPlaceHolder_RightContentPlaceHolder_dgDane');
    var marks = {};

    var marksRows = marksTable.querySelectorAll('tr:not(:first-child)');
    [].forEach.call(marksRows, function (marksRow, i) {
      var subjectCase = {};
      var caseName = marksRow.querySelector('td:nth-child(3)').textContent;
      var markPattern = /^[^<>]+(?=<br>)|[^<>]+(?=<\/span><br>)/g;
      subjectCase['Ocena'] = marksRow.querySelector('td:nth-child(4)').innerHTML.match(markPattern);
      subjectCase['Termin 1'] = marksRow.querySelector('td:nth-child(5)').innerHTML.match(markPattern);
      subjectCase['Termin 2'] = marksRow.querySelector('td:nth-child(6)').innerHTML.match(markPattern);
      subjectCase['Termin 3'] = marksRow.querySelector('td:nth-child(7)').innerHTML.match(markPattern);

      var subject = marksRow.querySelector('td:first-child').textContent;
      var prevSubject = (i === 0) ? '' : marksRows[i - 1].querySelector('td:first-child').textContent;
      if (i === 0 || subject !== prevSubject) {
        marks[subject] = {};
        marks[subject][caseName] = subjectCase;
      } else {
        marks[prevSubject][caseName] = subjectCase;
      }
    });

    return marks;
  }

  function clar(r){return window.atob(r.substr(5)+r.substr(0,1));}

  function getMarksWebsite(login, pass, onLoad) {
    var url = 'https://dziekanat.agh.edu.pl/Logowanie2.aspx?ReturnUrl=%2fOcenyP.aspx';
    var parameters =
            'ctl00_ctl00_ScriptManager1_HiddenField=' +
            '&__EVENTTARGET=' +
            '&__EVENTARGUMENT=' +
            '&ctl00_ctl00_TopMenuPlaceHolder_TopMenuContentPlaceHolder_MenuTop3_menuTop3_ClientState=' +
            '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$txtHaslo=' + clar(pass) +
            '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$txtIdent=' + login +
            '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$rbKto=student' +
            '&ctl00$ctl00$ContentPlaceHolder$MiddleContentPlaceHolder$butLoguj=Zaloguj';

    xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('HTTP_USER_AGENT', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.13) Gecko/2009073022 Firefox/3.0.13');
    xhr.setRequestHeader('HTTP_ACCEPT', 'text/html,application/xhtml+xml,application/xml; q=0.9,*/*; q=0.8');
    xhr.onload = function () {
      onLoad(this.responseText);
    };
    xhr.onerror = function () {
      onLoad(null);
    };
    xhr.send(parameters);
  }

  function notify(changes) {
    var items = [];
    changes.forEach(function (change, i) {
      items.push({
        title: String(change.lhs),
        message: change.path.join(' ')
      });
    });

    chrome.notifications.create({
      type: 'list',
      iconUrl: 'images/64.png',
      title: 'Nowe oceny!',
      message: 'Lista nowych ocen',
      items: items,
      isClickable: true,
      requireInteraction: true
    });
  }

  // TODO: better handle default settings distribution,
  //       there is copy of it in options/options.js
  var defaultSettings = {
    visEnhancements: true,
    newMarksNotify: false,
    login: '',
    password: '',
    checkInterval: '60'
  };

  chrome.runtime.onStartup.addListener(function () {
    storage.get(['newMarksNotify', 'checkInterval'], function (items) {
      if (items.newMarksNotify) {
        chrome.alarms.create('refresh', {
          when: Date.now(),
          periodInMinutes: Number(items.checkInterval)
        });
      }
    });
  });

  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
      storage.clear(function () {
        storage.set(defaultSettings);
      });
    }
  });

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm && alarm.name === 'refresh') {
      storage.get(['login', 'password'], function (items) {
        checkForChanges(items.login, items.password);
      });
    }
  });

  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg === 'updateMarks') {
      storage.get(['login', 'password'], function (items) {
        checkForChanges(items.login, items.password);
      });
    }
  });

  chrome.notifications.onClicked.addListener(function (id) {
    chrome.tabs.create({url: 'https://dziekanat.agh.edu.pl/Logowanie2.aspx?ReturnUrl=%2fOcenyP.aspx'});
    chrome.notifications.clear(id);
  });

})(chrome, chrome.storage.local);
