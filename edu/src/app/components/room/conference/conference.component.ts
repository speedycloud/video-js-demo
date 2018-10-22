import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from "@angular/router";
import { Subscription } from 'rxjs';
import { Http } from "@angular/http";
import { RoomService } from '../../../services/room.service';
import { AlertService } from '../../../services/alert.service';

import { DomSanitizer } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

declare var PureRTC: any;
declare function attachMediaStream(canvas: any, mediaStream: any): void;
declare function attachRemoteMediaStream(canvas: any, ieStream: any, pcid: any): void;
const START_BROADCAST_CAPTION = "开始直播";
const STOP_BROADCAST_CAPTION = "停止直播";
const START_RECORD_CAPTION = "开始录制";
const STOP_RECORD_CAPTION = "结束录制";
const BACK_CAPTION = "Back";
const LEAVE_CAPTION = "退出房间";

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent implements OnInit {
  private subscription: Subscription;
  private roomItem: any = {};
  private conference: any = {};
  private subscribeMix: boolean = true;
  private isPublish = true;
  private localResolution: string = "";
  private localStream: any = {};
  private minlocalStream: any = {};
  private RemoteStreamlist: Array<any> = [];
  private conferenceId: number;
  private layoutStreams: Array<any> = [];
  private maxRemoteStreams = 9;
  private roomItemId: string = "";
  private broadcastButtonCaption = START_BROADCAST_CAPTION;
  private recordButtonCaption = START_RECORD_CAPTION;
  private leaveButtonCaption = LEAVE_CAPTION;
  private joined = false;
  private iceTransportPolicy: any = "all";
  
  private white_url:any;
  private unsafe_url: string = "";
  private role: string = "";
  private uuid = UUID.UUID();
  
  
  
  constructor(
    private http: Http,
    private router: Router,
    private alertService: AlertService,
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private sanitizer : DomSanitizer


            ) { }
  data_item;
  dataItem;
  resceive;
  send_msg;
  list = [];
  resols = {
      'uhd_4k': {width:"3840", height: "2160"},         // maxbw 8000 own
      'hd1080p': {width:"1920", height: "1080"},        // maxbw 4000
      'hd720p': {width:"1280", height: "720"},          // maxbw 2000
      'xga': {width:"1024", height: "768"},             // maxbw 1736
      'r720x720': {width:"720", height: "720"},         // maxbw 1500 own
      'svga': {width:"800", height: "600"},             // maxbw 1137
      'vga': {width:"640", height: "480"},              // maxbw 800
      'sif': {width:"320", height: "240"}               // maxbw 400
    };
  imgClick(eve){
    this.unsafe_url = eve;
    this.white_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafe_url);

  }
  ngOnInit() {
    this.dataItem = JSON.parse( localStorage.getItem('id') );

    console.log(this.dataItem);
      
      // console.log(this.PureRTC);
    this.localStream = {};
    this.role = localStorage.getItem('role');
    this.conference = PureRTC.ConferenceClient.create({});
    this.conferenceId = Date.now();
    this.unsafe_url = this.dataItem.white_url;
    this.white_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafe_url);
    // console.log(this.conferenceId)

    console.log('Conference created: ' + JSON.stringify(this.conference));

    this.registerEvents();
    console.log(this.activatedRoute);
    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe((param: any) => {

      if (!param['roomid']) {
        console.log("conference: room id is missing");
        this.alertService.error("room id is not specified");
        return;
      }

      this.roomItemId = param['roomid'];
      console.log(param);
      //this.localResolution = param['resolution'] || 'vga';
      this.localResolution = localStorage.getItem('localResolution')
      console.log(this.localResolution);
      this.subscribeMix = param['mixing'] ? (param['mixing'] === 'true') : true;
      console.log(this.subscribeMix)

      console.log("conference: ngOnInit: Room item id: " + this.roomItemId + ", resolution: " + this.localResolution + ", mixing: " + ((this.subscribeMix === true) ? "TRUE" : "FALSE"));


      let roomItemList = JSON.parse(localStorage.getItem('rooms'));

      for (let item of roomItemList) {
        if (item._id === this.roomItemId) {
          this.roomItem = item;
          console.log("Found room item: ", JSON.stringify(this.roomItem));
        }
      }


 
      console.log(this.roomItem)
      this.data_item = this.roomItem;
      this.roomItem.room.recording = { isStarted: false };

      console.log("conference: Joining room id: " + this.roomItemId);
    
      this.joinConference(this.roomItemId);
    });
  }
  ngOnDestroy() {
    console.log("Destroying...");
    if (this.joined) {
      try {
        this.leave();
      }
      catch (e) {
        console.log("Leave failed: ", e);
      };
    }
    this.subscription.unsubscribe();
    // reset the conference to empty object [exception on stream-added]
    this.conference = {};
  }
  private leave() {

    if (this.conference) {
      console.log("Leaving conference");

      this.conference.leave();
      for (let i in this.conference.remoteStreams) {
        if (this.conference.remoteStreams.hasOwnProperty(i)) {
          let stream = this.conference.remoteStreams[i];
          stream.close();
          if (stream.channel && typeof stream.channel.close === 'function') {
            stream.channel.close();
          }
          delete this.conference.remoteStreams[i];
        }
      }

      this.unregisterEvents();

      delete this.conference;
      console.log("Conference deleted");
    }

    if (this.localStream && typeof this.localStream.close === 'function') {
      this.localStream.close();
      this.minlocalStream.close();
      if (this.localStream.channel && typeof this.localStream.channel.close === 'function') {
        this.localStream.channel.close();
        delete this.localStream.channel;
      }

      delete this.localStream;
      delete this.minlocalStream;
      console.log("Local stream deleted");
    }

    console.log("Leave complete");
  }
  stopRecording(done_cb: Function) {
    if (!this.conference) {
      console.error("No conference is found");
      return;
    }

    this.roomItem.room.recording.isStarted = false;
    this.recordButtonCaption = START_RECORD_CAPTION;

    var options = {
      recorderId: this.roomItem.room.recording.recorderId
    }
    this.conference.stopRecorder(
      options,
      (resp: any) => {  // on success
        console.log('Recording stopped, sending download URL request');

        this.roomService.requestRecordingUrl(this.roomItem.room._id, this.roomItem.room.recording.recorderId)
          .subscribe((resp: any) => {
            console.log("Received recording URL request response: ", resp);
            done_cb();
          }, (error: any) => {
            console.log("recording URL request error: " + JSON.stringify(error));
            done_cb();
          });
      }, // on success
      function (error: any) {  // on failure
        console.log('Failed to stop recording, error: ', error);
      }
    );
  }
  startRecording() {
    console.log("Starting recording: ");

    this.conference.startRecorder(
      {}, //options. If unspecified, the mixed stream will be recorded as default.
      (resp: any) => {  // on success
        console.log("start recording success");

        this.roomItem.room.recording.isStarted = true;
        this.recordButtonCaption = STOP_RECORD_CAPTION;
        this.roomItem.room.recording.recorderId = resp.recorderId;
        this.roomItem.room.recording.path = resp.path;

        console.log("Recording: ", this.roomItem.room.recording);

      },
      function (error: any) { // on failure
        console.log("start recording error: ", error);
      }
    );
  }
  onRecord() {
    if (!this.conference) {
      console.error("No conference is found");
      return;
    }

    if (this.roomItem.room.recording.isStarted) {
      this.stopRecording(function () { });
    }
    else {
      this.startRecording();
    }
  }
  stopBroadcast(broadcast: any) {
    console.log("Stopping broadcast: ", broadcast.url + "/" + broadcast.streamId);
    this.conference.removeExternalOutput(
      broadcast.url + "/" + broadcast.streamId,
      function () {
        console.log("removeExternalOutput success");
      },
      function (err: any) {
        console.log("removeExternalOutput error: ", err);
      }
    );

    this.roomItem.room.broadcast.isLive = false;
    this.broadcastButtonCaption = START_BROADCAST_CAPTION;
  }

  startBroadcast(broadcast: any) {
    console.log("Starting broadcast: ", broadcast.url + "/" + broadcast.streamId);
    this.conference.addExternalOutput(
      broadcast.url + "/" + broadcast.streamId,
      () => {
        console.log("addExternalOutput success");
        this.roomItem.room.broadcast.isLive = true;
        this.broadcastButtonCaption = STOP_BROADCAST_CAPTION;
      },
      function (err: any) {
        console.log("addExternalOutput error: ", err);
      }
    );
  }
  onBroadcast() {

    if (!this.conference) {
      console.error("No conference is found");
      return;
    }

    let broadcast = this.roomItem.room.broadcast;
    console.log("Broadcast: ", broadcast);

    if (!broadcast) {
      return;
    }

    if (!broadcast.url) {
      console.error("Invalid broadcast URL: ", broadcast.url);
      return;
    }

    if (!broadcast.streamId) {
      console.error("Invalid broadcast stream id: ", broadcast.streamId);
      return;
    }

    if (broadcast && broadcast.isLive) {
      this.stopBroadcast(broadcast);
    }
    else {
      this.startBroadcast(broadcast);
    }
  }
  doLeave() {
    if (this.joined) {
      this.joined = false;
      try {
        this.leave();
      }
      catch (e) {
        console.log("Leave failed: ", e);
      };
    }

    //console.log("Navigating to JOIN page");
    this.router.navigate(['/room/join']);
  }

  onLeave() {

    /* stop broadcast */
    if (this.roomItem.room.broadcast && this.roomItem.room.broadcast.isLive) {
      this.stopBroadcast(this.roomItem.room.broadcast);
    }

    /* stop recording */
    if (this.roomItem.room.recording && this.roomItem.room.recording.isStarted) {
      this.stopRecording(() => {
        this.doLeave();
      });
    }
    else {
      this.doLeave();
    }
  }
  joinConference(roomId: string) {
    console.log('Joining conference');

    this.roomItem.room.broadcast.isLive = false;
    this.roomService.getToken(roomId)
      .subscribe(
        (session: any) => {
          console.log("Received room token: ", session);

          if (session.iceServers) {
            console.log("Setting ICE servers: ", JSON.stringify(session.iceServers));
            this.conference.setIceServers(session.iceServers);
          }

          /* decode the token */
          var tkn = JSON.parse(atob(session.token));
          this.roomItem.room.mediaServer = tkn.host;

          this.conference.join(session.token, (resp: any) => {
            console.log('Join conference response: ' + JSON.stringify(resp));
            this.joined = true;
            this.leaveButtonCaption = LEAVE_CAPTION;
            this.iceTransportPolicy = session.iceTransportPolicy;
            this.publish();

            /*cCan not publsih min-stream*/
            if (this.dataItem.room.enableMixing===1) {
              this.min_publish();
            }

            /* subscribe to incoming streams */
            let streams = resp.streams;
            // this.RemoteStreamlist = streams;
            streams.forEach((stream: any) => {
              console.log('stream: ' + JSON.stringify(stream));
              this.trySubscribeStream(stream);
            });

            var users = resp.users;
            if (users instanceof Array) {
              users.forEach((u) => {
                console.log('user in conference: ' + JSON.stringify(u));
              });
            }
          });
        },
        error => {
          console.log("get token error: " + JSON.stringify(error));

          if (error.status == 401) {
            console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
            this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
          }
          else {
            this.alertService.error(error);
          }
        }
      );
  }

  sendMesage() {
    let username = localStorage.getItem('username');
    this.conference.send(JSON.stringify({ "username": username, "txt": this.send_msg, "image": ""}), undefined,() => {
      console.log("sendMessage success");
    },
    function (err: any) {
      console.log("sendMessage error: ", err);
    }
    );

    this.send_msg = '';

 
  }

  unregisterEvents() {
    this.conference.clearEventListener('stream-added');
    this.conference.clearEventListener('stream-removed');
    this.conference.clearEventListener('server-disconnected');
    this.conference.clearEventListener('user-joined');
    this.conference.clearEventListener('user-left');
    this.conference.clearEventListener('recorder-added');
    this.conference.clearEventListener('recorder-continued');
    this.conference.clearEventListener('recorder-removed');
  }

  registerEvents() {

    this.conference.onMessage((event: any) => {
      console.log('Message Received:', event.msg);
      this.resceive = event.msg.data;
      let receives = JSON.parse(this.resceive);
      console.log(receives);
      this.list.push(receives)
      console.log(this.list);
    });

    this.conference.on('server-disconnected', () => {
      console.log('Server disconnected');
    });

    this.conference.on('stream-added', (event: any) => {
      var stream = event.stream;
      // if(stream.id() !== localStream.id()) return;
      console.log('stream added:', stream.id());
      var fromMe = false;
      for (let i in this.conference.localStreams) {
        if (this.conference.localStreams.hasOwnProperty(i)) {
          if (this.conference.localStreams[i].id() === stream.id()) {
            fromMe = true;
            break;
          }
        }
      }
      var small = stream.attributes();
      console.log(small.uuid);
      if (small.size === "small") {
        this.streamunmix(stream);
      }

      var small = stream.attributes();
      console.log(small.uuid);
      if (small.size === "small") {
        this.streamunmix(stream);
      }

      if (fromMe) {
        console.log('stream', stream.id(), 'is from me; will not be subscribed.');
        return;
      }
      this.trySubscribeStream(stream);
    });

    this.conference.on('stream-removed', (event: any) => {
      var stream = event.stream;
      console.log('stream removed: ', stream.id());
      var id = stream.elementId !== undefined ? stream.elementId : 'video-' + stream.id();

      if (id !== undefined) {

        /* locate stream in the layout */
        var i = 1;
        for (; i <= this.maxRemoteStreams; ++i) {
          if (this.layoutStreams[i] == stream) {
            break;
          }
        }

        if (i <= this.maxRemoteStreams) {
          var elemId = 'remote' + i;
          this.layoutStreams[i] = null;

          var element = document.getElementById(id);

          if (element) {
            document.getElementById(elemId).removeChild(element);
          }
        }
        else {
          console.log('Stream ', stream.id(), " not found in the layout");
        }
      }
    });

    this.conference.on('user-joined', (event: any) => {
      console.log('user joined:', event.user);
    });

    this.conference.on('user-left', (event: any) => {
      console.log('user left:', event.user);
    });

    this.conference.on('recorder-added', (event: any) => {
      console.log('media recorder added:', event.recorderId);
    });

    this.conference.on('recorder-continued', (event: any) => {
      console.log('media recorder continued:', event.recorderId);
    });

    this.conference.on('recorder-removed', (event: any) => {
      console.log('media recorder removed:', event.recorderId);
    });
  }

  streamunmix(streams) {
    this.conference.unmix(streams, this.RemoteStreamlist,
      () => {
        console.log('unmix success', this.RemoteStreamlist);
      },
      (err: any) => {
        console.error("unmix error", err, this.RemoteStreamlist);
      }
    );
  }

  min_publish() {

    if (this.isPublish) {
      PureRTC.LocalStream
        .create({
          video: {
            device: 'camera',
            resolution: {width: 228, height: 128}
          },
          audio: false
        }, (err: any, stream: any) => {
          if (err) {
            return console.error('create minLocalStream failed:', err);
          }
          stream.attr("size", "small");
          stream.attr("uuid", this.uuid);
          stream.attr("width", "228");
          stream.attr("height", "128");
          this.minlocalStream = stream;
          // this.RemoteStreamlist.push(stream);

          var opt: any = {codec: 'h264', maxVideoBW: 200};
          if (this.iceTransportPolicy) {
            opt.iceTransportPolicy = this.iceTransportPolicy;
          }

          this.conference.publish(this.minlocalStream, opt, (st: any) => {
            console.log('stream published:', st.id());
          },
            (err: any) => {
              console.error('publish min stream failed:', err);
            }
          );
        }
        );
    }
  }

  publish() {
    if (this.isPublish) {
      PureRTC.LocalStream
        .create({
          video: {
            device: 'camera',
            resolution: this.localResolution
            //resolution: {width: 320, height: 240},
          },
          audio: true
        }, (err: any, stream: any) => {
          if (err) {
            return console.error('create LocalStream failed:', err);
          }

          this.localStream = stream;
          stream.attr("uuid", this.uuid);
          stream.attr("size", "big");
          console.log(this.resols[this.localResolution].width);
          stream.attr("width", this.resols[this.localResolution].width);
          stream.attr("height", this.resols[this.localResolution].height);

          if (window.navigator.appVersion.indexOf('Trident') < 0) {
            this.localStream.show('preview');
          }

          if (window.navigator.appVersion.indexOf('Trident') > -1) {
            var canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 240;
            canvas.setAttribute('autoplay', 'autoplay::autoplay');
            document.getElementById('preview').appendChild(canvas);
            attachMediaStream(canvas, this.localStream.mediaStream);
          }

          var maxVideoKbirate = 400;  // init min 400
          if(this.localResolution == "uhd_4k"){
            maxVideoKbirate = 8000;
          } else if(this.localResolution == "hd1080p"){
            maxVideoKbirate = 4000;
          } else if(this.localResolution == "hd720p"){
            maxVideoKbirate = 2000;
          } else if(this.localResolution == "xga"){
            maxVideoKbirate = 1736;
          } else if(this.localResolution == "r720x720"){
            maxVideoKbirate = 1500;
          } else if(this.localResolution == "svga"){
            maxVideoKbirate = 1137;
          } else if(this.localResolution == "vga"){
            maxVideoKbirate = 800;
          } else if(this.localResolution == "sif"){
            maxVideoKbirate = 400;
          }
          var opt: any = {codec: 'h264', maxVideoBW: maxVideoKbirate, maxAudioBW: 60};
          if (this.iceTransportPolicy) {
            opt.iceTransportPolicy = this.iceTransportPolicy;
          }

          this.conference.publish(this.localStream, opt, (st: any) => {
            console.log('stream published:', st.id());
          },
            (err: any) => {
              console.error('publish failed:', err);
            }
          );
        }
        );
    }
  }


  trySubscribeStream(stream: any) {

    console.log('trySubscribeStream: ' + stream.id());
    if (stream instanceof PureRTC.RemoteMixedStream) {
      stream.on('VideoLayoutChanged', () => {
        console.log('stream', stream.id(), 'VideoLayoutChanged');
      }
      );

      if (this.subscribeMix == true) {
        this.RemoteStreamlist.push(stream);
        console.log('trying to subscribe to mix stream: ', stream.id());

        var resolutions = stream.resolutions();

        console.log('stream resolution: ', resolution ? JSON.stringify(resolution) : "undefined");

        var videoOpt: any;
        var resolution: any;

        if (resolutions.length > 1) {
          resolution = resolutions[Math.floor(Math.random() * 10) % 2];  // WTF ????????!!!!!!!!!!!! 
          videoOpt = { resolution: resolution };
          console.log('subscribe stream with option (resolution): ', resolution);
        }
        else {
          videoOpt = true;  // all kind of video is enabled
          console.log(' all kind of video is enabled');
        }

        this.conference.subscribe(stream, { video: videoOpt, iceTransportPolicy: this.iceTransportPolicy },
          () => {
            /* response */
            console.log('subscribed to mix stream: ', stream.id());
            console.log('stream resolution: ', resolution ? JSON.stringify(resolution) : "undefined");
            this.displayStream(stream, resolution);
          },
          (error: any) => {
            console.error('subscribe failed for stream ', stream.id(), ', error: ', error);
          }
        );
      } else {
        console.log('Not subscribing to mix stream: disallowed in configuration: stream ', stream.id());
      }
    } else {
      console.log('subscribing to non-mix stream: ', stream.id());
      /* subscribe the stream to events */
      ['VideoEnabled', 'AudioEnabled', 'VideoDisabled', 'AudioDisabled']
        .forEach((event_name) => {
          stream.on(event_name,
            () => {
              console.log('stream ', stream.id(), ' received event ', event_name);
            }
          );
        });

      if (this.subscribeMix !== true || stream.isScreen()) {
        console.log('subscribing to a non-mix stream: ', stream.id());

        if (typeof this.conference.subscribe !== 'function') {

          console.log('****** Subscribe is not a function ********');
          console.log("Conference :" + JSON.stringify(this.conference));
          console.log("This ID :" + this.conferenceId);
          return;
        }

        this.conference.subscribe(stream,
          () => {
            console.log('subscribed to non-mix stream: ', stream.id());
            this.displayStream(stream, null);
          },
          (err: any) => {
            console.error(stream.id(), 'subscribe to non-mix stream failed, error: ', err);
          }
        );
      } else {
        console.log('Won`t subscribe to non-mix stream ', stream.id(), ': only mix subscription is allowed in config');
      }
    }
  }

  displayStream(stream: any, resolution: any) {
    console.log('displayStream: ' + stream.id());

    var i = 1;

    /*  add to the layout */
    for (; i <= this.maxRemoteStreams; ++i) {
      if (this.layoutStreams[i] == null) {
        break;
      }
    }

    /* replace the first element if no free slots were found */
    if (i > this.maxRemoteStreams) {
      //     i = 1;
      console.log('displayStream: no free slot found to display stream');
      return;
    }

    let elemId = 'remote' + i;
    this.layoutStreams[i] = stream;

    console.log('stream will be displayed in ', elemId);

    var div = document.createElement('div');
    var streamId = stream.id();

    if (!resolution) {
      console.log("resolution not defined");
    }

    if (stream instanceof PureRTC.RemoteMixedStream) {
      resolution = resolution || { width: 640, height: 480 };
      console.log("[1] resolution set to " + JSON.stringify(resolution));
    } else {
      resolution = resolution || { width: 320, height: 240 };
      console.log("[2] resolution set to " + JSON.stringify(resolution));

      var remoteDiv = document.getElementById(elemId);
      remoteDiv.setAttribute('style', 'width: ' + resolution.width + 'px; height: ' + resolution.height + 'px;');
    }

    if (!resolution.width || !resolution.height || resolution.width > 640) {
      resolution = { width: 640, height: 480 };
      console.log("[3] resolution set to " + JSON.stringify(resolution));
    }
    //USER ADD
    resolution = { width: 320, height: 240 };
    div.setAttribute('style', 'width: ' + resolution.width + 'px; height: ' + resolution.height + 'px;');
    div.setAttribute('id', 'video-' + streamId);
    div.setAttribute('title', 'Stream#' + streamId);

    document.getElementById(elemId).appendChild(div);

    if (window.navigator.appVersion.indexOf('Trident') < 0) {
      console.log('displayStream: stream.show: ', 'video-' + streamId);
      stream.show('video-' + streamId);
    } else {
      console.log('displayStream: ', stream.id(), " in ", elemId);
      var canvas = document.createElement('canvas');
      canvas.width = resolution.width;
      canvas.height = resolution.height;
      canvas.setAttribute('autoplay', 'autoplay::autoplay');
      div.appendChild(canvas);
      var ieStream = new PureRTC.ieplugin.ieMediaStream(stream.mediaStream.label);
      attachRemoteMediaStream(canvas, ieStream, stream.pcid);
    }
  }

  router_jion(){
    this.router.navigate(['/room/join'])
  }
}
