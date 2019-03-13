//JSON DATA
// var geoJSON = [
//       [1,'Love.Fish',"SM City Cebu",10.311715,123.918332,'restaurant',null],
//       [2,'Hunter Gatherer',"THE GREEN STRIP, S.E. JAYME ST., PAKNAAN, MANDAUE  ",10.343827,123.950406,'warehouse',2000],
//       [3,'The Potting Shed',"7893 LAWAAN STREET, SAN ANTONIO VILLAGE, MAKATI CITY",14.565660,121.010790,'warehouse',1676],
//       [4,'Nomad',"Waterfront Cebu City Hotel & Casino",10.326118,123.905417,'hotel',900]
//     ];


var infowindow; //one global instance to reuse and close the previous infoWindow in marker.
var geocode;

var mifMaps = {
    pageDetails: function(){
                $(".content-header h1").text("Machine in Field");
                $(".content-header h1").append("<small>Customer Maps</small>");
            return this;
  },
  getCoord: function(){
    var json_coord;
       $.ajax({
          type: 'GET',
          url : assets+'php/company/getCompanyCoord.php',
          dataType: 'json',
          async: false,
          success: function(data){
                 json_coord =data;                        
          }, 
          error: function(data,xhr,status){ alert('Something went wrong!') }
       });
       return json_coord;
  },
  initMap: function (){  //Set-up map canvas.
    var pos = new google.maps.LatLng(11.326683, 122.957248); //Dummy initial position of map.
    var mapOptions = {
        zoom: 6,
        center: pos,
        gestureHandling: 'greedy',
        styles: [
               {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                  {
                      "hue": "#7fc8ed"
                  },
                  {
                      "saturation": 55
                  },
                  {
                      "lightness": -6
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "labels",
              "stylers": [
                  {
                      "hue": "#7fc8ed"
                  },
                  {
                      "saturation": 55
                  },
                  {
                      "lightness": -6
                  },
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                  {
                      "hue": "#83cead"
                  },
                  {
                      "saturation": 1
                  },
                  {
                      "lightness": -15
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [
                  {
                      "hue": "#f3f4f4"
                  },
                  {
                      "saturation": -84
                  },
                  {
                      "lightness": 59
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "labels",
              "stylers": [
                  {
                      "hue": "#ffffff"
                  },
                  {
                      "saturation": -100
                  },
                  {
                      "lightness": 100
                  },
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                  {
                      "hue": "#ffffff"
                  },
                  {
                      "saturation": -100
                  },
                  {
                      "lightness": 100
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                  {
                      "hue": "#bbbbbb"
                  },
                  {
                      "saturation": -100
                  },
                  {
                      "lightness": 26
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                  {
                      "hue": "#ffcc00"
                  },
                  {
                      "saturation": 100
                  },
                  {
                      "lightness": -35
                  },
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                  {
                      "hue": "#ffcc00"
                  },
                  {
                      "saturation": 100
                  },
                  {
                      "lightness": -22
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.school",
              "elementType": "all",
              "stylers": [
                  {
                      "hue": "#d7e4e4"
                  },
                  {
                      "saturation": -60
                  },
                  {
                      "lightness": 23
                  },
                  {
                      "visibility": "on"
                  }
              ]
          }
        ]
      };

    var geoJSON = self.mifMaps.getCoord();

    //loop through json data to place multiple marker.
    var mapCanvas = new google.maps.Map(document.getElementById("map"), mapOptions);
        for (var i = 0; i < geoJSON.length; i++) {
             var coords = new google.maps.LatLng(geoJSON[i].latitude, geoJSON[i].longitude);
             self.mifMaps.addMarker({ "contentString": geoJSON[i].company_name +"</br> No. of MIF: "+ geoJSON[i].num_of_machines , "pos": coords, "map": mapCanvas});        
        }
      return this;
  },
  addMarker: function (obj){

      if(typeof obj === 'object' && obj != null && !Array.isArray(obj)){
          var markerOption = {
              position: obj.pos,
              map: obj.map,      
              label: (obj.lblMarker != null ? obj.lblMarker.toString() : '')
            };
          var marker = new google.maps.Marker(markerOption);
               self.mifMaps.infoLocation(obj.contentString, marker, obj.map);
      }
      else{
        throw new Error("Paramater object is missing.");
      }
      return this;
  },
  infoLocation: function (contentString, markerInst, map){ //Display info, when user click the marker.
      infowindow = new google.maps.InfoWindow;

      google.maps.event.addListener(markerInst,'click',function(){
          infowindow.close(); //Close previous infoWindow.
          infowindow.setContent(contentString);
          infowindow.open(map, this);
      });
      return this;
  }

}

