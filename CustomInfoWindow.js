(function(d, w, u) {
	var run = function() {
		var c = w.CustomInfoWindow = function(elem, options) {
			var defaultOptions = {
				location: new google.maps.LatLng(52.374004, 4.890359),
				offset: {
					x: 0,
					y: 0
				},
				padding: 40,
				elementEdge: {
					x: 'left',
					y: 'top'
				}
			}
			this.shown = false;
			this.firstDraw = true;
			this.setElement(elem);
			this.options = options || {};
			for (var o in defaultOptions) {
				if (!this.options.hasOwnProperty(o)) this.options[o] = defaultOptions[o];
			}
			if (this.options.elementEdge.x != 'left' && this.options.elementEdge.x != 'right') this.options.elementEdge.x = 'left';
			if (this.options.elementEdge.y != 'top' && this.options.elementEdge.y != 'bottom') this.options.elementEdge.y = 'top';
			if (this.options.location && this.options.location.constructor == google.maps.LatLng) this.setLocation(this.options.location);
			if (this.options.map) this.setMap(this.options.map);
		};
		c.prototype = new google.maps.OverlayView();
		c.prototype.onAdd = function() {
			var d = this.getMap().getDiv();
			d.parentNode.insertBefore(this.elem, d);
			var that = this;
			this.devh = google.maps.event.addListener(this.getMap(), 'drag', function() {that.draw()});
			this.ievh = google.maps.event.addListener(this.getMap(), 'idle', function() {that.draw()});
			this.elem.style.display = 'block';
			this.shown = true;
			this.firstDraw = true;
			if (this.options.elementEdge.x == 'right') this.options.offset.x -= this.elem.clientWidth;
			if (this.options.elementEdge.y == 'bottom') this.options.offset.y -= this.elem.clientHeight;
		};
		c.prototype.draw = function() {
			var p = this.getProjection().fromLatLngToContainerPixel(this.location);
			var x = p.x + this.options.offset.x, y = p.y + this.options.offset.y;
			var d = this.getMap().getDiv();
			var mx = d.clientWidth - (x + this.elem.clientWidth), my = d.clientHeight - (y + this.elem.clientHeight);
			if (this.firstDraw) {
				if (x < 0) {
					if (y < 0) this.getMap().panBy(x - this.options.padding, y -this.options.padding);
					else this.getMap().panBy(x - this.options.padding, 0);
				} else if (y < 0) {
					this.getMap().panBy(0, y - this.options.padding);
				}
				if (mx < 0) {
					if (my < 0)  this.getMap().panBy(-mx + this.options.padding, -my + this.options.padding);
					else this.getMap().panBy(-mx + this.options.padding, 0);
				} else if (my < 0) {
					this.getMap().panBy(0, -my + this.options.padding);
				}
			}
			this.elem.style.left = x+"px";
			this.elem.style.top = y+"px";
			this.firstDraw = false;
		};
		c.prototype.onRemove = function() {
			this.elem.style.display = 'none';
			this.shown = false;
			google.maps.event.removeListener(this.devh);
			google.maps.event.removeListener(this.ievh);
		};
		c.prototype.setElement = function(elem) {
			if (typeof elem == 'string') elem = d.getElementById(elem);
			this.elem = elem;
			this.elem.style.display = 'none';
			this.elem.style.position = 'absolute';
		};
		c.prototype.setLocation = function(location) {
			if (location.constructor != google.maps.LatLng) {
				alert('Please provide a google.maps.LatLng to set the location.');
			}
			this.location = location;
			if (this.shown) this.draw();
		};
	};
	var loader = function() {
		if (w.google && w.google.maps && w.google.maps.OverlayView) {
			run();
		} else {
			w.setTimeout(loader, 50);
		}
	};
	loader();
})(document, window);
