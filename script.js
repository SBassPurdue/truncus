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

//Centered at top left of bird
function moveBird(newX, newY) {
  var bird = document.getElementById("birdBox");
  var oldLeft = parseInt(bird.style.left, 10);
  var oldTop = parseInt(bird.style.top, 10);
  var duration = 1500; //ms
  var deltaT = 10;
  var deltaX = (newX - oldLeft) / duration; //pixels per time step
  var deltaY = (newY - oldTop) / duration; //pixels per time step
  var t = 0;

  var movement = setInterval(function() {
    bird.style.left = (parseFloat(bird.style.left) + (deltaX * deltaT)) + "px";
    bird.style.top = (parseFloat(bird.style.top) + (deltaY * deltaT)) + "px";
    t = t + deltaT;
    if (t > duration) {
      bird.style.left = newX + "px";
      bird.style.top = newY + "px";
      clearInterval(movement);
    }
  }, deltaT);
}
