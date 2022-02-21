import { Component, OnInit,ViewChild} from '@angular/core';
import { GoogleMap, MapInfoWindow,MapMarker,} from '@angular/google-maps';


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

  map:google.maps.Map;
  //定义地图中心点变量
  center: google.maps.LatLngLiteral;
  //地图初始化选项配置
  mapOptions: google.maps.MapOptions = {
    zoom: 14
  };

  //定义标记数组
  markersPositons: google.maps.LatLngLiteral[] = [];

  drawingManager:google.maps.drawing.DrawingManager;


  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  constructor() { }

  ngOnInit(): void {
    this.initMap()
  }


  initMap() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.map.setCenter(this.center);
    })

    this.map = new google.maps.Map(
      
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 22.1917195, lng: 113.5476421 },
        zoom: 14,
      }
    );

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          // google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: {
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png",
      }
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE,
        ],
      }
    });

    this.drawingManager.setMap(this.map);
  }

}
