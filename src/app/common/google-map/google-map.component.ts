import { Component, OnInit,ViewChild} from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow,MapMarker,} from '@angular/google-maps';


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

  shape = null

  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  labelIndex = 1;
  poly:google.maps.Polyline;
  marker:google.maps.Marker;


  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  constructor() { }

  ngOnInit(): void { 
    this.initMap()
  }

//初始化google地图
  initMap() {
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        // center: { lat: 22.1917195, lng: 113.5476421 },
        zoom: 14,
      }
    );

    //初始化后定位设备所在位置
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.map.setCenter(this.center);
    })

    //构造线段
    this.poly = new google.maps.Polyline({
      strokeColor: "#ffff00",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    this.poly.setMap(this.map);

    //绑定google地图点击事件
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.addMarker(event.latLng, this.map);
    })
  }

  //google地图点击事件，触发此函数；此函数添加带有线段连接的标记
  addMarker(location:google.maps.LatLngLiteral, map:google.maps.Map) {
    const path = this.poly.getPath();
    path.push(location);

    this.marker = new google.maps.Marker({
      position: location,
      label: (this.labelIndex++).toString(),
      map: map,
      draggable: true,
    });
      this.map.panTo(location)

    //绑定标记点击事件
    this.marker.addListener('click', (event) => {
      console.log('Lat:'+ event.latLng.lat(),'Lng:'+ event.latLng.lng());
      
    })
  }

  drawMaker() {
    if (this.drawingManager != null) {
      this.drawingManager.setMap(null);
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControlOptions: {
        // position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
        ],
      },
      markerOptions: {
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png",
      }
    });
    this.drawingManager.setMap(this.map);
    this.drawingManager.addListener('overlaycomplete',( e:any ) => {
      this.overlayComplete(e)
    })

  }

  drawPolyline() {
    if (this.drawingManager != null) {
      this.drawingManager.setMap(null);
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControlOptions: {
        // position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYLINE
        ],
      },
      polylineOptions: {
        strokeColor: 'black',
        strokeWeight: 3,
        zIndex: 1
      }
    });
    this.drawingManager.setMap(this.map);
    this.drawingManager.addListener('overlaycomplete',( e:any ) => {
      this.overlayComplete(e)
    })
  }

  drawPolygon(fillColor:string) {
    if (this.drawingManager != null) {
      this.drawingManager.setMap(null);
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        // position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ],
      },
      polygonOptions: {
        strokeColor: 'black',
        strokeWeight: 3,
        fillColor: fillColor,
        fillOpacity:0.6,
        zIndex: 1
      }
    });
    this.drawingManager.setMap(this.map);
    this.drawingManager.addListener('overlaycomplete',( e:any ) => {
      this.overlayComplete(e)
    })
  }

  overlayComplete(e:any) {
    
    if (e.type == google.maps.drawing.OverlayType.MARKER) {
      let newShape = e.overlay;
      newShape.type = e.type;
      let array = newShape.position
      console.log('Lat:'+ array.lat(),'Lng:'+ array.lng());
    }

    if (e.type == google.maps.drawing.OverlayType.POLYGON) {
      let newShape = e.overlay;
      newShape.type = e.type;
      let array = newShape.getPath().getArray();
      this.getLonLat(array)
    }

    if (e.type == google.maps.drawing.OverlayType.POLYLINE) {
      let newShape = e.overlay;
      newShape.type = e.type;
      let array = newShape.getPath().getArray();
      this.getLonLat(array)
    }
  }

  stopDraw() {
    if (this.drawingManager != null) {
      this.drawingManager.setMap(null);
    }
  }

  getLonLat(arr:any) {
    var strinfo = "";
    for (var i = 0; i < arr.length; i++) {
        strinfo += arr[i].lat()
        strinfo += ",";
        strinfo += arr[i].lng();
        strinfo += "|";
    }
    console.log(strinfo);
  }

}
