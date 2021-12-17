import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonPanelService } from '../common-panel.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import Janus from '../../../assets/janus/janus.js';
import adapter from 'webrtc-adapter'; 

@Component({
  selector: 'app-airport-panel',
  templateUrl: './airport-panel.component.html',
  styleUrls: ['./airport-panel.component.css'],
  providers:[CommonPanelService]
})
export class AirportPanelComponent implements OnInit,OnDestroy {

  // 机器编号
  airport_ref_num:string;
  drone_ref_num:string;

  // 无人机状态
  droneBatteryLevel :number = 0;
  droneDownloadingState :string = "NOT DOWNLOADING"; 
  rcSwitchState :string = "OFF";
  droneSwitchState :string = "OFF";
  droneFlyingState :string = "NOT FLYING";

  // 机场状态
  holderState :string = "RELEASE"; 
  chargerState :string = "UNKNOWN"; 
                                        

  // 无人机button状态显示
  droneSwitchBtnLabel :string = "UNKNOWN";
  rcSwitchBtnLabel :string = "UNKNOWN";
  droneFlyingBtnLabel :string = "TAKE OFF";

  //机场button状态显示
  chargerBtnLabel :string = "UNKNOWN"; 
  holderBtnLabel :string = "LOCK"; 
  
  // 是否禁止无人机button
  rcSwitchBtnBusy :boolean = true;
  droneSwitchBtnBusy :boolean = true; 
  takeOffBtnBusy :boolean = true;
 
  // 是否禁止机场button
  chargerBtnBusy :boolean = true;
  holderBtnBusy :boolean = true; 

  //订阅主题
  subTopic:string;
  pollInterval: any;
  heartBeatInterval:any;

  appHeartBeat = 0;
  setHeartBeat = 0;

  private mqttSubscription = new Subscription();

  constructor( 
    private commonSvc:CommonPanelService,
    private mqttSvc:MqttService,
    ) { }

  ngOnInit(): void {
    this.fetchRefNum();
    this.cctvScreaming();
  }

  ngOnDestroy(): void {
    this.mqttSubscription.unsubscribe();
    if(this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    if(this.heartBeatInterval) {
      clearInterval(this.heartBeatInterval)
    }
  }

  //通过commonSvc异步获取机器编号
  private async fetchRefNum(){
    const data = await this.commonSvc.getRequest(environment.apiHost + "/robots").toPromise();
    if(data['data']){
      var res=data['data']
      res.forEach(row => {
        if(row['type']==='DRONE'){          
          this.drone_ref_num = row['ref_num'];
        } else if(row['type']==='AIRPORT'){
          this.airport_ref_num = row['ref_num'];
        }
      });
      
      this.subTopic = 'drone/' + this.drone_ref_num + '/status'; 
      this.mqttGetDroneStatus();

      //轮询机场状态
      this.pollInterval = setInterval(() => {
        this.getAirportStatus();
      }, 1000);
    }
  }

  //通过mqtt获取无人机和遥控状态
  mqttGetDroneStatus() {
    this.mqttSubscription = this.mqttSvc.observe(this.subTopic).subscribe( (message:IMqttMessage) => {
      let heartBeat = new Date().getTime();
      this.appHeartBeat = heartBeat;
      let item = JSON.parse(message.payload.toString());

      this.droneBatteryLevel = item['batteryLevel'];
      this.droneDownloadingState = item['isDownloadingMedia'] == false ? "NOT DOWNLOADING" : "DOWNLOADING";
      this.rcSwitchState = item['isRcOn'] == false ? "OFF" : "ON";

      if(item['isRcOn'] == true){
        this.droneSwitchState = item.isAcOn == false ? "OFF" : "ON";
        this.droneSwitchBtnBusy = this.holderState == "RELEASE";
      } else {
        this.droneSwitchState = "OFF";
        this.droneSwitchBtnBusy = true; 
      }

      this.droneFlyingState = item['isFlying'] == false ? "NOT FLYING" : "FLYING";
      this.rcSwitchBtnLabel = this.rcSwitchState == "ON" ? "Turn Off" : "Turn On";
      this.droneSwitchBtnLabel = this.droneSwitchState == "ON" ? "Turn Off" : "Turn On";
      // this.droneFlyingBtnLabel = "TAKE OFF";
      this.rcSwitchBtnBusy = this.droneFlyingState == "FLYING";
    });
    this.heartBeatInterval = setInterval( () => {
      this.checkAppIsAlive();
    },1000)
  }

  //定时检查APP心跳
  checkAppIsAlive() {
    this.setHeartBeat = new Date().getTime();
    let timeDiff = Math.abs(this.setHeartBeat - this.appHeartBeat);

    if (timeDiff > 2000) {
      this.droneBatteryLevel = -1;
      this.droneDownloadingState = "NOT DOWNLOADING";
      this.rcSwitchState = "OFF";
      this.droneFlyingState = "NOT FLYING";
      this.rcSwitchBtnLabel = "UNKNOWN";
      this.droneSwitchBtnLabel = "UNKNOWN";
      this.rcSwitchBtnBusy = true;
      this.droneSwitchBtnBusy = true;
    }
  }

  //获取机场状态
  getAirportStatus() {
    this.commonSvc.getRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/status" ).subscribe( (data:JSON) => {
      try {
        const resData = data['data'];
        // if( data['code'] !== 100 ) {
        //   throw new SyntaxError("Please activate the Airport");
        // }
        this.chargerState = resData['charger_status'] == "UNCHARGED" ? "UNCHARGED" : "CHARGING",
        this.holderState = resData['drone_holder_status'] == "FIXED" ? "LOCKED" : "RELEASE",
        
        this.chargerBtnLabel = this.chargerState == "UNCHARGED" ? "START CHARGE" : "STOP CHARGE",
        this.holderBtnLabel = this.holderState == "LOCKED" ? "RELEASE" : "LOCK";
        
        this.chargerBtnBusy = this.holderState == "RELEASE";
        this.holderBtnBusy = data['code'] != 100 ; //false
        
        this.droneSwitchBtnBusy = this.holderState == "RELEASE";

      } catch (error) {
        console.error(error);
      }
    })
  }

  //机场给予无人机充电
  chargerBtn(event?: KeyboardEvent) {
    this.chargerBtnBusy = true;
    var action = "OFF";
    if (this.chargerState == "UNCHARGED") {
      action = "ON";
    }
    const data: JSON = <JSON><unknown> {
      "action": action
    };
    this.commonSvc.postRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/commands/charger", data).subscribe((data: JSON) => { });
  }

  //遥控开关
  rcSwitchBtn(event?: KeyboardEvent) {
    this.rcSwitchBtnBusy = true;
    var action = "OFF";
    // if (this.rcSwitchState == "OFF") {
    //   action = "ON";
    // }
    const data: JSON = <JSON><unknown> {
      "action": action
    };
    this.commonSvc.postRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/commands/rc", data).subscribe((data: JSON) => { });
  }

  //无人机起飞 降落
  takeOffBtn(event?: KeyboardEvent) {
    this.takeOffBtnBusy = true;
    if (this.droneFlyingState == "NOT FLYING") {
      this.commonSvc.postRequest(environment.apiHost + "/robots/" + this.drone_ref_num + "/commands/takeoff", null).subscribe((data: JSON) => { });
    } else {
      const data: JSON = <JSON><unknown>{
        "set_point": 500,
        "yaw_required": true,
        "yaw_set_point": 0
      }
      this.commonSvc.postRequest(environment.apiHost + "/robots/" + this.drone_ref_num + "/commands/precise-landing", data).subscribe((data: JSON) => { });
      (async () => {
        await this.delay(300);
        this.commonSvc.postRequest(environment.apiHost + "/robots/" + this.drone_ref_num + "/commands/landing", null).subscribe((data: JSON) => { });
      })();
    }
  }

  //无人机开关
  droneSwitchBtn(event?: KeyboardEvent) {
    this.droneSwitchBtnBusy = true;
    var action = "OFF";
    if ( this.droneSwitchState == "OFF") {
      action = "ON"
    }
    const data: JSON = <JSON><unknown>{
      "action": action
    }
    this.commonSvc.postRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/commands/drone", data).subscribe((data: JSON) => { });
  }

  //机场固定装置开关
  holderBtn(event?: KeyboardEvent) {
    this.holderBtnBusy = true;
    var action = "LOCK";
    if ( this.holderState == "LOCKED" ) {
      action = "RELEASE"
    }
    const data: JSON = <JSON><unknown>{
      "action": action
    }
    this.commonSvc.postRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/commands/holder", data).subscribe((data: JSON) => { });
  }

  //强制开关功能
  airport_action(operation: string, action: string) {
    const data: JSON = <JSON><unknown>{
      "action": action
    }
    this.commonSvc.postRequest(environment.apiHost + "/airport/" + this.airport_ref_num + "/commands/" + operation, data).subscribe((data: JSON) => { });
  }

  //强制停止当前飞行任务
  force_stop_current_mission(action: boolean) {
    const data: JSON = <JSON><unknown>{
      "home": action
    }
    this.commonSvc.postRequest(environment.apiHost + "/robots/" + this.drone_ref_num + "/commands/cancel_mission", data).subscribe((data: JSON) => { });
  }

  // 设定延迟时间
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Janus CCTV 直播串流
  cctvScreaming() {
    var server = environment.janusServer +'/janus';
    // var server = 'wss://janus.conf.meetecho.com/ws';
    var streaming:any = null;
    var opaqueId = "streamingtest-"+Janus.randomString(12);
    var bitrateTimer:any = null;
    var spinner:any = null;
    var simulcastStarted:boolean = false;
    var svcStarted = false;
    var janus:any = null;
    var selectedStream = "2";
    var that = this;
    const setupDeps = () => Janus.useDefaultDependencies({ adapter });
    
    Janus.init({debug: "all",dependencies: setupDeps(), callback: function() {
      // Use a button to start the demo
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
                    stopStream();
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
                  let videoElement = document.getElementById('cctv')
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
                  return
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
      element.srcObject = stream;
    } catch (e) {
      try {
        element.src = URL.createObjectURL(stream);
      } catch (e) {
        console.error("Error attaching stream to element");
      }
    }
  };
  }
}
