var player, playlist;
var videos = document.querySelectorAll(".video");
// var vAnalytics = new mistats.VideoPlayer();

function sendHeight() {
  window.parent.postMessage({
    sentinel: 'amp',
    type: 'embed-size',
    height: document.body.scrollHeight
  }, '*');
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Generic resize events
 */

window.addEventListener('load', sendHeight);
window.addEventListener('resize', debounce(sendHeight, 200)); 

/*
 * Brightcove manual implementation for Omniture integration
 */

videojs("player").ready(function() {
  player = this;

  // Settings
  player.playlist.autoadvance(0);

  // Events
  player.on("play", function() {
    let plist = player.playlist();
    let info = plist[player.playlist.currentIndex()];

    let payload = {
      title: info.name,
      duration: info.duration,
      vgrapher: info.customFields.byline1,
      pageName: 'Then I Knew'
    }

    console.log(payload);
    // vAnalytics.start(payload);
  });
});

/*
 * Thumbnail click event
 */

for(i = 0, len = videos.length; i < len; i++) {
  var v = videos[i];
  v.addEventListener("click", function() {
    let index = Array.prototype.indexOf.call(videos, this);

    if(index > -1) {
      // There is a trailer which is where the +1 is coming from
      player.playlist.currentItem(index + 1);
    }

    window.parent.postMessage({
      sentinel: 'video-scroll'
    }, '*');
  });
}
