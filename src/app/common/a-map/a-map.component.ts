import { Component, OnInit } from '@angular/core';
declare var AMap: any;

@Component({
  selector: 'app-a-map',
  templateUrl: './a-map.component.html',
  styleUrls: ['./a-map.component.css']
})
export class AMapComponent implements OnInit {

  map: any;//地图对象
  overlays:Array<any> = []; //覆盖物图层
  mouseTool:any; //鼠标绘图工具
  polygonEditor:any;
  initOverlays:Array<any>;
  lastStepDisanled:boolean = true;
  marker:any; //标记点
  disText:any;//地图两点距离文本
  markers:Array<any> = []; //放入所有标记点
  polylines:Array<any> = [] //放入所有折线
  flightPath:any; //飞行路径线段
  flightPaths:any = []; //所有飞行路径
  currentId:any; //标记点当前ID
  markerId:number = 0; //标记点ID,按顺序+1递增
  closewp:boolean = false //是否展示标记点配置属性模态框
  altitude:number = 30 //全局标记点高度
  longitiude:number = null; //全局标记点经度
  latitude:number = null; //全局标记点纬度
  wayPoint:number = null; //全局标记点号码
  speed:number = 30; //飞机航速

  constructor() { }

  ngOnInit(): void {
    this.getlocaltion();
    // this.loadMouseTool();
  }

  //加载地图时绘制固定位置覆盖物
  InitArea() {
      var flyingPath = [[113.574401, 22.143284],
                        [113.574347, 22.143234],
                        [113.574347, 22.142981],
                        [113.574278, 22.142881],
                        [113.574251, 22.142687],
                        [113.574229, 22.142384],
                        [113.574278, 22.142181],
                        [113.574428, 22.142022],
                        [113.57461,  22.141937],
                        [113.575554, 22.141967],
                        [113.575839, 22.141987],
                        [113.576413, 22.142032],
                        [113.576439, 22.143328],
                        [113.576311, 22.143254],
                        [113.576075, 22.143229],
                        [113.575978, 22.143229],
                        [113.575817, 22.14307 ],
                        [113.575581, 22.14302 ],
                        [113.575334, 22.143055],
                        [113.575077, 22.143169],
                        [113.574841, 22.143299],
                        [113.574406, 22.143299]]
  
      var showPath = [[113.574438, 22.143164],
                      [113.574476, 22.143254],
                      [113.574535, 22.143264],
                      [113.574835, 22.143269],
                      [113.575222, 22.14305 ],
                      [113.575447, 22.142986],
                      [113.57571 , 22.143001],
                      [113.575849, 22.143045],
                      [113.575978, 22.143209],
                      [113.576166, 22.143199],
                      [113.576418, 22.14324 ],
                      [113.576386, 22.142081],
                      [113.574701, 22.14202 ],
                      [113.574514, 22.14205 ],
                      [113.574374, 22.14223 ],
                      [113.574331, 22.142379],
                      [113.574326, 22.142568],
                      [113.574363, 22.142871],
                      [113.574422, 22.142911]]
      
      var showPath1 = [[113.574894, 22.147179],
                       [113.574921, 22.146459],
                       [113.575173, 22.146434],
                       [113.575248, 22.146305],
                       [113.575082, 22.14623 ],
                       [113.574953, 22.14619 ],
                       [113.574283, 22.14624 ],
                       [113.574208, 22.146275],
                       [113.574154, 22.146429],
                       [113.574111, 22.146439],
                       [113.574074, 22.146583],
                       [113.57409,  22.146712],
                       [113.574181, 22.146782],
                       [113.574272, 22.146906],
                       [113.574337, 22.146961],
                       [113.57453,  22.14704 ],
                       [113.574589, 22.14704 ]]            
  
      var eleFencePath = [[113.572063, 22.144769], 
                          [113.574101, 22.144739], 
                          [113.573563, 22.147092], 
                          [113.573381, 22.147574], 
                          [113.572415, 22.147246], 
                          [113.570977, 22.147107],
                          [113.569239, 22.147554], 
                          [113.5691, 22.14657   ], 
                          [113.569003, 22.145298],
                          [113.569261, 22.14503 ]]
  
      var viewerPath = [[113.57432, 22.145902],
                        [113.574406,22.145947],
                        [113.574803,22.145917],
                        [113.574991,22.145912],
                        [113.575581,22.145226],
                        [113.575501,22.144069],
                        [113.57505, 22.143741],
                        [113.574937,22.143592],
                        [113.574814,22.143542],
                        [113.574514,22.143597],
                        [113.574556,22.144233],
                        [113.574508,22.144894]]
  
      var viewerPath1 = [[113.574514, 22.143517],
                         [113.574814, 22.143497],
                         [113.575023, 22.143423],
                         [113.575248, 22.143269],
                         [113.575399, 22.143229],
                         [113.57557,  22.143259],
                         [113.575731, 22.143408],
                         [113.57586,  22.143562],
                         [113.575892, 22.143617],
                         [113.576037, 22.143726],
                         [113.5763,   22.143756],
                         [113.576375, 22.143701],
                         [113.576364, 22.143482],
                         [113.576359, 22.143373],
                         [113.576278, 22.143284],
                         [113.576112, 22.143259],
                         [113.575983, 22.143269],
                         [113.575908, 22.143244],
                         [113.575801, 22.14311 ],
                         [113.57549,  22.14307 ],
                         [113.575318, 22.14312 ],
                         [113.575034, 22.143254],
                         [113.574835, 22.143348],
                         [113.574487, 22.143328]]
  
      var viewerPath2 = [[113.574269, 22.146171],
                         [113.574919, 22.146136],
                         [113.575203, 22.146225],
                         [113.575434, 22.146315],
                         [113.575546, 22.146315],
                         [113.57553,  22.146146],
                         [113.575348, 22.146121],
                         [113.575267, 22.146012],
                         [113.575063, 22.145967],
                         [113.57464,  22.145962],
                         [113.574312, 22.145952]]
  
      var landingPath = [[113.575914, 22.142504],
                         [113.57637,  22.142509],
                         [113.576364, 22.142091],
                         [113.575919, 22.142076]]
      
      var landingPath1 = [[113.574632, 22.146429],
                          [113.574862, 22.146419],
                          [113.574851, 22.14623 ],
                          [113.574605, 22.146235]]
  
      var reservePath = [[113.575908,22.142911], 
                         [113.576375,22.142911], 
                         [113.576359,22.142528],
                         [113.575914,22.142533]]
  
      var reservePath1 = [[113.574924,22.146429], 
                          [113.57516, 22.146419], 
                          [113.575165,22.14627 ],
                          [113.574908,22.1462  ]]
  
  
      var flying = new AMap.Polyline({
        path: flyingPath,
        strokeColor:'black',
        strokeWeight: 3,
        strokeStyle: "dashed",
      })
  
      var show = new AMap.Polygon({
        path: [showPath,showPath1],
        fillColor:'#1791fc',
        strokeColor:'black',
        strokeStyle: "dashed",
        strokeWeight: 2,
        fillOpacity: 0.4
      })
  
      var eleFence = new AMap.Polygon({
        path: eleFencePath,
        fillColor:'gray',
        strokeColor:'black',
        strokeStyle: "dashed",
        strokeWeight: 2,
        fillOpacity: 0.4
      })
  
      var viwer= new AMap.Polygon({
        path: [viewerPath,viewerPath1,viewerPath2],
        fillColor:'#58bf58',
        strokeColor:'black',
        strokeStyle: "dashed",
        strokeWeight: 2,
        fillOpacity: 0.4
      })  
  
      var landing= new AMap.Polygon({
        path: [landingPath,landingPath1],
        fillColor:'#ff0000',
        strokeColor:'black',
        strokeStyle: "dashed",
        strokeWeight: 2,
        fillOpacity: 0.4
      })
  
      var reserve= new AMap.Polygon({
        path: [reservePath,reservePath1],
        fillColor:'#f0e336',
        strokeColor:'black',
        strokeStyle: "dashed",
        strokeWeight: 2,
        fillOpacity: 0.4
      }) 
  
      // this.initOverlays = [flying,show,viwer,landing,reserve];
      // this.map.add(this.initOverlays)
      
      //绑定地图点击事件，创建标记点
      AMap.event.addListener(this.map, 'click', (e) => {
          this.addMarker(e);
      });
  }

  //高德地图点击事件触发此函数，此函数添加带有线段连接的标记点
  addMarker(e) {
    this.closewp = true;
    let id = ++this.markerId;
    var lnglat = e.lnglat;
    //创建标记点
    this.marker = new AMap.Marker({
      content:'<div class="marker" style="width:22px;height:36px;background-image:url(https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png);background-size: 22px 36px;text-align: center;line-height: 24px;color: #fff ">'+ id +'</div>',
      map: this.map,
      draggable:true,
      position: lnglat,
      extData: id
    });
    this.overlays.push(this.marker);

    if ( this.overlays.length > 1) {
      var p1 = this.overlays[this.overlays.length - 2].getPosition();
      var p2 = this.marker.getPosition();
      var path =[p1,p2];
      var textPos = p1.divideBy(2).add(p2.divideBy(2));
      var distance = Math.round(p1.distance(p2));
      //创建飞行路径线段
      this.flightPath = new AMap.Polyline({
        map: this.map,
        strokeColor:'#80d8ff',
        isOutline:true,
        outlineColor:'white',
        extData: id - 1
      });
      this.flightPath.setPath(path);
      this.polylines.push(this.flightPath);
      //创建距离文本
      this.disText = new AMap.Text({
        map: this.map,
        text:'',
        style:{'background-color':'#29b6f6',
        'border-color':'#e1f5fe',
        'font-size':'12px'},
        extData: id - 1
      });
      this.disText.setText(distance+'m');
      this.disText.setPosition(textPos);
    }

    this.addFlightPath(this.marker);

    //每个标记点绑定点击事件
    this.marker.on('click', (e) => {
      this.currentId = id;
      this.showMarkerSetting(e);
    })

    //每个标记点绑定拖拽事件(拖拽会实时改变overlays里的标记点数据)
    this.marker.on('dragging', (e) => {
      this.currentId = id;
      this.showMarkerSetting(e);
      this.filterPolyline(e);
    })
  }

  tryToEditPolyline() {
    this.map.remove(this.map.getAllOverlays('polyline'));
    console.log('AllOverlays', this.map.getAllOverlays('polyline').length);
  }

  //添加将要post的飞行路径
  addFlightPath(markerInfo) {
    var location = markerInfo.getPosition();

    this.wayPoint = markerInfo.getExtData();
    this.latitude = location.getLat();
    this.longitiude = location.getLng();
    this.altitude = 30;
    
    var marker = {
      id: markerInfo.getExtData(),
      lat: location.getLat(),
      lng: location.getLng(),
      altitude: this.altitude
    }

    this.flightPaths.push(marker)
  }

  //删除某个标记点
  deleteMarker() {

  }
  
  //关闭飞行路径标记点配置属性模态框
  closeWp() {
    this.closewp = false;
  }

  //在模态框显示标记点的配置属性
  showMarkerSetting(e) {
    this.closewp = true;
    var eventType = e.type;
    if(eventType == 'click') {
      this.flightPaths.forEach(element => {
        if ( element['id'] == this.currentId ) {
          this.wayPoint = element['id'];
          this.latitude = element['lat'];
          this.longitiude = element['lng'];
          this.altitude = element['altitude'];
        }
      });
    } else if (eventType == 'dragging'){
      let lat = e.target.getPosition().lat;
      let lng = e.target.getPosition().lng;
      this.latitude = lat;
      this.longitiude = lng;
      this.flightPaths.forEach(element => {
        if ( element['id'] == this.currentId ) {
          this.wayPoint = element['id'];
          element['lat'] = lat;
          element['lng'] = lng;
          this.altitude = element['altitude'];
        }
      });
    }
  }

  //修改飞行路径（标记点）的配置属性
  editFlightPath() {
    this.flightPaths.forEach(element => {
      if(this.currentId == element['id']) {
        element['altitude'] = this.altitude;
      }
    });
  }

  //过滤需要拖拽的折线
  filterPolyline(e) {
    var id = e.target.getExtData();
    var polylineOverlays = this.map.getAllOverlays('polyline');
    var markerOverlays = this.map.getAllOverlays('marker');
    var textOverlays = this.map.getAllOverlays('text');

    //只有一个标记点
    if(id == 1) {
      //第一个标记点和第一条折线
      if (polylineOverlays.length) {
        this.dragPolyline(e,id,polylineOverlays,textOverlays,'next')
      }
    //最后一个标记点和折线
    } else if(id == markerOverlays.length && polylineOverlays.length) {
      this.dragPolyline(e,id-1,polylineOverlays,textOverlays,'pre')
    //中间标记点和折线
    } else {
      this.dragPolyline(e,id-1,polylineOverlays,textOverlays,'pre')
      this.dragPolyline(e,id,polylineOverlays,textOverlays,'next')
    }
  }

  //折线和距离文本端点随着标记点拖拽而动
  dragPolyline(event,indexId,polylineOverlays,textOverlays,type) {
    let matchPolyline:any;
    let matchText:any;
    [matchPolyline] = polylineOverlays.filter(element => element.getExtData() == indexId);
    [matchText] = textOverlays.filter(element => element.getExtData() == indexId);
    if(type == 'pre') { 
      var p1 = matchPolyline.getPath()[0];
      var p2 = event.target.getPosition();
    } else if(type == 'next') {
      var p1 = event.target.getPosition();
      var p2 = matchPolyline.getPath()[1];
    }
    let path = [p1,p2];
    matchPolyline.setPath(path);

    let textPos = p1.divideBy(2).add(p2.divideBy(2));
    let distance = Math.round(p1.distance(p2));
    matchText.setText(distance+'m');
    matchText.setPosition(textPos);
  }

  // 地图要放到函数里。
  getMap() {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 11,
        center: [116.397428, 39.90923]
      });
      this.map.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],() => {
        this.map.addControl(new AMap.ToolBar());
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.OverView({isOpen:true}));
      })
  }

   //获取自己的定位
  getlocaltion() {
  
      // //   实例化一个地图
      this.map = new AMap.Map('container', {
          resizeEnable: true,
      });
  
      this.InitArea();
  
      //  添加地图插件：地图工具条
      this.map.plugin(['AMap.ToolBar'], () => {
          // 设置地位标记为自定义标
          let toolBar = new AMap.ToolBar({
              // locationMarker: customMarker
              position:'LT'
          });
          //  添加插件
          this.map.addControl(toolBar);
      });
  
      // 添加工具条方向盘
    //   this.map.plugin(["AMap.ControlBar"], () => {
    //     var controlBar = new AMap.ControlBar({
  
    //     })
    //     this.map.addControl(controlBar)
    // });
  
      //  添加比例尺插件
      this.map.plugin(['AMap.Scale'], () => {
          //   初始化插件
          let scale = new AMap.Scale();
          //   加载插件
          this.map.addControl(scale);
      });
  
      //  加载地图实景
      this.map.plugin(["AMap.MapType"], () => {
          let type = new AMap.MapType();
          this.map.addControl(type);
      });
  
      // //  加载鹰眼 1.x版本：OverView  2.0版本：HawkEye
      this.map.plugin(["AMap.OverView"], () => {
          let view = new AMap.OverView({
              // 鹰眼是否展示
              visible: true,
              // 鹰眼是否展开
              isOpen: true,
              // width:'120px',
              // height:'120px'
          });
          this.map.addControl(view);
          // 调用方法 显示鹰眼窗口
          view.show();
      });
  
  
      // 添加定位
      this.map.plugin('AMap.Geolocation', () => {
          let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
              maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
              convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: false,        // 显示定位按钮，默认：true
              buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true,         //    定位成功后在定位到的位置显示点标记，默认：true
              showCircle: false,        // 定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  
          });
          // 加载插件
          this.map.addControl(geolocation);
          // 调用方法 获取用户当前的精确位置信息
          geolocation.getCurrentPosition();
          //  定时刷新位置
          // geolocation.watchPosition(
          //     2
          // );
  
          geolocation.on('complete', (data: any) => {
              // var marker = new AMap.Marker({
              //     icon: '//vdata.amap.com/icons/b18/1/2.png',
              //     position: data.position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              //     title: data.formattedAddress,
              // });
  
              // // 将创建的点标记添加到已有的地图实例：
              // this.map.add(marker);
  
              console.log("定位成功",data);
          }); //  返回定位信息
          geolocation.on('error', (error: any) => {
              console.log("定位失败",error);
          });      // 返回定位出错信息
      });
  
      // //   获取输入类的
      // let autoOptions = {
      //     input: 'tipinput'
      // };
  
      // //  加载输入类插件
      // this.map.plugin('AMap.Autocomplete', () => {
      //     //  实例化
      //     let auto = new AMap.Autocomplete(autoOptions);
      //     // 加载插件
      //     this.map.addControl(auto);
      // });
  
  
      // // 加载收索类插件
      // this.map.plugin('AMap.PlaceSearch', () => {
      //     //   实例化
      //     let placeSearch = new AMap.PlaceSearch({
      //         map: this.map
      //     });  // 构造地点查询类
      //     //   加载插件
      //     this.map.addControl(placeSearch);
      //     //  注册监听事件，当选中某条记录的时候就会触发
      //     AMap.event.addListener(new AMap.Autocomplete(autoOptions), "select", (e: { poi: { adcode: any; name: any; }; }) => {
      //         placeSearch.setCity(e.poi.adcode);
      //         placeSearch.search(e.poi.name);  //关键字查询查询
      //     });
  
      // });
  }

  //加载鼠标绘制工具
  loadMouseTool() {
      this.overlays = [];
      this.map.plugin(['AMap.MouseTool'], () => {
        this.mouseTool = new AMap.MouseTool(this.map);
      });
  
      this.mouseTool.on('draw', (e: { obj: any; }) => {
        this.overlays.push(e.obj);
        if ( this.overlays.length > 0) {
          this.lastStepDisanled = false;
        }
        var overlay = e.obj;
        if (overlay.CLASS_NAME === 'AMap.Marker') {
          console.log(overlay.getPosition()); //获取点标注位置
        } else if (overlay.CLASS_NAME === 'AMap.Polyline') {
          console.log(overlay.getPath()); //获取路径/范围
        } else if (overlay.CLASS_NAME === 'AMap.Polygon') {
          console.log(overlay.getPath()); //获取路径/范围
        } 
      }) 
  }

  // 绘制覆盖物
  draw(type:any) {
      switch(type){
        case 'location':{
            this.mouseTool.marker({
              draggable: true,
              // raiseOnDrag: true
            });
            break;
        }
        case 'flyArea':{
            this.mouseTool.polyline({
              strokeColor:'black',
              strokeWeight: 3,
              strokeStyle: "dashed",
            });
            break;
        }
        case 'showArea':{
            this.mouseTool.polygon({
              fillColor:'#1791fc',
              strokeColor:'black',
              strokeStyle: "dashed",
              strokeWeight: 2,
            });
            break;
        }
        case 'eleFence':{
          this.mouseTool.polygon({
            fillColor:'gray',
            strokeColor:'black',
            strokeStyle: "dashed",
            strokeWeight: 2,
          });
          break;
        }
        case 'viewer':{
          this.mouseTool.polygon({
            fillColor:'#58bf58',
            strokeColor:'black',
            strokeStyle: "dashed",
            strokeWeight: 2,
          });
          break;
        }
        case 'landing':{
          this.mouseTool.polygon({
            fillColor:'#ff0000',
            strokeColor:'black',
            strokeStyle: "dashed",
            strokeWeight: 2,
          });
          break;
        }
        case 'reserve':{
          this.mouseTool.polygon({
            fillColor:'#f0e336',
            strokeColor:'black',
            strokeStyle: "dashed",
            strokeWeight: 2,
          });
          break;
        }
      }
  }

  //清楚地图上的覆盖物
  clear() {
      var all = this.initOverlays.concat(this.overlays)
      this.map.remove(all)
      this.overlays = [];
      this.lastStepDisanled = true;
  }

  //关闭绘制覆盖物功能
  closeDraw () {
      this.mouseTool.close()
      let radios = document.getElementsByName('func') ;
      for(var i = 0; i < radios.length; i += 1){
        (radios[i] as HTMLInputElement).checked = false;
      }
  }

  //创建并编辑多边形 To Do
  createPolygon() {
      this.polygonEditor.close();
      this.polygonEditor.setTarget();
      this.polygonEditor.open();
  }

  //开始编辑 To Do
  startEditor() {
    this.polygonEditor.open();
  }

  //结束编辑 To Do
  closeEditor() {
    this.polygonEditor.close()
  }

  //撤回最新绘制的覆盖物
  lastStep() {
      // this.polygonEditor.close();
      let len = this.overlays.length;
      if ( len > 0) {
        this.lastStepDisanled = false;
        this.map.remove(this.overlays[len - 1])
        this.overlays.pop();
          if( this.overlays.length === 0) {
            this.lastStepDisanled = true;
          } 
      }   
  }
}
