let is_fullscreen = false;

function openFullscreen() {
  let iframe = document.getElementById("iframe");
  let game = document.getElementById("game-area");
  let Button = document.getElementById("mobile-back-button");

  if (is_fullscreen) {
    // Exit fullscreen
    if (is_mobile_device()) {
      Button.style.display = "none";
      iframe.style.width = ""; // Reset width
      iframe.style.height = ""; // Reset height
      iframe.style.borderRadius = "";
      iframe.style.marginLeft = "";
      iframe.style.marginRight = "";
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    is_fullscreen = false;
  } else {
    // Enter fullscreen
    if (is_mobile_device()) {
      Button.style.display = "flex";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.borderRadius = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";

      if (game.requestFullscreen) {
        game.requestFullscreen();
      } else if (game.mozRequestFullScreen) {
        game.mozRequestFullScreen();
      } else if (game.webkitRequestFullscreen) {
        game.webkitRequestFullscreen();
      } else if (game.msRequestFullscreen) {
        game.msRequestFullscreen();
      }
    } else {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }

    is_fullscreen = true;
  }
}

function is_mobile_device() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

function hideImgTextOnMobile() {
  if (is_mobile_device()) {
    let elements = document.getElementsByClassName("imgtext");
    let elements2 = document.getElementsByClassName("CreatorText");

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].style.display = "none";
    }
  }
}

window.onload = function() {
  document.body.classList.add('fade-in');

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
      if (this.id.includes('no-animation')) {
        return; // Skip animation
      }
      
      event.preventDefault();
      const href = this.getAttribute('href');

      document.body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = href;
      }, 700);
    });
  });
};

const userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);

/*async function logUser(status) {
    await fetch('https://coldnova.xyz/api/log-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
    });
}
// Log when the user opens the tab
logUser('joined');

*/

// Log when the user leaves or closes the tab
window.addEventListener('beforeunload', () => logUser('left'));


if (document.cookie.split('; ').find(row => row.startsWith('shown=')) !== 'shown=true') {
  //window.location.href = '/disclaimer.html';
} else {
  // Create the 'shown' cookie with a value of 'true'
  document.cookie = "shown=true; path=/; max-age=31536000"; // Cookie expires in 1 year
}