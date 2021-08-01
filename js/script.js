// 1. GRAB THE SEARCH DATA 

var UI = {};

UI.handleEnterPress = function() {
	document.querySelector(".js-search").addEventListener('keypress', function( e ) {
		if ( e.which === 13 ) {
			var inputValue = e.target.value;
			SoundCloudAPI.getTrack(inputValue);
			
		}
	});
}

UI.handleSubmitClick = function() {
	document.querySelector(".js-submit").addEventListener('click', function( e ) {
		var inputValue = document.querySelector(".js-search").value;
		SoundCloudAPI.getTrack(inputValue);
	});
} 

// set up the search
UI.handleEnterPress();
UI.handleSubmitClick();





// 2. SEARCH THE SOUNDCLOUD API WITH HARDCODED SEARCH 

var SoundCloudAPI = {};

SoundCloudAPI.init = function() {
	SC.initialize({
		client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
	});

} 	

// set up soundcloud API
SoundCloudAPI.init();

SoundCloudAPI.getTrack = function(inputValue) {
	return SC.get('/tracks/', {
		// q: "sun kill moon"
		q: inputValue
	}).then(function(tracks) {
  		console.log(tracks);

  		//MOVING this here (away from renderTrack) only makes sense once you put it there to build
  		//and then find that the innerHTML text only should get removed once 
  		var searchResult = document.querySelector('.js-search-results');
			searchResult.innerHTML = "";

  		SoundCloudAPI.renderTrack(tracks, searchResult);

	});
}


SoundCloudAPI.renderTrack = function( tracks, searchResult ) {

		tracks.forEach(function(track) {

			var card = document.createElement('div');
			card.classList.add('card');

			// image
			var imageDiv = document.createElement('div');
			imageDiv.classList.add('image');

			var image_img = document.createElement('img');
			image_img.classList.add('image_img');
			image_img.src = track.artwork_url || 'http://lorempixel.com/100/100/abstract/';

			imageDiv.appendChild( image_img );

			// content
			var content = document.createElement('div');
			content.classList.add('content');

			var header = document.createElement('div');
			header.classList.add('header');
			header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + '</a>';

			content.appendChild( header );

			searchResult.appendChild(content);

			// button
			var button = document.createElement('div');
				button.setAttribute('data-id', track.id) 
			button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

			var icon = document.createElement('i');
			icon.classList.add('add', 'icon');

			var buttonText = document.createElement('span');
			buttonText.innerHTML = 'Add to playlist';

			button.appendChild( icon );
			button.appendChild( buttonText );

				button.addEventListener('click', function() {

						SoundCloudAPI.getEmbed(track.uri);
				});

			// card
			card.appendChild( imageDiv );
			card.appendChild( content );
			card.appendChild( button );

			searchResult.appendChild( card );

		});	
}


SoundCloudAPI.getEmbed = function( trackPermalink ) {

	SC.oEmbed(trackPermalink, { auto_play: true }).then(function(oEmbed) {
	  console.log('oEmbed response: ', oEmbed);

	  var sideBar = document.querySelector(".col-left");

	  var box = document.createElement("div");
	  box.innerHTML = oEmbed.html;

	  sideBar.insertBefore(box, sideBar.firstChild);

	  //set local storage so we can call it after refresh 
	  localStorage.setItem("key", sideBar.innerHTML);	
	  
	  // grab the widget object
		var SCWdiget = SoundCloudAPI.getWidget( embed.childNodes[ 0 ] );

		// bind the finish event to init
		SCWdiget.bind('finish', function() {
			alert("FINISHED");
		});
		SCWdiget.bind('play', function() {
			var widgetIndex = Array.from( sidebar.childNodes ).indexOf( embed );
			Playlist.currentTrack = widgetIndex;
		});

	});
}

SoundCloudAPI.getWidget = function( embedElement ) {
	return SC.Widget( embedElement );
}

//POPULATE THE TRACK LIST FROM LOCAL STORAGE 
  var sideBar = document.querySelector(".col-left");
  sideBar.innerHTML = localStorage.getItem("key");






