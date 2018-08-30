var font = null;
var fontSize = 150;
var textToRender = "adp";
var drawPoints = true;
var drawMetrics = false;
var kerning = true;
var ligatures = true;
var hinting = false;
var previewPath = null;
var snapPath = null;
var snapStrength = 0;
var snapDistance = 1;
var snapX = 0;
var snapY = 0;
var img;

function preload() {
  img = loadImage('assets/comp-06.jpg');
  console.log("loaded");
}

function drawPointsChanged(e) {
    drawPoints = e.checked;
}

function drawMetricsChanged(e) {
    drawMetrics = e.checked;
}

function kerningChanged(e) {
    kerning = e.checked;
}

function ligaturesChanged(e) {
    ligatures = e.checked;
}

function fontSizeChanged() {
    fontSize = parseInt(fontSizeSlider.value, 10);
    document.getElementById('fontSize').innerHTML = '' + fontSize;
}

function snapStrengthChanged(e) {
    snapStrength = e.value;
    document.getElementById('snapStrength').innerHTML = '' + snapStrength;
}

function snapDistanceChanged(e) {
    snapDistance = e.value;
    document.getElementById('snapDistance').innerHTML = '' + snapDistance;
}

function snapXChanged(e) {
    snapX = e.value * 1.0;
    document.getElementById('snapX').innerHTML = '' + snapX;
}

function snapYChanged(e) {
    snapY = e.value * 1.0;
    document.getElementById('snapY').innerHTML = '' + snapY;
}

// Round a value to the nearest "step".
function snap(v, distance, strength) {
    return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
}

function doSnap(path) {
    var i;
    var strength = snapStrength / 100.0;
    for (i = 0; i < path.commands.length; i++) {
        var cmd = path.commands[i];
        if (cmd.type !== 'Z') {
            cmd.x = snap(cmd.x + snapX, snapDistance, strength) - snapX;
            cmd.y = snap(cmd.y + snapY, snapDistance, strength) - snapY;
        }
        if (cmd.type === 'Q' || cmd.type === 'C') {
            cmd.x1 = snap(cmd.x1 + snapX, snapDistance, strength) - snapX;
            cmd.y1 = snap(cmd.y1 + snapY, snapDistance, strength) - snapY;
        }
        if (cmd.type === 'C') {
            cmd.x2 = snap(cmd.x2 + snapX, snapDistance, strength) - snapX;
            cmd.y2 = snap(cmd.y2 + snapY, snapDistance, strength) - snapY;
        }
    }
}

opentype.load('fonts/TaubSans-Regular2018253.otf', function(err, font) {
    if (err) {
        alert('Could not load font: ' + err);
    } else {
				onFontLoaded(font);
    }
});

function onFontLoaded(font) {
    var glyphsDiv, i, x, y, fontSize;
    window.font = font;

    amount = Math.min(100, font.glyphs.length);
    x = 50;
    y = 120;
    fontSize = 200;
}
var canvas;

function setup() {
  canvas = createCanvas(612,792);
}

function draw() {
  background(247,232,219);
  image(img, 0, 0);
  if (!font) return;
  var options = {
      kerning: kerning,
      hinting: hinting,
      features: {
          liga: ligatures,
          rlig: ligatures
      }
  };
  snapPath = font.getPath(textToRender, 75, 170, 120, options);
  snapPath.fill = "#D2271D";
  doSnap(snapPath);

  snapPath2 = font.getPath("unlock the world's", 50, 650, 50, options);
  snapPath2.fill = "#D2271D";
  doSnap(snapPath2);

  snapPath3 = font.getPath("potential through work", 50, 700, 50, options);
  snapPath3.fill = "#D2271D";
  doSnap(snapPath3);

  let snapCtx = document.getElementById('defaultCanvas0').getContext('2d');
  snapPath.draw(snapCtx);
  snapPath2.draw(snapCtx);
  snapPath3.draw(snapCtx);

}
