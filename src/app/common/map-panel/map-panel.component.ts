import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
declare var AMap: any;

@Component({
  selector: 'app-map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css']
})
export class MapPanelComponent implements OnInit,AfterViewInit,OnDestroy {

  map: any;//地图对象
  title = 'Map';
  overlays:Array<any>;
  mouseTool:any;
  polyEditor:any;
  initOverlays:Array<any>;

  constructor() { }

  ngOnInit(): void {
    // this.getMap();
    this.getlocaltion();
    this.loadMouseTool();
    this.getAllArea();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  //创建并编辑多边形 To Do
  createPolygon() {
    this.map.plugin(['AMap.PolyEditor'], () => {
      this.polyEditor = new AMap.PolyEditor(this.map)
      this.polyEditor.close();
      // this.polyEditor.setTarget();
      this.polyEditor.open();
    });

  }


  //加载地图时绘制固定位置覆盖物
  getAllArea() {
    var flyingPath = [[113.576638, 22.147969], 
                      [113.574235, 22.146995], 
                      [113.573967, 22.146697], 
                      [113.574214, 22.145465], 
                      [113.574375, 22.144332], 
                      [113.574192, 22.142156],
                      [113.574428, 22.141867], 
                      [113.575855, 22.141907], 
                      [113.577261, 22.142056],
                      [113.579718, 22.142593], 
                      [113.579921, 22.14304], 
                      [113.57666, 22.147979]]

    var showPath = [[113.574325, 22.145924], 
                    [113.574486, 22.143539], 
                    [113.576331, 22.143569], 
                    [113.576235, 22.145954]]

    var eleFencePath = [[113.572063, 22.144769], 
                        [113.574101, 22.144739], 
                        [113.573563, 22.147092], 
                        [113.573381, 22.147574], 
                        [113.572415, 22.147246], 
                        [113.570977, 22.147107],
                        [113.569239, 22.147554], 
                        [113.5691, 22.14657], 
                        [113.569003, 22.145298],
                        [113.569261, 22.14503]]

    var viewerPath = [[113.577801, 22.145865], 
                      [113.577694, 22.143788], 
                      [113.578702, 22.144493]]

    var landingPath = [[113.576353, 22.145924], 
                       [113.576857, 22.145924], 
                       [113.576889, 22.143599],
                       [113.576428, 22.143589]]

    var reservePath = [[113.574561, 22.14339], 
                       [113.576868, 22.14345], 
                       [113.576814, 22.142874],
                       [113.574529, 22.142864]]

    var flying = new AMap.Polyline({
      path: flyingPath,
      strokeColor:'black',
      strokeWeight: 3,
      strokeStyle: "dashed",
    })

    var show = new AMap.Polygon({
      path: showPath,
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
      path: viewerPath,
      fillColor:'#58bf58',
      strokeColor:'black',
      strokeStyle: "dashed",
      strokeWeight: 2,
      fillOpacity: 0.4
    })  

    var landing= new AMap.Polygon({
      path: landingPath,
      fillColor:'#ff0000',
      strokeColor:'black',
      strokeStyle: "dashed",
      strokeWeight: 2,
      fillOpacity: 0.4
    })

    var reserve= new AMap.Polygon({
      path: reservePath,
      fillColor:'#f0e336',
      strokeColor:'black',
      strokeStyle: "dashed",
      strokeWeight: 2,
      fillOpacity: 0.4
    }) 

    this.initOverlays = [flying,show,eleFence,viwer,landing,reserve];
    this.map.add(this.initOverlays)

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
    // //  设置我们需要的目标城市
    // this.map.setCity("成都"); // 或者输入精度
    //  自定义一个标识(marker)
    let customMarker = new AMap.Marker({
        // 这个是在高德API里面的参考手册的基础类里面
        // 自定义偏移量
        offset: new AMap.Pixel(0, 0), // 使用的是Pixel类
        // 这个是在高德API里面的参考手册的覆盖物里面
        //  自定义图标
        icon: new AMap.Icon({ // 复杂图标类
            // 设定图标的大小
            size: new AMap.Size(27, 36),
            // 图片地址
            imgae: '//vdata.amap.com/icons/b18/1/2.png',
            imageOffset: new AMap.Pixel(-28, 0)// 相对于大图的取图位置
        })
    });

    //  添加地图插件：地图工具条
    this.map.plugin(['AMap.ToolBar'], () => {
        // 设置地位标记为自定义标
        let toolBar = new AMap.ToolBar({
            locationMarker: customMarker
        });
        //  添加插件
        this.map.addControl(toolBar);
    });

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

    // //  加载鹰眼
    this.map.plugin(["AMap.OverView"], () => {
        let view = new AMap.OverView({
            // 鹰眼是否展示
            visible: true,
            // 鹰眼是否展开
            isOpen: true
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
        geolocation.watchPosition(
            2
        );

        AMap.event.addListener(geolocation, 'complete', (data: any) => {
            // var marker = new AMap.Marker({
            //     icon: '//vdata.amap.com/icons/b18/1/2.png',
            //     position: data.position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            //     title: data.formattedAddress,
            // });

            // // 将创建的点标记添加到已有的地图实例：
            // this.map.add(marker);

            console.log("定位成功",data);
        }); //  返回定位信息
        AMap.event.addListener(geolocation, 'error', (error: any) => {
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
            raiseOnDrag: true
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
  }

  //关闭绘制覆盖物功能
  closeDraw () {
    this.mouseTool.close()
    let radios = document.getElementsByName('func') ;
    for(var i = 0; i < radios.length; i += 1){
      (radios[i] as HTMLInputElement).checked = false;
    }
  }

  startEditor() {
    this.map.plugin(['AMap.PolyEditor'], () => {
      this.polyEditor = new AMap.PolyEditor(this.map)
      this.polyEditor.open()
    });

  }

  closeEditor() {
    this.polyEditor.close()
  }



}
