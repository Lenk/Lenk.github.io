window.onload = function() {
  var tile = document.getElementById('letter-container');

  tile.addEventListener('touchmove', function(e) {
    // grab the location of touch
    var touchLocation = e.targetTouches[0];
    
    // assign box new coordinates based on the touch.
    tile.style.left = touchLocation.pageX + 'px';
    tile.style.top = touchLocation.pageY + 'px';
  })
  
  /* record the position of the touch
  when released using touchend event.
  This will be the drop position. */
  
  tile.addEventListener('touchend', function(e) {
    // current box position.
    var x = parseInt(tile.style.left);
    var y = parseInt(tile.style.top);
  })
  
}

var threshold = "60%";
var dropZones = {};
var letters   = [];

$("[drop-zone]").each(function() {

  var zone = $(this);
  var name = zone.attr("drop-zone");

  dropZones[name] = {
    element : zone,
    name    : name,
    sorted  : zone.data("sorted"),
    clones  : zone.find(".clone-container"),
    letters : zone.find(".letter-container")
  };
});

$(".tile").each(function(index) {

  var element = $(this);
  var wrapper = element.parent();
  var offset  = element.position();
  var zone    = dropZones.main;

  var scope = {
    clone   : element.clone().attr("clone", "").prependTo(zone.clones),
    element : element,
    wrapper : wrapper,
    width   : wrapper.outerWidth(),
    height  : wrapper.outerHeight(),
    moved   : false,
    index   : index,
    zone    : zone,
    get x() { return getPosition(wrapper, this.zone.clones, offset).x; },
    get y() { return getPosition(wrapper, this.zone.clones, offset).y; },
    get cloneX() { return getPosition(this.clone, this.zone.clones).x; },
    get cloneY() { return getPosition(this.clone, this.zone.clones).y; },
    get previous() { return getPrevious(this, this.zone); }
  };

  scope.draggable = createDraggable(scope);

  // reversed order
  letters.unshift(scope);

  element.on("mousedown touchstart", scope, startDraggable);
});


// START DRAGGABLE :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function startDraggable(event) {

  var letter = event.data;

  // Maak element onzichtbaar
  // Maak kloon zichtbaar en verplaats deze naar de coordinaten van het element
  TweenLite.set(letter.element, { autoAlpha: 0 });
  TweenLite.set(letter.clone, { x: letter.x, y: letter.y, autoAlpha: 1 });

  letter.draggable.startDrag(event.originalEvent);
}

// GET PREVIOUS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function getPrevious(letter, zone) {

  if (!zone.sorted) {
    return { target: zone.letters, insert: "appendTo"};
  }

  var values = letters.filter(function(value) {
    return value.zone === letter.zone && value.index < letter.index;
  });

  return {
    target: values[0] ? values[0].wrapper : zone.letters,
    insert: values[0] ? "insertAfter" : "prependTo"
  };
}

// CREATE DRAGGABLE :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function createDraggable(letter) {

  var clone   = letter.clone;
  var wrapper = letter.wrapper;

  letter.draggable = new Draggable(clone, {
    onPress   : setActive,
    onDrag    : collapseSpace,
    onRelease : dropTile
  });

  return letter.draggable;
  ///////

  function setActive() {
    TweenLite.to(clone, 0.15, { scale: 1.2, autoAlpha: 0.75 });
  }

  function collapseSpace() {
    if (!letter.moved) {
      if (!this.hitTest(wrapper)) {
        letter.moved = true;
        TweenLite.to(wrapper, 0.3, { width: 0, height: 0 });
      }
    }
  }

  function dropTile() {

    var name = undefined;
    var self = this;

    $.each(dropZones, function(key, zone) {

      if (self.hitTest(zone.element, threshold) && letter.zone !== zone) {

        name = "tile " + zone.name;
        letter.zone = zone;

        // Get the previous element and the insert method
        var previous = letter.previous;
        wrapper[previous.insert](previous.target);

        // Position the clone inside its new container
        TweenLite.set(clone, { x: letter.cloneX, y: letter.cloneY });
        zone.clones.prepend(clone);
      }
    });

    moveBack(letter, name);
  }
}

// MOVE BACK ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function moveBack(letter, className) {

  var clone   = letter.clone;
  var element = letter.element;
  var wrapper = letter.wrapper;

  TweenLite.to(wrapper, 0.2, { width: letter.width, height: letter.height });
  TweenLite.to(clone, 0.3, { scale: 1, autoAlpha: 1, x: letter.x, y: letter.y, onComplete: done, delay: 0.02 });
  
  if (className) TweenLite.to([element, clone], 0.3, { className: className });

  function done() {
    letter.moved = false;
    TweenLite.set(clone, { autoAlpha: 0 });
    TweenLite.set(element, { autoAlpha: 1 });
  }
}

// GET POSITION :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function getPosition(target1, target2, offset) {

  var position1 = target1.offset();
  var position2 = target2.offset();

  offset = offset || { left: 0, top: 0 };

  return {
    x: position1.left - position2.left + offset.left,
    y: position1.top  - position2.top  + offset.top
  };
}
