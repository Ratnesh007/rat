      require([
        "esri/Map",
        "esri/layers/WMSLayer",
        "esri/views/MapView", "esri/widgets/LayerList", "esri/widgets/Search","esri/layers/GroupLayer", "esri/widgets/Legend","esri/widgets/BasemapGallery", "esri/widgets/Print"
      ], function(Map, WMSLayer, MapView, LayerList, Search, GroupLayer, Legend, BasemapGallery, Print) {
// Baselayer from geoserver starts
		var layer1 = new WMSLayer({
		  title: "Baselayer",
          url: "http://localhost:8181/geoserver/rgroup/wms?",
          featureInfoFormat: "text/html",
          featureInfoUrl: "http://localhost:8181/geoserver/rgroup/wms?",
          sublayers: [
            {
              title: ["Road"],
			  name: ["Road"],
			  legendUrl: "http://localhost:8181/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=rgroup:Road",
              popupEnabled: true,
              queryable: true,
			  visible: true
            },
			{
              title: ["Rail"],
			  name: [ "Rail"],
              popupEnabled: true,
              queryable: true,
			  visible: false
            }
			
          ]
        });
// Baselayer from geoserver starts ends
		
// Buildings from geoserver starts 
		var layer2 = new WMSLayer({
		  title: "Building_Footprint",
          url: "https://gis2.jharkhand.gov.in/arcgis/rest/services/JSAC/All_layers_state/MapServer/1",
          featureInfoFormat: "text/html",
          featureInfoUrl: "https://gis2.jharkhand.gov.in/arcgis/rest/services/JSAC/All_layers_state/MapServer/1",
          sublayers: [
            {
              title: ["Bokaro"],
			  name: ["Bokaro"],
              popupEnabled: true,
              queryable: true,
			  visible: false
            }
          ]
        });
// Buildings from geoserver starts ends	
		
// landuse landcover from geoserver starts 		
		var layer3 = new WMSLayer({
		  title: "Landuse_Landcover",
          url: "http://localhost:8181/geoserver/rgroup/wms?",
          featureInfoFormat: "text/html",
          featureInfoUrl: "http://localhost:8181/wmsproject//geoserver/rgroup/wms",
          sublayers: [
            {
              title: ["Lulc"],
			  name: ["Lulc"],
			  legendUrl: "http://localhost:8181/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=rgroup:Lulc",
              popupEnabled: true,
              queryable: true,
			  visible: false
            }
          ]
        });
// Landuse landcover from geoserver ends
		
// Grouping of layers starts
		var GroupLayer = new GroupLayer ({
		title: "Raj Thematic Data",
		layers: [layer1,layer2,layer3],
		opacity: 0.75
		});
// Grouping of layers ends	

// Map function starts
		var map = new Map({
          basemap: "dark-gray-vector",
		  
		  layers:  [GroupLayer]
        });
// Map function ends
		
// Map view function starts		
        var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [86.12976275243592,23.667766405858472],
          zoom: 11,
        });
// Map view function ends

// Search widgets function starts
		 var Search = new Search({
            view: view,
			container: SC
	     });
		 view.ui.add(Search,"top-right");
//Search widgets function ends 

//BasemapGallery widgets starts			 
		 var basemapGallery = new BasemapGallery({
		  view: view,
		  container: BGC
	     });
		 view.ui.add(basemapGallery,"top-right");
//BasemapGallery widgets ends	 
		// Search widgets function ends
		//Legend wigdgets function starts
		 var Legendroad = new Legend({
            view: view,
			container: LGC,
			layerInfos: [
			{
				layer: layer1 
			}
			]
	     });
		 view.ui.add(Legendroad,"top-right");
		 
		 var Legendlulc = new Legend({
            view: view,
			container: LGC,
			layerInfos: [
			{
				layer: layer3 
			}
			]
	     });
		 view.ui.add(Legendlulc,"top-right");
	  //Legend wigdgets function emds		 
		 var print = new Print({
            view: view,
			container: EMC,
            // specify your own print service
            printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
          });

          // Add widget to the top right corner of the view
          view.ui.add(print, "top-right");
//Corordinate div info strats

function showCoordinates(pt) {
  var coords =
    "Lat/Lon " +
    pt.latitude.toFixed(5) +
    " " +
    pt.longitude.toFixed(5) +
    " | Scale 1:" +
    Math.round(view.scale * 1) / 1 +
    " | Zoom " +
    view.zoom;
  coordsWidget.innerHTML = coords;
}
    view.watch("stationary", function (isStationary) {
  showCoordinates(view.center);
});

view.on("pointer-move", function (evt) {
  showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
});
view.ui.add(coordsWidget, "bottom-left");

//Corordinate div info ends


 // Creates actions in the LayerList.

        function defineActions(event) {
          // The event object contains an item property.
          // is a ListItem referencing the associated layer
          // and other properties. You can control the visibility of the
          // item, its title, and actions using this object.

          var item = event.item;

          if (item.title === "Raj Thematic Data") {
            // An array of objects defining actions to place in the LayerList.
            // By making this array two-dimensional, you can separate similar
            // actions into separate groups with a breaking line.

            item.actionsSections = [
              [
                {
                  title: "Go to full extent",
                  className: "esri-icon-zoom-out-fixed",
                  id: "full-extent"
                },
                {
                  title: "Layer information",
                  className: "esri-icon-description",
                  id: "information"
                }
              ],
              [
                {
                  title: "Increase opacity",
                  className: "esri-icon-up",
                  id: "increase-opacity"
                },
                {
                  title: "Decrease opacity",
                  className: "esri-icon-down",
                  id: "decrease-opacity"
                }
              ]
            ];
          }
        }

        view.when(function() {
          // Create the LayerList widget with the associated actions
          // and add it to the top-right corner of the view.

          var layerList = new LayerList({
            view: view,
			container: LC,
            // executes for each ListItem in the LayerList
            listItemCreatedFunction: defineActions
          });

          // Event listener that fires each time an action is triggered

          layerList.on("trigger-action", function(event) {
            // The layer visible in the view at the time of the trigger.
            var visibleLayer = layer1.visible ? layer1 : layer2, layer3;

            // Capture the action id.
            var id = event.action.id;

            if (id === "full-extent") {
              // if the full-extent action is triggered then navigate
              // to the full extent of the visible layer
              view.goTo(visibleLayer.fullExtent)
              .catch(function(error){
                if (error.name != "AbortError"){
                  console.error(error);
                }
              });
            } else if (id === "information") {
              // if the information action is triggered, then
              // open the item details page of the service layer
              window.open(visibleLayer.url);
            } else if (id === "increase-opacity") {
              // if the increase-opacity action is triggered, then
              // increase the opacity of the GroupLayer by 0.25

              if (GroupLayer.opacity < 1) {
                GroupLayer.opacity += 0.25;
              }
            } else if (id === "decrease-opacity") {
              // if the decrease-opacity action is triggered, then
              // decrease the opacity of the GroupLayer by 0.25

              if (GroupLayer.opacity > 0) {
                GroupLayer.opacity -= 0.25;
              }
            }
          });

          // Add widget to the top right corner of the view
          view.ui.add(layerList, "top-right");
        });
		});