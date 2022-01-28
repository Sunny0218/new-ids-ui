import { Component, OnInit } from '@angular/core';
import Janus from '../../../assets/janus/janus.js'
import adapter from 'webrtc-adapter'; 
import videojs from 'video.js';
import 'videojs-vr/dist/videojs-vr.js';

@Component({
  selector: 'app-vr-view',
  templateUrl: './vr-view.component.html',
  styleUrls: ['./vr-view.component.css']
})
export class VrViewComponent implements OnInit {

  private player:any;
  private readonly config: any;

  constructor() { 
    this.config = {
      controls: true,
      autoplay: false,
      fluid: true,
      loop: false,
      techOrder: ['html5']
    };
  }

  ngOnInit(): void {

  }

  vrScreaming() {
    var server = 'http://192.168.32.90:8088/janus';
    // var server = 'wss://janus.conf.meetecho.com/ws';
    var streaming:any = null;
    var opaqueId = "streamingtest-"+Janus.randomString(12);
    var bitrateTimer:any = null;
    var spinner:any = null;
    var simulcastStarted:boolean = false;
    var svcStarted = false;
    var janus:any = null;
    var selectedStream = "3";
    var that = this;
    const setupDeps = () => Janus.useDefaultDependencies({ adapter });

    Janus.init({debug: "all",dependencies: setupDeps(), callback: function() {
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

                  console.warn(" ::: Got a remote stream :::", stream);
                  // let video = '<video autoplay muted controls id="remotevideo" width="100%" poster="../../../assets/ids_place_holder.jpg">'+'</video>'
                  // let scream:any = document.getElementById('scream');
                  // scream.innerHTML = video
                  
                  let videoElement = document.getElementById('remotevideo')
                  attachMediaStream(videoElement, stream)
                  
                  // that.player = videojs('vrScream', that.config, () => {
                  //     console.log('Using video.js ' + videojs.VERSION);
                  //     that.player.vr({projection: '360', sphereDetail: 48});
                  // }); 
                  // that.playerBindId()
                
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

  // 捕捉视频流到video.src上
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

  ngAfterViewInit(): void {
    this.player = videojs('vrScream',this.config, () => {
      console.log('Using video.js ' + videojs.VERSION);
      // this.player.src("https://cdn-au.metacdn.com/jumipqxo/1u2Jh28/20160823050905_file_id14719289501962016_08_08_08_22_16_er_MP4-HIGH-WEBM_VP9.webm")
       this.player.src("src/assets/images/360view.jpg")
      this.player.vr({projection: '360'})
    })
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

}
