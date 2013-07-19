CustomInfoWindow
================

A custom InfoWindow for Google Maps


CustomInfoWindow is a custom InfoWindow for Google Maps. Instead of using the native (styled) InfoWindows of
Google Maps, this allows you to use any element in the DOM-tree as an InfoWindow.

Even though it is recommended that the file with this class is not loaded till after the google maps API is loaded,
it will wait running itself till after all needed Google Maps API-classes are available.

Usage of this class is simple:

After loading the Google Maps API and CustomInfoWindow.js, create CustomInfoWindows by calling
'new CustomInfoWindow(elem, options)'. 'elem' is the DOM-element to use as a marker, options is a javascript-object
containing several options.
Currently the following options are available:
- location: A google.maps.LatLng instance with the location to place the CustomInfoWindow
- padding: the number of pixels a CustomInfoWindow should be away from the border of the map when instantiating
- offset: a javascript-object containing the properties 'x' and 'y', which allow you to offset the element from the
  location on the map. When this is 0,0 (the default), the topleft corner of the element will be positioned on the
  point of the location.
- elementEdge: a javascript-object containing the properties 'x' and 'y', which allow you to align different axis of the
  element to the location. Valid values for x are 'left' and 'right, valid values for y are 'top' and 'bottom'. Defaults
  to 'left' and 'top'.

On a CustomInfoWindow-object, the following methods are available:
- setMap(google.maps.Map): show the CustomInfoWindow on the given Map
- setMap(null): remove the CustomInfoWindow from the Map it's currently shown on
- setElement(elem): use 'elem' as the CustomInfoWindow
- setLocation(google.maps.LatLng): move the CustomInfoWindow to the given location
