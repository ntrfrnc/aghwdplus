(function () {
	var storage = chrome.storage.local;

	storage.get('visEnhancements', function(items) {
	  if (items.visEnhancements) {
	  	document.body.insertAdjacentHTML('beforeend',
	    '<link rel="stylesheet" type="text/css" href="' + 
	           chrome.runtime.getURL("/wd.css") + '">'
		);
	  }
	});

    var urls = {
        loginPage: /https\:\/\/dziekanat\.agh\.edu\.pl\/($|Logowanie2\.aspx.*)/g,
        marks: 'https://dziekanat.agh.edu.pl/OcenyP.aspx'
    };


    if (urls.loginPage.test(document.URL)) {
    	document.body.classList.add('login-page');

		storage.get('redirect', function(items){
	        var redirectCheckbox = document.createElement('input');
	        redirectCheckbox.type = 'checkbox';
	        redirectCheckbox.checked = items.redirect;

		    var redirectLabel = document.createElement('label');
		    redirectLabel.className = 'redirect-label';
		    redirectLabel.appendChild(redirectCheckbox);
	        redirectLabel.appendChild(document.createTextNode('Przekieruj na stronę z ocenami'));

	        document.getElementById('login_button_container').appendChild(redirectLabel);

	        redirectCheckbox.addEventListener('change', function() {
            	storage.set({'redirect': redirectCheckbox.checked});
        	});
        });
    }
	storage.get('redirect', function(items){
	    if(document.URL === 'https://dziekanat.agh.edu.pl/Ogloszenia.aspx'
	     	&& urls.loginPage.test(document.referrer)
	     	&& items.redirect
	      ) {
	         window.location.href = "OcenyP.aspx";
	    }
	});

})();
