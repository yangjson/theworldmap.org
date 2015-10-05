/* Global variables */
var currentAddress = "Paris, France";
var marker;
var map;
var infoWnd = new google.maps.InfoWindow();
var poiList = [];
var detailZoom = 15;

$(document).ready(
		function() {
			/* google maps -----------------------------------------------------*/
			google.maps.event.addDomListener(window, 'load', initialize);

			function initialize() {
				// Hien thi cac ket qua tren ban do
				poiList = [];
								
				$('.item_content').each(function( index, element ) {
					var item = {
						"id": 	element.getAttribute("data-id"),
						"lat": 	element.getAttribute("data-lat"),
						"lng": element.getAttribute("data-lng"),
						"title": element.getAttribute("data-title")
					};
					poiList.push(item);
					
				});
				
				/* position Paris */
				var latlng = new google.maps.LatLng(48.856614, 2.3522219000000177);

				var mapOptions = {
					center : latlng,
					scrollWheel : false,
					zoom : 13,
					streetViewControl: true,
					zoomControlOptions: {
			            style: google.maps.ZoomControlStyle.SMALL,
			            position: google.maps.ControlPosition.RIGHT_TOP
			        },
			        panControl: false,
			        mapTypeControl: false,
			        scaleControl: false,
			        mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				//Creates a marker object
				marker = new google.maps.Marker({
					position : latlng,
					url : '/',
					animation : google.maps.Animation.DROP
				});

			    //Creates a map object.
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				marker.setMap(map);

				// STYLE
				$.getScript( '/js/mapstyle.js', function() {
					map.setOptions({
						styles : styles
					});
				});
				
				//Mapping markers on the map
				  var bounds = new google.maps.LatLngBounds();
				  var station, i, latlng;
				  var idx = 0;
				  for (i in poiList) {
				    //Creates a marker
				    station = poiList[i];
				    latlng = new google.maps.LatLng(station.lat, station.lng);
				    bounds.extend(latlng);
				    var m = createMarker(map, latlng, station.title, idx);
				    
				    //Creates a sidebar button for the marker
				    createMarkerButton(m, idx);
				    idx = idx + 1;
				  }
				  //Fits the map bounds
				  if (poiList.length >= 1) {
					    // Don't zoom in too far on only one marker
					    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
					       var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
					       var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
					       bounds.extend(extendPoint1);
					       bounds.extend(extendPoint2);
					    }
					  map.fitBounds(bounds); 
					  marker.setVisible(false);
					
					  if (window.location.href.indexOf('#item') < 0) { 
						  //$('#0').trigger('hover');
					  } else {
						  //$('#0').trigger('click');
					  }
					  
				  } else {
					  // TODO: Extend the keywords to have results.
				  }			 
				  
				  
			}
			;
			/* end google maps -----------------------------------------------------*/
			
			/* map controller */
			$('.my_location').on( "click", function() {				
				if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
				    showLocationLatLng(pos.coords.latitude, pos.coords.longitude);
				    
				 // TODO: Dung de lay dia diem nguoi dung luon
				    
				}, function(error) {							

					$.get("http://ipinfo.io", function(response) {
					    //$("#ip").html(response.ip);
					    //$("#address").html(response.city + ", " + response.region);									
						showLocationLatLng(response.loc.split(',')[0], response.loc.split(',')[1]);
						
						var alert = $('#myLocationAlert');
						$('#myLocationAlertcity').html(response.city);
						$('#myLocationAlertregion').html(response.region);
						$('#myLocationAlertcountry').html(response.country);
						//alert.modal('show');
						
					}, "jsonp");
					
					
				});			
			});					
			/* end map controller */
			/* map service */
			
			function createMarkerButton(m, idx) {
				var item = document.getElementById(idx);
				  //Trigger a click event to marker when the button is clicked.
				  google.maps.event.addDomListener(item, "click", function(){ //mouseover
					    infoWnd.setContent(
					    		'<strong>' + $(item).data('title') + '</title>' + 
					    		'<br>'+
					    		'<img class="photo_item" src="/img/test.jpg" alt="Item test">');
					    infoWnd.open(map, m);					 
					  if (map.getZoom() < detailZoom) {
						  map.setZoom(detailZoom);
					  }
					  var latlng = new google.maps.LatLng(poiList[idx].lat, poiList[idx].lng);
					  map.setCenter(latlng);	
				  });
				  
				  google.maps.event.addDomListener(item, "mouseover", function(){ //
					    infoWnd.setContent(
					    		'<strong>' + $(item).data('title') + '</title>' + 
					    		'<br>'+
					    		'<img class="photo_item" src="/img/test.jpg" alt="Item test">');
					    infoWnd.open(map, m);	
				  });
			}
			
			function createMarker(map, latlng, title, idx) {
				  //Creates a marker
				  var m = new google.maps.Marker({
				    position : latlng,
				    map : map,
				    title : title,
				    icon: "/img/flags/vietnammarker.png",
				  });
				  
				  //The infoWindow is opened when the sidebar button is clicked
				  google.maps.event.addListener(m, 'click', function(){
					  google.maps.event.trigger(m, "mouseover");	
					  if (map.getZoom() < detailZoom) {
						  map.setZoom(detailZoom);
					  }
					  map.setCenter(m.position);
				  });
				  
				  google.maps.event.addListener(m, 'mouseover', function(){
				    infoWnd.setContent(
				    		'<strong>' + title + '</title>' + 
				    		'<br>'+
				    		'<img class="photo_item" src="/img/test.jpg" alt="Item test">');
				    infoWnd.open(map, m);
				    	
				    
				    var item = document.getElementById(idx);
		            if (!$(item).hasClass("item_active")) {
		                var lastActive = $(item).closest("#results").children(".item_active");
		                lastActive.removeClass("item_active");
		                $(item).addClass("item_active");		                
		            }
		            window.location.href ="#item" + idx;
		            
				  });
				  return m;
			}
			
			
			function showLocationLatLng(lat, lng) {
			    var me = new google.maps.LatLng(lat, lng);
			    showLocation(me);				
			}
			
			function showLocation(location) {
			    //marker.setAnimation(google.maps.Animation.BOUNCE);
			    marker.setPosition(location);
			    map.setCenter(location);			
			    marker.setVisible(true);
			}
			
			function SetMapAddress(address) {  // "London, UK" for example 
				   var geocoder = new google.maps.Geocoder();
				   if (geocoder) {
				      geocoder.geocode({ 'address': address }, function (results, status) {
				        if (status == google.maps.GeocoderStatus.OK) {
				          map.fitBounds(results[0].geometry.viewport);				          
				        }
				      });
				   }
				 }
			/* end map service */		
		});

