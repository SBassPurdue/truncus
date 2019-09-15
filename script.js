function renderTree(score) {
  var div = document.getElementById("renderImg");

  if (score < 1000) {
    div.src = "TreeDead.png";
  } else if (score < 2000) {
    div.src = "TreePartial.png";
  } else if (score < 3000) {
    div.src = "TreeFull.png";
  } else {
    div.src = "TreeBloom.png";
  }
}

var birdLocations = [[275, 0], [25, 0], [5, 380], [295, 380]];
document.addEventListener("DOMContentLoaded", birdMovementInit());

function birdMovementInit() {
  console.log("Bird Move Init");
  var birdMovement = setInterval(birdMovementRoutine, 7000);
}

function birdMovementRoutine() {
  console.log("Bird Move");
  var rand = Math.floor(4 * Math.random());
  moveBird(birdLocations[rand][0], birdLocations[rand][1]);
}

//Centered at top left of bird
function moveBird(newX, newY) {
  var birdBox = document.getElementById("birdBox");
  var birdSprite = document.getElementById("birdSprite");
  var oldLeft = parseInt(birdBox.style.left, 10);
  var oldTop = parseInt(birdBox.style.top, 10);
  var duration = 500; //ms
  var deltaT = 8;
  var deltaX = (newX - oldLeft) / duration; //pixels per time step
  var deltaY = (newY - oldTop) / duration; //pixels per time step
  var birdDown = (deltaX >= 0 ? "BirdFlapDown.png" : "BirdFlapDownRev.png");
  var birdStill = (deltaX >= 0 ? "BirdStill.png" : "BirdStillRev.png");
  var birdUp = (deltaX >= 0 ? "BirdFlapUp.png" : "BirdFlapUpRev.png");
  var t = 0;
  var i = 0;

  var movement = setInterval(function() {
    birdBox.style.left = (parseFloat(birdBox.style.left) + (deltaX * deltaT)) + "px";
    birdBox.style.top = (parseFloat(birdBox.style.top) + (deltaY * deltaT)) + "px";
    t = t + deltaT;
    i++;
    if (i % 16 <= 4) {
      birdSprite.src = birdDown;
    } else if (i % 16 <= 8 || i % 16 > 12) {
      birdSprite.src = birdStill;
    } else {
      birdSprite.src = birdUp;
    }
    if (t > duration) {
      birdBox.style.left = newX + "px";
      birdBox.style.top = newY + "px";
      birdSprite.src = birdStill;
      clearInterval(movement);
    }
  }, deltaT);
}
