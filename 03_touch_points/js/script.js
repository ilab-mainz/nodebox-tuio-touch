

window.player = null;

// -----------------------------------------------------------------
// Multitouch Browser Events

function onTouchstart(evt) {
    // console.log('START', evt);
}

function onTouchend(evt) {
    // console.log('END', evt);
}

function onTouchmove(evt) {
    touchlist = evt.touches;
    
    // Send raw touchdata to Nodebox
    setValue('touchData1', touchlist);
    
    // Also send points without labels
    var pointlist = touchlist.map( touch => { return {x: touch.pageX, y: touch.pageYu} });
    setValue('touchPoints', pointlist);
 
}

// -----------------------------------------------------------------

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

  // touch events
  canvas.addEventListener('touchstart', onTouchstart);
  canvas.addEventListener('touchend', onTouchend);
  canvas.addEventListener('touchmove', onTouchmove);

  // init TUIO client!
  initClient();
  initNodebox();

}

function updateTouch() {
    requestAnimationFrame(updateTouch);
    //onRefresh();
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
