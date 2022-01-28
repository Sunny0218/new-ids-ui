import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Janus from '../../../assets/janus/janus.js';
import adapter from 'webrtc-adapter'; 

@Injectable()
export class CctvStreamingService {

  streamingPlugin:any = null; //定义streaming插件
  server = environment.janusServer +'/janus'; //Janus服务器
  // server = 'wss://janus.conf.meetecho.com/ws';
  // opaqueId = "streamingtest-"+Janus.randomString(12);  //随机生成插件唯一id
  janus:any = null; //定义janus变量
  stream:any = null; //定义接收的直播流资源
  status:any = null; //定义直播流状态信息
  error:any = null; //定义直播流错误信息
  element:any = null;


  constructor() { }

  //初始化Janus
  janusInit(element:any,selectedStream:any) {
    Janus.init({
      debug:"all",
      dependencies: Janus.useDefaultDependencies({ adapter }),
      callback: () => {
        this.connectServer(this.server,element,selectedStream)
      }
    })

  };

  //创建janus实例/session
  connectServer(server:any,element:any,selectedStream:any) {
    this.janus = new Janus({
      server,
      success: () => {
        this.attachPlugin(element,selectedStream);
      },
      error: (error:any) => {
        this.onError('Failed to connect to janus server', error);
      },
      destroyed: () => {
        window.location.reload();
      }
    })

  };

  //连接到streaming插件
  attachPlugin(element:any,selectedStream:any) {
     // Attach to Streaming plugin
    this.janus.attach({

      //绑定janus的streaming插件
      plugin: "janus.plugin.streaming",
      //随机值，插件的唯一ID
      opaqueId: "streamingtest-" + Janus.randomString(12),

      //attch方法执行成功后回调的函数
      success: (pluginHandle:any) => {
        this.streamingPlugin = pluginHandle;
        this.startStream(selectedStream);
      },
      //attach方法执行失败后的回调函数
      error: (error:any) => {
        Janus.error(error);
        this.onError('Error attaching plugin... ', error)
      },
      //可以通过该函数更新ICE状态
      iceState: (state:any) => {
        console.log("ICE state changed to " + state);
      },
      //更改WebRTC状态的回调函数
      webrtcState: (on:any) => {
        console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
      },
      //收到事件消息的回调函数
      onmessage: (msg:any,jsep:any) => {
        if (msg && msg.result) {
          const result = msg.result;
          if (result.status) {
            var status = result.status;
            this.status = status;
            console.warn('Status:',this.status);
            // if (status === 'stopped') {
            //   this.stopStream();
            // }
          }
        } else if (msg && msg.error) {
          this.onError(msg.error);
          this.stopStream();
        };

        if (jsep) {
          console.log("Handling SDP as well...", jsep);
          let stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
          this.streamingPlugin.createAnswer({
            jsep: jsep,
            // We want recvonly audio/video and, if negotiated, datachannels
            // 我们只需要接收音频/视频，如果协商，还需要数据通道
            media: { audioSend: false, videoSend: false, data: true },
            customizeSdp: ( jsep:any ) => {
              if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                // Make sure that our offer contains stereo too
                jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
              }
            },
            success: (jsep:any) => {
              console.log("Got SDP!", jsep);
              var body = { request: "start" };
              this.streamingPlugin.send({ message: body, jsep: jsep });
            },
            error: (error) => {
              this.onError("WebRTC error:", error);
            }
          });

        }
      },
      //收到直播流时的回调函数,并将传递直播流资源
      onremotestream: (stream:any) => {
        console.log(" ::: Got a remote stream :::", stream);
        this.attachMediaStream(element,stream);
      },

      oncleanup: () => {
        this.onCleanup();
      }

    })
  };


  //获得直播流信息
  getStreamInfo(selectedStream:any) {
    var body = { request: "info", id: parseInt(selectedStream) || selectedStream };
    this.streamingPlugin.send({ message: body, success: (result:any) => {
    }});
  };

  //开始直播流
  startStream(selectedStream:any) {
    console.log("Selected video id #" + selectedStream);
    var body = {  request: "watch", id: parseInt(selectedStream) || selectedStream }
    this.streamingPlugin.send({ message: body });

    this.getStreamInfo(selectedStream);
  };

  //停止直播流
  stopStream() {
    console.log(":::streamingPlugin:::",this.streamingPlugin);
    if(this.streamingPlugin) {
      var body = { request: "stop" };
      this.streamingPlugin.send({ message: body });
      this.streamingPlugin.hangup();
      this.onCleanup();
    } else return
  };

  //接收直播流资源
  attachMediaStream(element:any,stream:any) {
    if (stream.active) {
      console.log(":::STREAM::::",stream);
      this.stream = stream;
      this.SwitchSrc(element,stream)
    } else {
      this.stream = null;
    }
  };

  //清空直播流资源、直播状态、错误信息
  onCleanup() {
    this.stream = null
    this.status = null
    this.error = null
    this.element = null
  };

  //错误消息提示
  onError(message, error='') {
    this.error = message + error;
  };
  
    //video element 更换stream
    SwitchSrc(element:any,stream = this.stream) {
      try {
        element.srcObject = stream;
      } catch (e) {
        try {
          element.src = URL.createObjectURL(stream);
        } catch (e) {
          console.error("Error attaching stream to element");
        }
      }
    } 
  

  //异步获取直播流资源
  async getStream () {
    if( this.stream) return this.stream;
  }


}
