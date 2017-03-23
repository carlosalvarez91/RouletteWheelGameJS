/* // ANGULAR
var app = angular.module('roulette', []);
app.controller('selectCtrl', function($scope) {
  
$scope.players = [
 { "value": 2, "text": "2 Players"},
 { "value": 3, "text": "3 Players"},
 {"value": 4, "text": "4 Players"},
 {"value": 5, "text": "5 Players"}
];
});
*/



var optionsSelection =
/*[
    {'2 Players' : ['Player 1', 'Player 2']},
    {'3 Players' : ['Player1', 'Player 2', 'Player 3']}
];
*/
[
  {
    "text"  : "2 players",
    "value" : 2,
    "players": [1, 2]
  },

  {
    "text"     : "3 Players",
    "value"    : 3,
    "players": [1, 2,3]
  },

    {
    "text"  : "4 players",
    "value" : 4,
    "players": [1, 2, 3, 4]
  },
      {
    "text"  : "5 players",
    "value" : 5,
    "players": [1, 2, 3, 4, 5]
  }
];
var selectBox = document.getElementById('playersList');
for(var i = 0, l = optionsSelection.length; i < l; i++){
  var option = optionsSelection[i];
  selectBox.options.add( new Option(option.text, option.value, option.players) );
}



//Test Alert
function changeFunc() {
var selectBox = document.getElementById("playersList");
var selectedValue = selectBox.options[selectBox.selectedIndex].value;
//alert(selectedValue);
// When I add everything below inside this function,
//it works, the wheel is divided,
// but it doesnt spin properly




var options = document.getElementById("playersList").value;
//var options = [1,2,3,4];
var startAngle = 0;
var arc = Math.PI / (options / 2); //!!!!!
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}


function drawRouletteWheel() {

  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);



      ////////// TEXT ON EACH ARC segment 


      //var text = options; // SAME TEXT IN ALL ARCS



      //var opciones = [1,2,3,4,5];  //SHOWS UP DIFERENT TEXT  BUT DOESNT MATCH WITH THE OBJECT optionsSelection
      //var text = opciones [i]


      // DOESNT GET AN ARRAY FROM THE OBJECT optionsSelection
      var opciones = Object.keys(optionsSelection).map(function (players) { return optionsSelection[players]; });
      var text = opciones[i];

      //
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 



    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 3 * 3000;
  rotateWheel();
}

function rotateWheel() {
        spinTime += 30;
        if(spinTime >= spinTimeTotal) {
          stopRotateWheel();
          return;
      }
        var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += (spinAngle * Math.PI / 180);
        drawRouletteWheel();
        spinTimeout = setTimeout('rotateWheel()', 30);
}


// I THINK THIS IS THE FUNCTION THAT STARTS WHEN THE WHEEL STOPS,
//TO SHOW UP THE TEXT.
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = "Drink Player : " + options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

// I DONO FOR WHAT THIS FUNCTION IS.
function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();

}