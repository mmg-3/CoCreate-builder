export function createBlockMarker(border = "2px solid blue") {
  let marker = document.createElement("div");
  marker.id = "block-marker";
  marker.style.backgroundColor = "transparent";
  marker.style.position = "absolute";
  marker.style.display = "none";
  marker.style.border = border;
  marker.style.pointerEvents = 'none';
  return marker;
}

// return droppable-candidate element or false if no candidate found
export function getDropable(el) {
  do {
    if (el.getAttribute('droppable')) return el;
    el = el.parentElement;
    if (!el) return false;
  } while (true);
}


export function getCoc(el, att) {
  if (!el.tagName)
    el = el.parentElement;
  do {
    if (el.getAttribute(att) == "true") return el;
    el = el.parentElement;
    if (!el) return false;
  } while (true);
}




export function computeStyles(el, properties) {
  let computed = window.getComputedStyle(el);
  let result = {};
  properties.forEach((property) => {
    result[property] = parseInt(computed[property]);
  });
  return result;
}

export function randomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}



export function boxMarkerTooltip(callback, referenceWindow, options) {
  options = Object.assign({ borderSize: 2 }, options)

  let tagBox = document.createElement("div");
  tagBox.id = "tagBox";
  tagBox.style.backgroundColor = "blue";
  tagBox.style.color = "white";
  tagBox.style.position = "absolute";
  tagBox.style.zIndex = "99999";
  tagBox.style.padding = "2px 10px";
  tagBox.style.fontSize = "10px";
  tagBox.style.display = "none";
  tagBox.style.pointerEvents = 'none';


  document.body.append(tagBox);
  this.obj = tagBox;
  this.draw = function(el) {
    tagBox.style.display = "block";
    tagBox.innerHTML = callback(el);
    let { height, paddingTop, paddingBottom } = computeStyles(tagBox, [
      "height",
      "paddingTop",
      "paddingBottom",
    ]);
    let rect = el.getBoundingClientRect();
    tagBox.style.top =
      rect.top - options.borderSize + referenceWindow.scrollY - height - paddingTop - paddingBottom + "px";
    tagBox.style.left = rect.left - options.borderSize + window.scrollX + "px";
  };

  this.hide = function(el) {
    tagBox.style.display = "none";
  };
}



export function boxMarker(attributeName, priority, options) {

  options = Object.assign({}, options)
  this.lastEl = document.head;

  this.draw = function(el, callback, lastElCallback) {
    if (el === this.lastEl) return;
    el.setAttribute(attributeName, true);
    if (callback) callback(el)
    if (lastElCallback)
      lastElCallback(this.lastEl)

    this.lastEl.removeAttribute(attributeName);
    this.lastEl = el;

  };

  this.hide = function(callback) {
    this.lastEl.removeAttribute(attributeName);
    if (callback)
      callback(this.lastEl)
    this.lastEl = document.head;
  };
}



export function dropMarker(options) {

  options = Object.assign({ borderSize: 2, dropMarkerMargin: 5 }, options)
  let marker = document.createElement("div");
  marker.id = "marker";
  marker.style.backgroundColor = "green";
  marker.style.transition = "all 0.2s ease-in-out";
  marker.style.position = "absolute";
  marker.style.display = "none";
  marker.style.pointerEvents = 'none';


  this.lastOrigntaion = undefined;


  document.body.append(marker);
  this.obj = marker;
  this.draw = function(parent, el, orientation, isInside) {


    marker.style.display = "block";

    let rect = el.getBoundingClientRect();
    switch (orientation) {
      case 'top':
      case 'bottom':
        marker.style.width = rect.width + "px";
        marker.style.height = options.borderSize + "px";
        break;
      case 'left':
      case 'right':
        marker.style.width = options.borderSize + "px";
        marker.style.height = rect.height + "px";
        break;
      default:
        throw new Error('one type of orientation must be specified');
    }


    // switch (orientation) {
    //   case 'top':
    //   case 'bottom':
    //     if (!this.lastOrigntaion || this.lastOrigntaion == 'left' || this.lastOrigntaion == "right")
    //       marker.style.transition = 'none';
    //     else
    //       marker.style.transition = "all 0.2s ease-in-out";
    //     break;
    //   case 'left':
    //   case 'right':
    //     if (!this.lastOrigntaion || this.lastOrigntaion == 'top' || this.lastOrigntaion == "bottom")
    //       marker.style.transition = 'none';
    //     else
    //       marker.style.transition = "all 0.2s ease-in-out";
    //     break;
    //   default:
    //     throw new Error('one type of orientation must be specified');
    // }

    if (parent != el) {
      let prect = parent.getBoundingClientRect();
      let parentSize = prect[orientation]
      let childSize = rect[orientation]
      if (Math.abs(parentSize - childSize) < options.dropMarkerMargin * 2)
        isInside = true;
    }

    switch (orientation) {
      case 'top':
        marker.style.top = rect.top - options.borderSize / 2 + window.scrollY + (isInside ? options.dropMarkerMargin : -options.dropMarkerMargin) + "px";
        marker.style.left = rect.left - options.borderSize / 2 + window.scrollX + "px";
        break;
      case 'bottom':
        marker.style.top = rect.bottom - options.borderSize / 2 + window.scrollY + (isInside ? -options.dropMarkerMargin : options.dropMarkerMargin) + "px";
        marker.style.left = rect.left - options.borderSize / 2 + window.scrollX + "px";
        break;
      case 'left':
        marker.style.top = rect.top - options.borderSize / 2 + window.scrollY + "px";
        marker.style.left = rect.left - options.borderSize / 2 + window.scrollX + (isInside ? options.dropMarkerMargin : -options.dropMarkerMargin) + "px";
        break;
      case 'right':
        marker.style.top = rect.top - options.borderSize / 2 + window.scrollY + "px";
        marker.style.left = rect.right - options.borderSize / 2 + window.scrollX + (isInside ? -options.dropMarkerMargin : options.dropMarkerMargin) + "px";
        break;
      default:
        console.log(orientation)
        throw new Error('one type of orientation must be specified');
    }
    // marker.style.transition = "all 0.2s ease-in-out";
    this.lastOrigntaion = orientation;
  }

  this.hide = function(el) {
    marker.style.display = "none";
  };
}


export function parse(text) {
  let doc = new DOMParser().parseFromString(text, 'text/html');
  if (doc.head.children[0])
    return doc.head.children[0];
  else
    return doc.body.children[0];
}
