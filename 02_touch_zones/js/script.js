
let client;
window.player = null;

function initClient() {
  client = new Tuio.Client({
    host: "ws://localhost:8080"
  });

  client.on("connect", onConnect);

  client.on("updateTuioCursor", onUpdateTuioCursor);
  client.on("addTuioCursor", onAddTuioCursor);
  client.on("removeTuioCursor", onRemoveTuioCursor);

  client.connect();
}

function onConnect() {
  console.log("client connected");
}

function onAddTuioCursor(cursor) {
    console.log('adding ', cursor.cursorId);
}

function onRemoveTuioCursor(cursor) {
    console.log('removing ', cursor.cursorId);
}

function onUpdateTuioCursor(cursor) {
    let id = cursor.cursorId;
    
    let x = screenX(cursor.xPos);
    let y = screenY(cursor.yPos);
    
    setValue('touch' + id, 'x', x);
    setValue('touch' + id, 'y', y);
    
    setValue('multitouch1', 'id', id);
    setValue('multitouch1', 'x', x);
    setValue('multitouch1', 'y', y); 
    
}


function initNodebox() {

  const options = {
    userId: 'bitcraftlab',
    projectId: 'touchdemo02',
    canvasId: 'canvas',
    autoplay: true
  };

  ndbx.embed(options, ndbxReady);

}

function windowOnLoad(event) {

  const canvas = document.getElementById('canvas');
  const canvasWidth =  window.innerWidth;
  const canvasHeight = window.innerHeight;
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  initClient();
  initNodebox();

}

function updateTouch() {
    requestAnimationFrame(updateTouch);
    //refresh();
}

// set some values on start up
function ndbxReady (err, _player) {
  console.log('ready');
  player = _player;
  updateTouch();

}

// Interacting with Nodebox live
function setValue(node, port, value) {
  checkNode(node, function() {
    player.setValue(node, port, value);
  });
}

// make sure the node exists inside nodebox ...
function checkNode(name, fn) {

  if(ndbx.findNode(player.fn, name)) {
    fn();
  } else {
    console.log('Nodebox Function', player.fn.name , 'has no node named ', name);
  }
}

// from browser coordinates to Nodebox coordinates
function screenX(x) {
  return x * screen.width - screen.width /2;
}

function screenY(y) {
  return y * screen.height - screen.height /2;;
}

window.addEventListener('load', windowOnLoad);
window.addEventListener('resize', windowOnLoad);
