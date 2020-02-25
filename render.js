const DAY = 32;//86400000;
let userData = window.localStorage;
let submit = document.getElementById("submitBtn");
window.localStorage.clear();
let presentEntry = {
  'houseSize': 0,
  'bagSize': 0,
  'trashBags': 0,
  'recyclingBags': 0,
  'carDur': 0,
  'carPoolHours': 0,
  'poolSize': 0,
  'mpg': 0,
  'busDur': 0,
  'trainDur': 0,
  'shuttleDur': 0,
  'beefCons': 0,
  'poultryCons': 0,
  'animCons': 0,
  'porkCons': 0,
  'produceCons': 0,
  'showerDur': 0,
  'washingDur': 0,
  'dishDur': 0,
  'toiletTrips': 0,
  'gasBill': 0,
  'powerBill': 0,
  'wasteScore': 0,
  'transitScore': 0,
  'foodScore': 0,
  'energyScore': 0,
  'entries': 0,
  'timeStamp': new Date().getTime()
};

window.onload = function() {
  if(window.localStorage.length == 0 || window.localStorage.length == 1){
    userData={
      'avgWaste': 0,
      'avgTransit': 0,
      'avgFood': 0,
      'avgEnergy': 0,
      'totalWaste': 0,
      'totalTransit': 0,
      'totalFood': 0,
      'totalEnergy': 0,
      'totalScore': 0,
      'entries': 0,
      'timeStamp': (new Date().getTime() - (DAY+1000))
    };
  }

  submit.onclick = () => {
    if(inputsCorrect()){
      let entries = parseInt(userData['entries']) + 1;
      let wasteScore = wasteCalc(presentEntry['trashBags'], presentEntry['recyclingBags'], presentEntry['houseSize'], presentEntry['bagSize']);
      let transitScore = transitCalc(presentEntry['carDur'], presentEntry['carPoolDur'], presentEntry['poolSize'], presentEntry['mpg'], parseFloat(presentEntry['busDur']) + parseFloat(presentEntry['trainDur']));
      let foodScore = foodCalc(presentEntry['porkCons'], presentEntry['beefCons'], presentEntry['poultryCons'], presentEntry['animCons'], presentEntry['produceCons'], presentEntry['toiletTrips'], presentEntry['showerDur'], presentEntry['washingDur'], presentEntry['dishDur']);
      let energyScore = energyCalc(presentEntry['powerBill'], presentEntry['gasBill'], presentEntry['houseSize']);
      presentEntry['entries'] = entries;
      presentEntry['totalScore'] = foodScore + wasteScore + energyScore + transitScore;
      userData['totalWaste'] = parseFloat(userData['totalWaste']) + wasteScore;
      userData['totalTransit'] = parseFloat(userData['totalTransit']) + transitScore;
      userData['totalFood'] = parseFloat(userData['totalFood']) + foodScore;
      userData['totalEnergy'] = parseFloat(userData['totalEnergy']) + energyScore;
      userData['totalScore'] = parseFloat(userData['totalScore']) + presentEntry['totalScore'];
      userData['avgWaste'] = parseFloat(userData['totalWaste']) / entries;
      userData['avgTransit'] = parseFloat(userData['totalTransit']) / entries;
      userData['avgFood'] = parseFloat(userData['totalFood']) / entries;
      userData['avgEnergy'] = parseFloat(userData['totalEnergy']) / entries;
      userData['avgScore'] = parseFloat(userData['totalScore']) / entries;
      userData['entries'] = entries;

      document.getElementById('presentWaste').innerHTML = wasteScore;
      document.getElementById('presentTransit').innerHTML = transitScore;
      document.getElementById('presentCons').innerHTML = foodScore;
      document.getElementById('presentEnergy').innerHTML = energyScore;
      document.getElementById('presentImpact').innerHTML = foodScore + wasteScore + energyScore + transitScore;

      document.getElementById('avgWaste').innerHTML = userData['avgWaste'];
      document.getElementById('avgTransit').innerHTML = userData['avgTransit'];
      document.getElementById('avgCons').innerHTML = userData['avgFood'];
      document.getElementById('avgEnergy').innerHTML = userData['avgEnergy'];
      document.getElementById('avgImpact').innerHTML = userData['avgScore'];

      window.localStorage.setItem('entries', userData['entries']);
      window.localStorage.setItem('totalWaste', userData['totalWaste']);
      window.localStorage.setItem('totalFood', userData['totalFood']);
      window.localStorage.setItem('totalTransit', userData['totalTransit']);
      window.localStorage.setItem('totalEnergy', userData['totalEnergy']);
      window.localStorage.setItem('totalScore', userData['totalScore']);
      window.localStorage.setItem('avgWaste', userData['avgWaste']);
      window.localStorage.setItem('avgTransit', userData['avgTransit']);
      window.localStorage.setItem('avgFood', userData['avgFood']);
      window.localStorage.setItem('avgEnergy', userData['avgEnergy']);
      window.localStorage.setItem('avgScore', userData['avgScore']);
      window.localStorage.setItem('entries', userData['entries']);
    }
  };
  let paidGas = document.getElementsByName("paidGas");
  let paidPower = document.getElementsByName("paidPower");
  paidGas[0].onclick = () => {
    document.getElementById("gasPrompt").style.display = "block";
  };
  paidGas[1].onclick = () => {
    document.getElementById("gasPrompt").style.display = "none";
  };

  paidPower[0].onclick = () => {
    document.getElementById("powerPrompt").style.display = "block";
  };
  paidPower[1].onclick = () => {
    document.getElementById("powerPrompt").style.display = "none";
  };

  if(true){//dayHasPassed()){
    submit.disabled = false;
    submit.style.background = 'blue';
    document.getElementById("timeMessage").style.display = "none";
  }
  else{
    submit.disabled = true;
    submit.style.background = 'gray';
    document.getElementById("timeMessage").style.display = "block";
  }
  document.getElementById("birdBox").style.left = 275 + document.getElementById("treeImage").getBoundingClientRect().x + "px";
  setInterval(main, 100 / 6);
}

function main(){
  if(presentEntry['entries'] == 0){
    renderTree(userData['totalScore']);
  }
  else{
    renderTree(presentEntry['totalScore']);
  }
}

function dayHasPassed(){
  console.log(presentEntry['timeStamp'] - userData['timeStamp']);
  return ((presentEntry['timeStamp'] - userData['timeStamp']) >= DAY-1);
}

function renderTree(score){
  let tree = document.getElementById("treeImage");
  let bird = document.getElementById("birdBox");

  if(score < 1000){
    tree.src="Images/TreeBloom.png";
    bird.style.display = "block";
  }
  else if(score < 2000){
    tree.src="Images/TreeFull.png";
    bird.style.display="block";
  }
  else if(score < 3000){
    tree.src="Images/TreePartial.png";
    bird.style.display="none";
  }
  else{
    tree.src="Images/TreeDead.png";
    bird.style.display="none";
  }
}

function inputsCorrect(){
  if(presentEntry['carPoolDur'] != 0 && presentEntry['poolSize'] == 0){
    window.alert("Please enter your car pool size.")
    return false;
  }
  if(document.getElementById('gasBill').style.display == "block" != 0 && presentEntry['gasBill'] == 0){
    window.alert("Please enter your gas bill.")
    return false;
  }
  if(document.getElementById('powerBill').style.display == "block" != 0 && presentEntry['powerBill'] == 0){
    window.alert("Please enter your car pool size.")
    return false;
  }

  return true;
}

function changeInput(key){
  let element = document.getElementById(key);
  let value = Number(element.value);
  if(!isNaN(value)){
    presentEntry[key] = value;
    console.log(key + ", " + element.value);
  }
  else{
    presentEntry[key] = parseFloat(userData[key]);
  }
}

function myAccFunc(id) {
  let x = document.getElementById(id);
  // if (x.className.indexOf("w3-show") == -1) {
  //   x.className += " w3-show";
  // } else {
  //   x.className = x.className.replace(" w3-show", "");
  // }
}


function wasteCalc(trashBags, recyclingBags, numPeople, sizeTrash){
  const cWaste = 82.0676;
  return (cWaste * (1 - (recyclingBags/trashBags)) * (trashBags*sizeTrash/numPeople)); //the last three letiables need inputs
}

function transitCalc(carDur, carPoolHours, poolSize, mpg, publicTransportHours){
  const cTransit = 259.644;
  return (cTransit * ((carDur/mpg) + (carPoolHours/poolSize/mpg) + (publicTransportHours/80))); //need a publicTransportHours letiable
}

function foodCalc(porkCons, beefCons, poultryCons, animalCons, produceCons, toiletTrips, showerDur, washingDur, dishDur){
  const cFood = 0.1328067;
  let foodM = (15013.3948*beefCons*0.02835) + (4806.95462*porkCons*0.02835) + (3905.65063*poultryCons*0.02835); //beef, poultry, pork
  let foodV = (1251.81*produceCons*0.02835); //vegetables, fruits
  let foodA = (3249*animalCons*0.02835); //other animal shit
  let food = foodM + foodV + foodA;
  let water = (7.94936*showerDur)+(22.175*dishDur)+(140.06*washingDur)+(13.6*toiletTrips);
  return (cFood * (food + water));
}

function energyCalc(powerBill, gasBill, numPeople){
  const cEnergy = 3.225806;
  return (cEnergy * ((powerBill + gasBill)/numPeople));
}

let birdLocations = [[275, 0], [25, 0], [5, 380], [295, 380]];
document.addEventListener("DOMContentLoaded", birdMovementInit());

function birdMovementInit() {
  console.log("Bird Move Init");
  let birdMovement = setInterval(birdMovementRoutine, 7000);
}

function birdMovementRoutine() {
  let treeBound = document.getElementById("treeImage").getBoundingClientRect();
  console.log("Bird Move");
  let rand = Math.floor(4 * Math.random());
  moveBird(birdLocations[rand][0] + treeBound.x, birdLocations[rand][1]);
}

//Centered at top left of bird
function moveBird(newX, newY) {
  let birdBox = document.getElementById("birdBox");
  let birdSprite = document.getElementById("birdSprite");
  let oldLeft = parseInt(birdBox.style.left, 10);
  let oldTop = parseInt(birdBox.style.top, 10);
  let duration = 500; //ms
  let deltaT = 8;
  let deltaX = (newX - oldLeft) / duration; //pixels per time step
  let deltaY = (newY - oldTop) / duration; //pixels per time step
  let birdDown = (deltaX >= 0 ? "Images/BirdFlapDown.png" : "Images/BirdFlapDownRev.png");
  let birdStill = (deltaX >= 0 ? "Images/BirdStill.png" : "Images/BirdStillRev.png");
  let birdUp = (deltaX >= 0 ? "Images/BirdFlapUp.png" : "Images/BirdFlapUpRev.png");
  let t = 0;
  let i = 0;

  let movement = setInterval(function() {
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
