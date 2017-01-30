function renderMarks(marksJSON) {
  var marksObject = JSON.parse(marksJSON);
  var marksHTML = '';

  for (var subject in marksObject) {
    if (!marksObject.hasOwnProperty(subject)) {
      continue;
    }

    var marks = false;
    marksHTML += '<div class="row"><h2>' + subject + '</h2>';

    for (var subjectCase in marksObject[subject]) {
      if (!marksObject.hasOwnProperty(subject)) {
        continue;
      }

      var marksMarkups = [];

      for (var markType in marksObject[subject][subjectCase]) {
        if (!marksObject.hasOwnProperty(subject) || marksObject[subject][subjectCase][markType] === null) {
          continue;
        }

        marksMarkups.push('<div class="item"><span class="mark-type">' + markType + ': </span><span class="mark">' + marksObject[subject][subjectCase][markType] + '</span></div>');
      }

      if (marksMarkups.length) {
        var marks = true;
        marksHTML += '<div class="col"><h3>' + subjectCase + '</h3>' + marksMarkups.join('') + '</div>';
      }

    }

    if (!marks) {
      marksHTML += '<span class="no-marks">Brak ocen</span></div>';
    }

    marksHTML += '</div>';
  }

  return marksHTML;
}

/**
 *  Initialization
 **/
var marksWrapper = document.getElementById('marks');
var refreshBttn = document.getElementById('refreshBttn');

function updateMarksTable() {
  chrome.storage.local.get('marks', function (items) {
    if (items.marks) {
      marksWrapper.innerHTML = renderMarks(items.marks);
    }
  });
}

chrome.storage.local.get('newMarksNotify', function (items) {
  if (!items.newMarksNotify) {
    refreshBttn.style.display = 'none';
  }
})

updateMarksTable();

document.getElementById('settingsBttn').addEventListener('click', function (e) {
  e.preventDefault();
  chrome.tabs.create({url: "/options/options.html"});
});

refreshBttn.addEventListener('click', function (e) {
  e.preventDefault();
  refreshBttn.classList.add("spin");
  chrome.runtime.sendMessage('updateMarks');
});

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'marksUpdated') {
    updateMarksTable();
    refreshBttn.classList.remove("spin");
  }
});
