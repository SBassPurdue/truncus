const DAY = 86400000;
let userData = window.localStorage;
let submit = document.getElementById("submitBtn");
let paidGas = document.getElementsByName("paidGas");
let paidPower = document.getElementsByName("paidPower");

let presentEntry = {
  'trashBags': 0,
  'recyclingBags': 0,
  'carHours': 0,
  'carPoolHours': 0,
  'poolSize': 0,
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

window.onload = function(){
  if(window.localStorage.length == 0){
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
      'trashBags': 0,
      'recyclingBags': 0,
      'carHours': 0,
      'carPoolHours': 0,
      'poolSize': 0,
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
      'gasBill': 0,
      'powerBill': 0,
      'timeStamp': (new Date().getTime() - (DAY+1000))
    };
  }

  submit.onclick = () => {
    if(inputsCorrect()){
      let entries = userData['entries'];
      let wasteScore = wasteCalc(presentEntry['trashBags'], presentEntry['recyclingBags']);
      let transitScore = transitCalc(presentEntry['carDur'], presentEntry['carPoolDur'], presentEntry['poolSize']);
      let foodScore = foodCalc(presentEntry['porkCons'], presentEntry['beefCons'], presentEntry['poultryCons'], presentEntry['dairyCons'], presentEntry['produceCons']);
      let energyScore = energyCalc(presentEntry['gasBill'], presentEntry['powerBill']);
      presentEntry['entries'] += 1;
      presentEntry['totalScore'] = foodScore + wasteScore + energyScore + transitScore;
      userData['totalWaste'] = wasteScore;
      userData['totalTransit'] = transitScore;
      userData['totalFood'] = foodScore;
      userData['totalEnergyr'] = energyScore;
      userData['totalScore'] = presentEntry['totalScore'];
      userData['entries'] += 1;
      userData['avgWaste'] = userData['totalWaste'] / entries;
      userData['avgTransit'] = userData['totalTransit'] / entries;
      userData['avgFood'] = userData['totalFood'] / entries;
      userData['avgEnergy'] = userData['totalEnergy'] / entries;

      document.getElementById('presentWaste').innerHTML = wasteScore;
      document.getElementById('presentTransit').innerHTML = transitScore;
      document.getElementById('presentFood').innerHTML = foodScore;
      document.getElementById('presentEnergy').innerHTML = energyScore;

      document.getElementById('avgWaste').innerHTML = userData['avgWaste'];
      document.getElementById('avgTransit').innerHTML = userData['avgTransit'];
      document.getElementById('avgFood').innerHTML = userData['avgFood'];
      document.getElementById('avgEnergy').innerHTML = userData['avgEnergy'];
    }
  };

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

  if(dayHasPassed()){
    submit.enabled = true;
    submit.style.background = 'blue';
    document.getElementById("timeMessage").style.display = "none";
  }
  else{
    submit.enabled = false;
    submit.style.background = 'gray';
    document.getElementById("timeMessage").style.display = "block";
  }
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
  let div = document.getElementById("renderImg");
  if(score < 1000){
    div.src="TreeDead.png";
  }
  else if(score < 2000){
    div.src="TreePartial.png";
  }
  else if(score < 3000){
    div.src="TreeFull.png";
  }
  else{
    div.src="TreeBloom.png";
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
    presentEntry[key] = userData[key];
  }
}

function myAccFunc(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}


function wasteCalc(trashBags, recyclingBags, numPeople){
  const cWaste = 82.0676;
  return (cWaste * (1 - (recyclingBags/trashBags)) * (numTrashBags*sizeTrash/numPeople)); //the last three variables need inputs
}

function transitCalc(carHours, carPoolDur, poolSize){
  const cTransit = 0.43085;
  return (cTransit * ((carHours*carDur) + (carPoolHours*carPoolDur/poolSize))); //need a publicTransportHours variable
}

function foodCalc(porkCons, beefCons, poultryCons, dairyCons, produceCons){
  const cFood = 0.1328067;
  let foodM = (15013.3948*beefCons*0.02835) + (4806.95462*porkCons*0.02835) + (3905.65063*poultryCons*0.02835); //beef, poultry, pork
  let foodV = (1251.81*produceCons*0.02835); //vegetables, fruits
  let foodA = (3249*animalCons*0.02835); //other animal shit
  let food = foodM + foodV + foodA;
  let water = (7.94936*showerDur)+(22.175*dishDur)+(140.06*washingDur)+(13.6*toiletTrip);
  return (cFood * (food + water));
}

function energyCalc(powerBill, gasBill){
  const cEnergy = 3.225806;
  return (cFood * (powerBill + gasBill));
}
