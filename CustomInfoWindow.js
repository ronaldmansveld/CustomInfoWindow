(function(d, w, u) {
	var run = function() {
		/**
		 * The constructor for the CustomInfoWindow class
		 * @param  {string|DomNode}   elem      The element to use as an InfoWindow
		 * @param  {object}           options   The object with all the options to use
		 * @return {CustomInfoWindow}           The Custom InfoWindow
		 */
		var c = w.CustomInfoWindow = function(elem, options) {
			var defaultOptions = {
				location: new google.maps.LatLng(52.374004, 4.890359), //The location to place the CustomInfoWindow
				offset: {
					x: 0, //Horizontal offset for the CustomInfoWindow
					y: 0  //Vertical offset for the CustomInfoWindow
				},
				padding: 40, //Minimal distance between the border of the map and the border of the CustomInfoWindow
				elementEdge: {
					x: 'left', //Vertical edge of the CustomInfoWindow to align with the location
					y: 'top'   //Horizontal edge of the CustomInfoWindow to align with the location
				}
			}
			this.shown = false; //Keep track whether the CustomInfoWindow is being shown (so we can call the draw-method if needed)
			this.firstDraw = true; //Keep track if drawing the CustomInfoWindow for the first time, since we need to do extra calculations on the first draw
			this.setElement(elem);
			this.options = options || {};
			for (var o in defaultOptions) {
				if (!this.options.hasOwnProperty(o)) this.options[o] = defaultOptions[o];
			}
			//Normalize some of the options
			if (this.options.elementEdge.x != 'left' && this.options.elementEdge.x != 'right') this.options.elementEdge.x = 'left';
			if (this.options.elementEdge.y != 'top' && this.options.elementEdge.y != 'bottom') this.options.elementEdge.y = 'top';
			//Set the location and the map if provided
			if (this.options.location && this.options.location.constructor == google.maps.LatLng) this.setLocation(this.options.location);
			if (this.options.map && this.options.map.constructor == google.maps.Map) this.setMap(this.options.map);
		};
		c.prototype = new google.maps.OverlayView(); //extend google.maps.OverlayView
		/**
		 * Called when the CustomInfoWindow is added to the map
		 * @return {void} 
		 */
		c.prototype.onAdd = function() {
			var d = this.getMap().getDiv();
			d.parentNode.insertBefore(this.elem, d); //Move the element to the parent of the map so we can position it rightly
			var that = this;
			//add eventlisteners so we can keep the CustomInfoWindow in the correct location
			this.devh = google.maps.event.addListener(this.getMap(), 'drag', function() {that.draw()});
			this.ievh = google.maps.event.addListener(this.getMap(), 'idle', function() {that.draw()});
			this.elem.style.display = 'block';
			this.shown = true; //CustomInfoWindow is shown now
			this.firstDraw = true; //We'll be drawing for the first time soon

			//If using a different edge then top/left, adjust the offsets accordingly
			//This is done here because now the element is shown, so we can safely measure it
			if (this.options.elementEdge.x == 'right') this.options.offset.x -= this.elem.clientWidth;
			if (this.options.elementEdge.y == 'bottom') this.options.offset.y -= this.elem.clientHeight;
		};
		c.prototype.draw = function() {
			var p = this.getProjection().fromLatLngToContainerPixel(this.location); //Determine the left/top in px for the chosen location
			var x = p.x + this.options.offset.x, y = p.y + this.options.offset.y; //determine the top and left, taking offset into account
			//now position the element
			this.elem.style.left = x+"px";
			this.elem.style.top = y+"px";

			//if this is the first drawing (right after adding), make sure we show the CustomInfoWindow within the given padding around the map-border
			if (this.firstDraw) {
				if (x < 0) {
					if (y < 0) this.getMap().panBy(x - this.options.padding, y -this.options.padding);
					else this.getMap().panBy(x - this.options.padding, 0);
				} else if (y < 0) {
					this.getMap().panBy(0, y - this.options.padding);
				}
				//also determine this for the bottom and right edges of the map
				var d = this.getMap().getDiv();
				var mx = d.clientWidth - (x + this.elem.clientWidth), my = d.clientHeight - (y + this.elem.clientHeight);
				if (mx < 0) {
					if (my < 0)  this.getMap().panBy(-mx + this.options.padding, -my + this.options.padding);
					else this.getMap().panBy(-mx + this.options.padding, 0);
				} else if (my < 0) {
					this.getMap().panBy(0, -my + this.options.padding);
				}
			}
			this.firstDraw = false;
		};
		/**
		 * Called when removing the CustomInfoWindow from the map (by calling setMap(null))
		 * @return {void}
		 */
		c.prototype.onRemove = function() {
			this.elem.style.display = 'none'; //hide the element
			this.shown = false;
			//remove the eventlisteners for performance
			google.maps.event.removeListener(this.devh);
			google.maps.event.removeListener(this.ievh);
		};
		/**
		 * Sets the element to use as a CustomInfoWindow
		 * @param  {string|DomNode} elem The element to use
		 * @return {void}
		 */
		c.prototype.setElement = function(elem) {
			//normalize the element
			if (typeof elem == 'string') elem = d.getElementById(elem);
			this.elem = elem;
			//make sure the element is hidden
			this.elem.style.display = 'none';
			this.elem.style.position = 'absolute';
		};
		/**
		 * Set the location to show the CustomInfoWindow
		 * @param  {google.maps.LatLng} location The location
		 * @return {void}
		 */
		c.prototype.setLocation = function(location) {
			if (location.constructor != google.maps.LatLng) {
				alert('Please provide a google.maps.LatLng to set the location.');
			}
			this.location = location;
			if (this.shown) this.draw(); //update the map if the CustomInfoWindow is currently shown
		};
	};
	var loader = function() {
		if (w.google && w.google.maps && w.google.maps.OverlayView) {
			run(); //don't load the class-definition till google.maps.OverlayView is available, since we need that class for our prototype
		} else {
			w.setTimeout(loader, 50); //try again in 50ms to see if google.maps.OverlayView is available
		}
	};
	loader();
})(document, window);
