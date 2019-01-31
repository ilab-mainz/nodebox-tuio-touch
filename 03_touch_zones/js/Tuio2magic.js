
// -----------------------------------------------------------------
// TUIO 2 Magic

window.client = null;

cursors = {
    start: {},
    move: {},
    end: {}
};

function initClient() {
    console.log("init client ...");
    client = new Tuio.Client({
        host: "ws://localhost:8080"
    });

    client.on("connect", onConnect);
    client.on("updateTuioCursor", onUpdateTuioCursor);
    client.on("addTuioCursor", onAddTuioCursor);
    client.on("removeTuioCursor", onRemoveTuioCursor);
    client.on("refresh", onRefresh);
    client.connect();

}

function onConnect() {
    console.log("connected ...");
}


function onRefresh() {
    
    var target = document.getElementById( 'canvas' );
    
    dispatchTouchEvent(target, 'touchstart', window.cursors.start);
    dispatchTouchEvent(target, 'touchmove', window.cursors.move);
    dispatchTouchEvent(target, 'touchend', window.cursors.end);
    
    window.cursors.end = [];
}

function dispatchTouchEvent(target, eventname, cursors) {
    // object to list
    var touches = Object.values(cursors);
    if(touches && touches.length > 0) {
        var e = new Event(eventname);
        e.touches = touches;
        target.dispatchEvent(e);
    }
}

function onUpdateTuioCursor(cursor) {
    var x = cursor.xPos * canvas.width;
    var y = cursor.yPos * canvas.height;
    var id = cursor.cursorId;
    // move from start to update list
    delete cursors.start[id];
    cursors.move[id] = {pageX: x, pageY: y, identifier: id};
}

function onAddTuioCursor(cursor) {
    var x = cursor.xPos * canvas.width;
    var y = cursor.yPos * canvas.height;
    var id = cursor.cursorId;
    // add to start list
    cursors.start[id] = {pageX: x, pageY: y, identifier: id};
}

function onRemoveTuioCursor(cursor) {
    var id = cursor.cursorId;
    // move from update to end list
    delete cursors.move[id];
    cursors.end[id] = {identifier: id};
}

