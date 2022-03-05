import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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

  markerId = 1;
  poly:google.maps.Polyline;
  polys:any = [];
  flightPaths:any = [];
  marker:google.maps.Marker;
  markers: google.maps.Marker[] = [];
  closewp:boolean = false;
  wayPoint:number = null;

  latitude:number = null;
  longitiude:number = null;

  currentId:string = null;

  altitude:number = 30
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
      editable: true
    });
    this.poly.setMap(this.map);

    //绑定google地图点击事件
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.addMarker(event.latLng, this.map);
    })
  }

  //google地图点击事件，触发此函数；此函数添加带有线段连接的标记
  addMarker(location, map:google.maps.Map) {
    this.closewp = true;
    this.polys = this.poly.getPath();
    this.polys.push(location);
    
    var markerLabel = (this.markerId ++).toString()
    this.marker = new google.maps.Marker({
      position: location,
      label: markerLabel,
      map: map,
      // draggable: true,
    });
    // number of point 

    // id 

    // this.map.panTo(location)
    this.addFlightPath(this.marker)
    this.wayPoint = this.marker['label'];
    this.latitude = location.lat();
    this.longitiude = location.lng();
   

    //绑定标记点击事件
    this.marker.addListener('click', (event) => {

      // current point ID
      this.currentId = markerLabel;
      this.showMarkerSetting();
    })

    //绑定标记拖拽事件
    this.marker.addListener('drag', (event) => {
      this.latitude = event.latLng.lat();
      this.longitiude = event.latLng.lng();
    })

  }

  //添加飞行路径
  addFlightPath(markerInfo) {
    this.altitude = 30
    this.markers.push(markerInfo);

    var location = markerInfo.position

    var marker = {
      id: markerInfo.label,
      lat: location.lat(),
      lng: location.lng(),
      altitude: this.altitude
    }

    this.flightPaths.push(marker)
    // console.log('flightPaths', this.flightPaths);
    // console.log('markers', this.markers);
  }



  //显示标记的配置属性
  showMarkerSetting() {
    this.closewp = true;
    for(let i = 0; i < this.flightPaths.length; i++) {
      if (this.currentId == this.flightPaths[i]['id']) {
        console.log(this.flightPaths[i]);
        this.wayPoint = this.flightPaths[i]['id'];
        this.latitude = this.flightPaths[i]['lat'];
        this.longitiude = this.flightPaths[i]['lng'];
        this.altitude = this.flightPaths[i]['altitude'];
      }
    }
  }

  //修改飞行路径（标记）的配置属性
  editFlightPath() {
    for(let i = 0; i < this.flightPaths.length; i++) {
      if (this.currentId == this.flightPaths[i]['id']) {
        this.flightPaths[i]['altitude'] = this.altitude;
      }
    }
  }

  deleteMarker() {
    this.flightPaths.pop();
    this.markers.pop().setMap(null);
  }

  deleteMarkers() {
    this.setMapOnAll(null);
    this.markers = [];
  }

  setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null)
    }
  }

  closeWp() {
    this.closewp = false;
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
