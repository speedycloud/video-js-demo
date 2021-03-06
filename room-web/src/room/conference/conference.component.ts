﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, RouterState, Params} from '@angular/router';
import { AlertService, RoomService } from '../../_services/index';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { LocalStorageKeys } from  '../../_defs/index'
import { ENV } from '../../_config/index';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

declare var PureRTC:any;
declare function attachMediaStream(canvas:any, mediaStream:any) : void;
declare function attachRemoteMediaStream(canvas:any, ieStream:any, pcid:any) : void;
const START_BROADCAST_CAPTION = "Go Live";
const STOP_BROADCAST_CAPTION = "Stop";
const START_RECORD_CAPTION = "Start recording";
const STOP_RECORD_CAPTION = "Stop recording";
const BACK_CAPTION = "Back";
const LEAVE_CAPTION = "Leave";

@Component({
    moduleId: module.id,
    templateUrl: 'conference.component.html',
    styleUrls: ['conference.component.scss'],
    providers: [Modal]
})

export class ConferenceComponent implements OnInit, OnDestroy {
      
    private subscription: Subscription;
    private roomItem: any = {};
    private conference : any = {};
    private subscribeMix : boolean = true;
    private isPublish = true;
    private localResolution : string;
    private localStream: any = {};
    private conferenceId: number;
    private layoutStreams: Array<any> = [];
    private maxRemoteStreams = 9;
    private roomItemId: string = "";    
    private broadcastButtonCaption = START_BROADCAST_CAPTION;
    private recordButtonCaption = START_RECORD_CAPTION;
    private leaveButtonCaption = BACK_CAPTION;
    private joined = false;
    private iceTransportPolicy:any = "all";

    constructor(
        private http: Http,
        private router: Router,
        private alertService: AlertService,
        private roomService: RoomService,
        private activatedRoute: ActivatedRoute,
        public modal: Modal) { 
        }



    ngOnInit() {
        console.log('Conference init');

        this.localStream = {};
        this.conference = PureRTC.ConferenceClient.create({});
        this.conferenceId = Date.now();

        console.log('Conference created: ' + JSON.stringify(this.conference));
        
        this.registerEvents();         

        // subscribe to router event
        this.subscription = this.activatedRoute.queryParams.subscribe((param: any) => {

            if (!param['roomid']) {
                console.log("conference: room id is missing");
                this.alertService.error("room id is not specified");
                return;
            }

            this.roomItemId = param['roomid'];

            this.localResolution = param['resolution'] || 'vga';
            this.subscribeMix = param['mixing'] ? (param['mixing'] === 'true') : true;
            
            console.log("conference: ngOnInit: Room item id: " + this.roomItemId + ", resolution: " + this.localResolution + ", mixing: " + ((this.subscribeMix === true) ? "TRUE" : "FALSE"));                                

            let roomItemList = JSON.parse(localStorage.getItem(LocalStorageKeys.roomList));

            for (let item of roomItemList) {
                if (item._id === this.roomItemId) {
                    this.roomItem = item;
                    console.log("Found room item: ", JSON.stringify(this.roomItem));
                }
            }

            this.roomItem.room.recording = {isStarted: false};

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
            catch(e) {            
                console.log("Leave failed: ", e);
            };
        }
        this.subscription.unsubscribe();
        // reset the conference to empty object [exception on stream-added]
        this.conference = {};
    }

    private leave(){        

        if (this.conference){
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

        if (this.localStream && typeof this.localStream.close === 'function'){
            this.localStream.close();
            if (this.localStream.channel && typeof this.localStream.channel.close === 'function') {
                this.localStream.channel.close();
                delete this.localStream.channel;
            }

            delete this.localStream;
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
                            .subscribe((resp:any) => {
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
            this.stopRecording(function() {});
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
            function (err:any) {
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
            function (err:any) {
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
            catch(e) {            
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

    joinConference(roomId : string) {
        console.log('Joining conference');        

        this.roomItem.room.broadcast.isLive = false;
        this.roomService.getToken(roomId)
            .subscribe(
                (session:any) => {
                    console.log("Received room token: ", session);
                    
                    if(session.iceServers) {
                        console.log("Setting ICE servers: ", JSON.stringify(session.iceServers));                        
                        this.conference.setIceServers(session.iceServers);
                    }

                    /* decode the token */
                    var tkn = JSON.parse(atob(session.token));                    
                    this.roomItem.room.mediaServer = tkn.host;

                    this.conference.join(session.token, (resp:any) => { 
                        console.log('Join conference response: ' + JSON.stringify(resp));
                        this.joined = true;
                        this.leaveButtonCaption = LEAVE_CAPTION;
                        this.iceTransportPolicy = session.iceTransportPolicy;
                        this.publish();

                        /* subscribe to incoming streams */
                        let streams = resp.streams;
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
                        this.router.navigate(['/login'],  { queryParams: { message: "Session has expired. Please login. "}});                          
                    }
                    else {
                        this.alertService.error(error);
                    }
                }
            );
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

        this.conference.onMessage((event:any) => {
            console.log('Message Received:', event.msg);
        });

        this.conference.on('server-disconnected', () => {
            console.log('Server disconnected');
        });

        this.conference.on('stream-added', (event:any) => {
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

            if (fromMe) {
                console.log('stream', stream.id(), 'is from me; will not be subscribed.');
                return;
            }

            this.trySubscribeStream(stream);
        });

        this.conference.on('stream-removed', (event:any) => {
            var stream = event.stream;
            console.log('stream removed: ', stream.id());
            var id = stream.elementId !==undefined ? stream.elementId : 'video-' + stream.id();
            
            if (id !== undefined) {

                /* locate stream in the layout */
                var i = 1;                
                for (; i <= this.maxRemoteStreams; ++i) {
                    if (this.layoutStreams[i] == stream) {
                        break;
                    }
                }
        
                if (i <= this.maxRemoteStreams) {
                    var elemId = 'remote'+i;
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

        this.conference.on('user-joined', (event:any) => {
            console.log('user joined:', event.user);
        });

        this.conference.on('user-left', (event:any) => {
            console.log('user left:', event.user);
        });

        this.conference.on('recorder-added', (event:any) => {
            console.log('media recorder added:', event.recorderId);
        });

        this.conference.on('recorder-continued', (event:any) => {
            console.log('media recorder continued:', event.recorderId);
        });

        this.conference.on('recorder-removed', (event:any) => {
            console.log('media recorder removed:', event.recorderId);
        });
    }


    publish() {

        if (this.isPublish) {
            PureRTC.LocalStream
            .create({
                video: {
                    device: 'camera',
                    resolution: this.localResolution
                },
                audio: true
            }, (err:any, stream:any) => {
                    if (err) {
                        return console.error('create LocalStream failed:', err);
                    }

                    this.localStream = stream;

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

                    var opt:any = {};
                    if( this.iceTransportPolicy ) {
                        opt.iceTransportPolicy = this.iceTransportPolicy;
                    }
                    
                    this.conference.publish(this.localStream, opt, (st:any) => {
                            console.log('stream published:', st.id());
                        }, 
                        (err:any) => {
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
            stream.on('VideoLayoutChanged', () => 
                {
                    console.log('stream', stream.id(), 'VideoLayoutChanged');
                }
            );

            if (this.subscribeMix == true) {
                console.log('trying to subscribe to mix stream: ', stream.id());

                var resolutions = stream.resolutions();
                
                console.log('stream resolution: ', resolution ? JSON.stringify(resolution): "undefined");

                var videoOpt : any;
                var resolution: any;

                if (resolutions.length > 1) {
                    resolution = resolutions[Math.floor(Math.random()*10)%2];  // WTF ????????!!!!!!!!!!!! 
                    videoOpt = {resolution: resolution};
                    console.log('subscribe stream with option (resolution): ', resolution);
                }
                else {
                    videoOpt = true;  // all kind of video is enabled
                    console.log(' all kind of video is enabled');
                }

                this.conference.subscribe(stream, {video: videoOpt , iceTransportPolicy: this.iceTransportPolicy}, 
                    () => {
                        /* response */
                        console.log('subscribed to mix stream: ', stream.id());
                        console.log('stream resolution: ', resolution ? JSON.stringify(resolution): "undefined");
                        this.displayStream(stream, resolution);
                    },
                    (error:any) => {
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
                    (err:any) => {
                        console.error(stream.id(), 'subscribe to non-mix stream failed, error: ', err);
                    }
                );
            } else {
                console.log('Won`t subscribe to non-mix stream ', stream.id(), ': only mix subscription is allowed in config');
            }
        }
    }

    displayStream(stream:any, resolution:any) {
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

        let elemId = 'remote'+i;
        this.layoutStreams[i] = stream;        

        console.log('stream will be displayed in ', elemId);

        var div = document.createElement('div');
        var streamId = stream.id();

        if (!resolution) {
            console.log("resolution not defined");
        }

        if (stream instanceof PureRTC.RemoteMixedStream) {
            resolution = resolution || {width: 640, height: 480};
            console.log("[1] resolution set to " + JSON.stringify(resolution));
        } else {
            resolution = resolution || {width: 320, height: 240};
            console.log("[2] resolution set to " + JSON.stringify(resolution));

            var remoteDiv = document.getElementById(elemId);
            remoteDiv.setAttribute('style', 'width: '+resolution.width+'px; height: '+resolution.height+'px;');
        }

        if (!resolution.width || !resolution.height || resolution.width > 640) {
            resolution = {width: 640, height: 480};
            console.log("[3] resolution set to " + JSON.stringify(resolution));
        }

        div.setAttribute('style', 'width: '+resolution.width+'px; height: '+resolution.height+'px;');
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
/*
    showAlert(msg:string) {
        this.modal.alert()
        .size('sm')
        .isBlocking(false)
        .showClose(false)
        .title('Alert')
        .body('<p>' + msg + '</p>')
        .open()
            .catch(err => console.log("Alert dialog error"))
             .then((dialog) => {                
                this.router.navigate(['/room/join']);                
            }); 
    }  */  
}
