import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Janus from '../../../assets/janus/janus.js';
import adapter from 'webrtc-adapter'; 
import videojs from 'video.js';
import 'videojs-vr/dist/videojs-vr.js';
declare var pannellum: any;
import { VrStreamingService } from 'src/app/common/remote/vr-streaming.service'

@Component({
  selector: 'app-vr-view',
  templateUrl: './vr-view.component.html',
  styleUrls: ['./vr-view.component.css'],
  providers:[VrStreamingService]
})
export class VrViewComponent implements OnInit {

  private player:any;
  private readonly config: any;
  

  constructor(
    private vrStreamingSrv: VrStreamingService
  ) { 
    this.config = {
      controls: false,
      autoplay: true,
      fluid: true,
      loop: false,
      poster:'../../../assets/images/background//ids_place_holder.jpg',
      techOrder: ['html5'],
    };
    
    
  }

  ngOnInit(): void {
    this.loadVrVideo();
  }

  // vrScreaming() {
  //   var server = environment.janusServer +'/janus';
  //   // var server = 'wss://janus.conf.meetecho.com/ws';
  //   var streaming:any = null;
  //   var opaqueId = "streamingtest-"+Janus.randomString(12);
  //   var bitrateTimer:any = null;
  //   var spinner:any = null;
  //   var simulcastStarted:boolean = false;
  //   var svcStarted = false;
  //   var janus:any = null;
  //   var selectedStream = "3";
  //   var that = this;
  //   const setupDeps = () => Janus.useDefaultDependencies({ adapter });

  //   Janus.init({debug: "all",dependencies: setupDeps(), callback: function() {
  //       // Make sure the browser supports WebRTC
  //     if(!Janus.isWebrtcSupported()) {
  //       alert("No WebRTC support... ");
  //       return;
  //     }
  //     // Create session
  //     janus = new Janus(
  //       {
  //         server: server,
  //         success: function() {

  //           // Attach to Streaming plugin
  //           janus.attach(
              
  //             {
  //               //绑定janus的streaming插件
  //               plugin: "janus.plugin.streaming",
  //               //随机值，插件的唯一ID
  //               opaqueId: opaqueId,

  //               //attch方法执行成功后回调的函数
  //               success: function(pluginHandle:any) {
  //                 streaming = pluginHandle;
  //                 startStream();
  //               },
  //               //attach方法执行失败后的回调函数
  //               error: function(error:any) {
  //                 console.error("  -- Error attaching plugin... ", error);
  //               },
  //               //可以通过该函数更新ICE状态
  //               iceState: function(state:any) {
  //                 console.log("ICE state changed to " + state);
  //               },
  //               //更改WebRTC状态的回调函数
  //               webrtcState: function(on:any) {
  //                 console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
  //               },
  //               //收到事件消息的回调函数
  //               onmessage: function(msg:any, jsep:any) {
  //                 console.log(" ::: Got a message :::", msg);
  //                 var result = msg["result"];
  //                 console.log('onmessag:',msg)
  //                 if(result) {
  //                   if(result["status"]) {
  //                     var status = result["status"];
  //                   } else if(msg["streaming"] === "event") {
  //                     // Is simulcast in place?
  //                     var substream = result["substream"];
  //                     var temporal = result["temporal"];
  //                     if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
  //                       if(!simulcastStarted) {
  //                         simulcastStarted = true;
  //                         // addSimulcastButtons(remoteFeed.videoCodec === "vp8");
  //                       }
  //                       // We just received notice that there's been a switch, update the buttons
  //                       // updateSimulcastButtons(substream, temporal);
  //                     }
  //                     // Is VP9/SVC in place?
  //                     var spatial = result["spatial_layer"];
  //                     temporal = result["temporal_layer"];
  //                     if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
  //                       if(!svcStarted) {
  //                         svcStarted = true;
  //                         // addSvcButtons();
  //                       }
  //                       // We just received notice that there's been a switch, update the buttons
  //                       // updateSvcButtons(spatial, temporal);
  //                     }
  //                   }
  //                 } else if(msg["error"]) {
  //                   console.error(msg["error"]);
  //                   stopStream();
  //                   return;
  //                 }
  //                 if(jsep) {
  //                   console.log("Handling SDP as well...", jsep);
  //                   var stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
  //                   // Offer from the plugin, let's answer
  //                   streaming.createAnswer(
  //                     {
  //                       jsep: jsep,
  //                       // We want recvonly audio/video and, if negotiated, datachannels
  //                       media: { audioSend: false, videoSend: false, data: true },
  //                       customizeSdp: function(jsep:any) {
  //                         if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
  //                           // Make sure that our offer contains stereo too
  //                           jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
  //                         }
  //                       },
  //                       success: function(jsep:any) {
  //                         console.log("Got SDP!", jsep);
  //                         var body = { request: "start" };
  //                         streaming.send({ message: body, jsep: jsep });
  //                       },
  //                       error: function(error:any) {
  //                         console.error("WebRTC error:", error);
  //                       }
  //                     });
  //                 }
  //               },
  //               //收到远端流时的回调函数
  //               onremotestream: function(stream:any) {

  //                 console.warn(" ::: Got a remote stream :::", stream);
  //                 // let video = '<video autoplay muted controls id="remotevideo" width="100%" poster="../../../assets/ids_place_holder.jpg">'+'</video>'
  //                 // let scream:any = document.getElementById('scream');
  //                 // scream.innerHTML = video
                  
  //                 let videoElement = document.getElementById('vrScream')
  //                 attachMediaStream(videoElement, stream)
                  
  //                 that.player = videojs('vrScream', that.config, () => {
  //                     console.log('Using video.js ' + videojs.VERSION);
  //                     that.player.vr({projection: '360', sphereDetail: 48});
  //                 }); 
  //                 // that.playerBindId()
                
  //                 var videoTracks = stream.getVideoTracks();
  //                 if(!videoTracks || videoTracks.length === 0)
  //                 return;
  //               },

  //               ondataopen: function(data:any) {
  //                 console.log("The DataChannel is available!");
  //               },

  //               ondata: function(data:any) {
  //                 // Janus.debug("We got data from the DataChannel!", data);
  //               },
  //               //销毁时的回调函数
  //               oncleanup: function() {
  //                 console.log(" ::: Got a cleanup notification :::");
  //                 stopStream()
  //               }
  //             });
  //         },
  //         error: function(error:any) {
  //           console.error(error);
  //             // window.location.reload();
  //         },
  //         destroyed: function() {
  //           // window.location.reload();
  //         }
  //       });
  //   }});

  
  // function getStreamInfo() {
  //   // Send a request for more info on the mountpoint we subscribed to
  //   var body = { request: "info", id: parseInt(selectedStream) || selectedStream };
  //   streaming.send({ message: body, success: function(result:any) {
  //   }});
  // }
  
  // function startStream() {
  //   console.log("Selected video id #" + selectedStream);
  //   var body = { request: "watch", id: parseInt(selectedStream) || selectedStream};
  //   streaming.send({ message: body });
  //   getStreamInfo();
  // }
  
  // function stopStream() {
  //   var body = { request: "stop" };
  //   streaming.send({ message: body });
  //   streaming.hangup();
  
  // }

  // // 捕捉视频流到video.src上
  // function attachMediaStream(element:any, stream:any) {
  //   try {
  //     element.srcObject = stream;
  //   } catch (e) {
  //     try {
  //       element.src = URL.createObjectURL(stream);
        
  //     } catch (e) {
  //       console.error("Error attaching stream to element");
  //     }
  //   }
  // };
  // }

  ngAfterViewInit(): void {
  
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
    this.vrStreamingSrv.stopStream();
  }

  loadVrVideo() {
    // let that = document;
    // this.pannellumPlugin(videojs,pannellum,that);
    // this.player = videojs('vrScream',this.config, () => {
    //   console.log('Using video.js ' + videojs.VERSION);
    //   this.player.src("https://pannellum.org/images/video/jfk.webm")
    //   this.player.src("https://cdn-au.metacdn.com/jumipqxo/1u2Jh28/20160823050905_file_id14719289501962016_08_08_08_22_16_er_MP4-HIGH-WEBM_VP9.webm")
    //   this.player.vr({projection: '360'})
    //   this.player.pannellumView()
    // })

    let vrVideoElement = document.getElementById('vrScream');
    this.vrStreamingSrv.janusInit(vrVideoElement,3);
    this.player = videojs('vrScream',this.config, () => {
      console.log('Using video.js ' + videojs.VERSION);
      this.player.vr({projection: '360', sphereDetail: 48});
    //   this.player.vr().on('initialized', () => {
    //     this.player.vr().camera.position.x = 0;
    //     this.player.vr().camera.position.y = 360;
    // });
      this.player.vr().cameraVector;
    })
  }
  
  pannellumPlugin(videojs:any, pannellum:any, document?:any) {
    var registerPlugin = videojs.registerPlugin || videojs.plugin;
    registerPlugin('pannellumView', function(config:any) {
      // Create Pannellum instance
      var player:any = this;
      var container = player.el();
      var vid = container.getElementsByTagName('video')[0],
          pnlmContainer = document.createElement('div');
      pnlmContainer.style.zIndex = '0';
      config = config || {};
      config.type = 'equirectangular';
      config.dynamic = true;
      config.showZoomCtrl = false;
      config.showFullscreenCtrl = false;
      config.autoLoad = true;
      config.panorama = vid;
      pnlmContainer.style.visibility = 'hidden';
      player.pnlmViewer = pannellum.viewer(pnlmContainer, config);
      container.insertBefore(pnlmContainer, container.firstChild);
      vid.style.display = 'none';
  
      // Handle update settings
      player.on('play', function() {
          if (vid.readyState > 1)
              player.pnlmViewer.setUpdate(true);
      });
      player.on('canplay', function() {
          if (!player.paused())
              player.pnlmViewer.setUpdate(true);
      });
      player.on('pause', function() {
          player.pnlmViewer.setUpdate(false);
      });
      player.on('loadeddata', function() {
          pnlmContainer.style.visibility = 'visible';
      });
      player.on('seeking', function() {
          if (player.paused())
              player.pnlmViewer.setUpdate(true);
      });
      player.on('seeked', function() {
          if (player.paused())
              player.pnlmViewer.setUpdate(false);
      });
  }); 
  }

}
