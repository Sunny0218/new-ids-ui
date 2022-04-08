import { Component, OnInit,HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonPanelService } from '../common-panel.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import Janus from '../../../assets/janus/janus.js';
import adapter from 'webrtc-adapter'; 
import { DomSanitizer } from '@angular/platform-browser';
import { JanusStreamingService } from 'src/app/common/remote/janus-streaming.service';
import { CctvStreamingService } from 'src/app/common/remote/cctv-streaming.service'

@Component({
  selector: 'app-fpv-panel',
  templateUrl: './fpv-panel.component.html',
  styleUrls: ['./fpv-panel.component.css'],
  providers:[CommonPanelService,JanusStreamingService,CctvStreamingService]
})
export class FpvPanelComponent implements OnInit {

  @HostListener('window:keydown',['$event']) spaceEvent(event:any) {
    // up,gimbal参数增加,即镜头向上
    if(event.keyCode === 38) {
      if(event.preventDefault) {
        event.preventDefault();
      }
      if (this.pitchValue < 20) {
        this.pitchValue++;
      }
      this.pitchSlider();
    // down,gimbal参数减少,即镜头向下
    } else if (event.keyCode === 40) {
      if(event.preventDefault) {
        event.preventDefault();
      }
      if (this.pitchValue > -90) {
        this.pitchValue--;
      }
      this.pitchSlider();
    // left,gimbal逆时针旋转10°
    } else if (event.keyCode === 37) {
      this.yaw_rotate_left();
    // right,gimbal顺时针旋转10°
    } else if (event.keyCode === 39) {
      this.yaw_rotate_right();
    }
  }

  //机器编号
  drone_ref_num: string;
  airport_ref_num: string;

  batteryLevel:number = 0;
  isFlying: boolean = false;
  showToolbar:boolean = false;

  // cctvStream = window.origin+"/janus/cctv.html";
  cctvStream = "http://192.168.32.90/janus/cctv.html";
  safeCctvUrl:any;

  videoTitle:String = "Drone"
  droneVideoSrc:any = null;
  cctvVideoSrc:any = null;
  switchSrcFlat:boolean = true;

  droneVideoElement:any = null;
  cctvVideoElement:any = null;

  //定频上报的属性Topic(osd)
  osdTopic:string = 'thing/product/mavic2/osd';

  //订阅获取无人机、遥控状态主题
  subTopic:string;
  //发布转化摄像模式主题
  pubTopic:string;
  //订阅获取回馈消息主题
  commandTopic:string;

  //gimbal上下范围参数
  pitchValue:number = 0;

  //无人机摄像模式列表
  modeList = [
    {
      mName: 'VO', 
      mode:'VISUAL_ONLY'
    },
    {
      mName: 'TO', 
      mode:'THERMAL_ONLY'
    },
    {
      mName: 'PIP', 
      mode:'PIP'
    }];

  //定义镜头模式默认参数
  modeCommand: any = {
    "jsonrpc" : "2.0",
    "id" : "",
    "method" : "CameraLensSetDisplayMode",
    "params" : {"Display_Mode": "VISUAL_ONLY"}
  };

  //定义gimbal默认参数
  gimbalCommand:any = {
    "jsonrpc" : "2.0",
    "id" : "",
    "method" : "GimbalRotate",
    "params" : {"Pitch": "0.0","Yaw":"0.0"}
  };

  private droneSubscription = new Subscription();
  private commandSubscription = new Subscription();
  private osdSubscription = new Subscription();

  constructor( 
    private commonSvc: CommonPanelService,
    private mqttSvc: MqttService,
    private sanitizer: DomSanitizer,
    private droneStreamingSrv: JanusStreamingService,
    private cctvStreamingSrv: CctvStreamingService,
    ) { }

  ngOnInit(){
    this.droneVideoElement = document.getElementById('drone');
    this.cctvVideoElement = document.getElementById('cctv-small');
    this.fetchRefNum();
    // this.droneScreaming();
    this.safeCctvUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.cctvStream);
    // this.getVideoElement();
    this.attachMediaStream();
    // this.getStatusByOsd();
  }

  ngOnDestroy(): void {
    this.droneSubscription.unsubscribe();
    this.commandSubscription.unsubscribe();
    this.osdSubscription.unsubscribe();
    this.droneStreamingSrv.stopStream();
    this.cctvStreamingSrv.stopStream();
  }

  //通过commonSvc异步获取机器编号
  private async fetchRefNum() {
    const data = await this.commonSvc.getRequest( environment.apiHost + "/robots").toPromise();
    if( data['data'] ){
      var resp = data['data'];
      resp.forEach( e => {
        if(e['type']==='DRONE'){
          this.drone_ref_num = e['ref_num'];
        } else if(e['type']==='AIRPORT'){
          this.airport_ref_num = e['ref_num'];
        }
      });

      if (this.drone_ref_num != null) {
        this.subTopic = 'drone/'+this.drone_ref_num+'/status';
        this.pubTopic = 'drone/'+this.drone_ref_num+'/rpc/send';
        this.commandTopic = 'drone/'+this.drone_ref_num+'/rpc/recv';
        this.mqttGetDroneStatus();
        this.mqttCommandRsp();
      }
    }
  }

  //通过mqtt获取无人机和遥控状态
  mqttGetDroneStatus() {
    this.droneSubscription = this.mqttSvc.observe(this.subTopic).subscribe((message:IMqttMessage) => {
      let item = JSON.parse(message.payload.toString());

      this.batteryLevel = item['batteryLevel'];
      this.isFlying = item['isFlying'];
    })
  }

  //订阅osd定频获得设备状态
  getStatusByOsd() {
    this.osdSubscription = this.mqttSvc.observe(this.osdTopic).subscribe((message:IMqttMessage) => {
      let item = JSON.parse(message.payload.toString());
      let { data } = item
      console.log(data['battery']['capacity_percent']);
      console.log(data['height']);
    })
  }

  //转换镜头模式开关
  modeSwitch(mode:any) {
    this.modeCommand['id'] = "ids-" + new Date().getTime();
    this.modeCommand['params']['Display_Mode'] = mode;
    var message = JSON.stringify(this.modeCommand);
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal上下范围
  pitchSlider() {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Pitch'] = this.pitchValue;
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal逆时针旋转10°
  yaw_rotate_left() {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Yaw'] = '-10';
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal顺时针旋转10°
  yaw_rotate_right() {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Yaw'] = '10';
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe(); 
  }

  //获取回馈消息
  mqttCommandRsp() {
    this.commandSubscription = this.mqttSvc.observe(this.commandTopic).subscribe( (message:IMqttMessage) => {
      let item = JSON.parse(message.payload.toString());
      console.log(item)
    })
  }

  // Janus Drone 直播串流
  droneStreaming() {
    var server = environment.janusServer +'/janus';
    // var server = 'https://ids.hdcircles.tech' + ':8089'+ '/janus'
    // var server = 'wss://janus.conf.meetecho.com/ws';
    var streaming:any = null;
    var opaqueId = "streamingtest-"+Janus.randomString(12);
    var bitrateTimer:any = null;
    var spinner:any = null;
    var simulcastStarted:boolean = false;
    var svcStarted = false;
    var janus:any = null;
    var selectedStream = "1";
    var that = this;
    const setupDeps = () => Janus.useDefaultDependencies({ adapter });
    
    Janus.init({
      debug: "all",
      dependencies: setupDeps(), 
      callback: function() {
        // Make sure the browser supports WebRTC
      if(!Janus.isWebrtcSupported()) {
        alert("No WebRTC support... ");
        return;
      }
      // Create session
      janus = new Janus(
        {
          server: server,
          success: function() {
            // Attach to Streaming plugin
            janus.attach(
              {
                //绑定janus的streaming插件
                plugin: "janus.plugin.streaming",
                //随机值，插件的唯一ID
                opaqueId: opaqueId,

                //attch方法执行成功后回调的函数
                success: function(pluginHandle:any) {
                  streaming = pluginHandle;
                  startStream();
                },
                //attach方法执行失败后的回调函数
                error: function(error:any) {
                  console.error("  -- Error attaching plugin... ", error);
                },
                //可以通过该函数更新ICE状态
                iceState: function(state:any) {
                  console.log("ICE state changed to " + state);
                },
                //更改WebRTC状态的回调函数
                webrtcState: function(on:any) {
                  console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                },
                //收到事件消息的回调函数
                onmessage: function(msg:any, jsep:any) {
                  console.log(" ::: Got a message :::", msg);
                  var result = msg["result"];
                  console.log('onmessag:',msg)
                  if(result) {
                    if(result["status"]) {
                      var status = result["status"];
                      console.warn('Status:',status);
                      
                    } else if(msg["streaming"] === "event") {
                      // Is simulcast in place?
                      var substream = result["substream"];
                      var temporal = result["temporal"];
                      if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                        if(!simulcastStarted) {
                          simulcastStarted = true;
                          // addSimulcastButtons(remoteFeed.videoCodec === "vp8");
                        }
                        // We just received notice that there's been a switch, update the buttons
                        // updateSimulcastButtons(substream, temporal);
                      }
                      // Is VP9/SVC in place?
                      var spatial = result["spatial_layer"];
                      temporal = result["temporal_layer"];
                      if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
                        if(!svcStarted) {
                          svcStarted = true;
                          // addSvcButtons();
                        }
                        // We just received notice that there's been a switch, update the buttons
                        // updateSvcButtons(spatial, temporal);
                      }
                    }
                  } else if(msg["error"]) {
                    console.error(msg["error"]);
                    // stopStream();
                    return;
                  }
                  if(jsep) {
                    console.log("Handling SDP as well...", jsep);
                    var stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                    // Offer from the plugin, let's answer
                    streaming.createAnswer(
                      {
                        jsep: jsep,
                        // We want recvonly audio/video and, if negotiated, datachannels
                        media: { audioSend: false, videoSend: false, data: true },
                        customizeSdp: function(jsep:any) {
                          if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                            // Make sure that our offer contains stereo too
                            jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                          }
                        },
                        success: function(jsep:any) {
                          console.log("Got SDP!", jsep);
                          var body = { request: "start" };
                          streaming.send({ message: body, jsep: jsep });
                        },
                        error: function(error:any) {
                          console.error("WebRTC error:", error);
                        }
                      });
                  }
                },
                //收到远端流时的回调函数
                onremotestream: function(stream:any) {
                  console.log(" ::: Got a remote stream :::", stream);
                  // let video = '<video autoplay muted controls id="remotevideo" width="100%" poster="../../../assets/ids_place_holder.jpg">'+'</video>'
                  // let scream:any = document.getElementById('scream');
                  // scream.innerHTML = video
                  let videoElement = document.getElementById('drone')
                  attachMediaStream(videoElement, stream);
                  var videoTracks = stream.getVideoTracks();
                  if(!videoTracks || videoTracks.length === 0)
                  return;
                },

                ondataopen: function(data:any) {
                  console.log("The DataChannel is available!");
                },

                ondata: function(data:any) {
                  // Janus.debug("We got data from the DataChannel!", data);
                },

                //销毁时的回调函数
                oncleanup: function() {
                  console.log(" ::: Got a cleanup notification :::");
                  stopStream()
                }
              });
          },
          error: function(error:any) {
            console.error(error);
              // window.location.reload();
          },
          destroyed: function() {
            // window.location.reload();
          }
        });
    }});


  function getStreamInfo() {
    // Send a request for more info on the mountpoint we subscribed to
    var body = { request: "info", id: parseInt(selectedStream) || selectedStream };
    streaming.send({ message: body, success: function(result:any) {
    }});
  }
  
  function startStream() {
    console.log("Selected video id #" + selectedStream);
    var body = { request: "watch", id: parseInt(selectedStream) || selectedStream};
    streaming.send({ message: body });
 

    getStreamInfo();
  }
  
  function stopStream() {
    var body = { request: "stop" };
    streaming.send({ message: body });
    streaming.hangup();
  
  }
  // 捕捉视频流到video元素上
  function attachMediaStream(element:any, stream:any) {
    try {
      console.log(":::STREAM::::",stream);
      element.srcObject = stream;
      that.showToolbar = true;
    } catch (e) {
      try {
        element.src = URL.createObjectURL(stream);
      } catch (e) {
        console.error("Error attaching stream to element");
      }
    }
  };
  }


  // 接收直播流资源 To Do:异步处理  ----- 旧方法
 getVideoElement() {
  setTimeout( () => {
    // this.droneStreamingSrv.getStream().then( stream => {
    //   if(stream) {
    //     this.droneVideoSrc = stream;
    //     this.showToolbar = true;
    //   } else {
    //     this.droneVideoSrc = null;
    //   }    
    // });
    this.cctvStreamingSrv.getStream().then( stream => {
      if(stream) {
        this.cctvVideoSrc = stream;
      } else {
        this.cctvVideoSrc = null;
      }  
    })
  },3000)  
 }

 // 初始化Janus服务,并传VidelElement和StreamingId
 attachMediaStream() {
  this.droneStreamingSrv.janusInit(this.droneVideoElement,1);
  this.cctvStreamingSrv.janusInit(this.cctvVideoElement,2);
  this.showToolbar = true;
};

//转换Video Scream 资源 
switchVideoSrc() {
  if (!this.switchSrcFlat) {
    this.videoTitle = "DRONE";
    this.droneStreamingSrv.SwitchSrc(this.droneVideoElement);
    this.cctvStreamingSrv.SwitchSrc(this.cctvVideoElement);
    this.switchSrcFlat = !this.switchSrcFlat;
   } else {
    this.videoTitle = "CCTV";
    this.droneStreamingSrv.SwitchSrc(this.cctvVideoElement);
    this.cctvStreamingSrv.SwitchSrc(this.droneVideoElement);
    this.switchSrcFlat = !this.switchSrcFlat;
   }
}
}
