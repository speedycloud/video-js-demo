import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, RouterState, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { RoomService } from '../../../services/room.service';
import { AlertService } from '../../../services/alert.service';
import { LocalStorageKeys } from '../../../services/config.service'




@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
    providers: [RoomService, AlertService]
})

export class JoinComponent implements OnInit{
    complexForm: FormGroup;
    localResolution: string;
    mixedMode: boolean = true;
    private role: string = "";
    constructor(private router: Router,
                private message:NzMessageService,
                private roomService: RoomService,
                private alertService: AlertService,
                fb: FormBuilder
    ) {
                this.complexForm = fb.group({
                    'resolution': "vga",
                    'mixing': true
                });

                this.complexForm.valueChanges.subscribe((form: any) => {
                    console.log('form changed to:', form);
                    this.localResolution = form.resolution;
                    this.mixedMode = form.mixing;
                });
     }

    ngOnInit() {
       this.loading();
       localStorage.setItem('localResolution', "vga");
    }  
    room;
    loading(){
        this.roomService.getAll()
            .subscribe(
                (rooms: any) => {
                    console.log(typeof JSON.stringify(rooms));
                    this.data = rooms;
                    this.role = localStorage.getItem('role');
                    localStorage.setItem(LocalStorageKeys.roomList, JSON.stringify(this.data));
                },
                error => {
                    this.alertService.error(error);

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
                    }
                    else {
                        this.alertService.error(error);
                    }

                });   
    }

    // selectedRoom: any = {};
    // roomList : Array<any> = [];
    // complexForm : FormGroup;
    // localResolution : string;
    // mixedMode : boolean = true;

    optionList = [
        { label: 'uhd_4k', value: 'uhd_4k' },
        { label: 'hd1080p', value: 'hd1080p' },
        { label: 'hd720p', value: 'hd720p' },
        { label: 'r720x720', value: 'r720x720' },
        { label: 'xga', value: 'xga' },
        { label: 'svga', value: 'svga' },
        { label: 'vga', value: 'vga' },
        { label: 'sif', value: 'sif' }
    ];
    resolution = this.optionList[6];
    //table相关变量
    _allChecked = false;
    _indeterminate = false;
    _displayData = [];

    data = [];

    
    roomData;

    ////////////////////创建跳转//////////////////////////////////////////
    routerCreate(){
        console.log(111111);
        this.router.navigate(['/room/create']);
    }
    //
    join(data){
        this.roomData = this.data
        localStorage.setItem('id', JSON.stringify(data));
        console.log(data);
        var mixing = data.room.enableMixing ? this.mixedMode : false;
        this.router.navigate(['/room/conference'], {
            queryParams: {
                roomid: data.room._id, resolution: data.room.mediaMixing.video.resolution, mixing: mixing
                } 
        });
    }
    delete(data){
        this.roomService.delete(data.room._id)
            .subscribe(
                (rooms: any) => {
                    if(rooms == true){
                     this.loading();
                  }
                    console.log(typeof JSON.stringify(rooms));
                },
                error => {
                    this.alertService.error(error);

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
                    }
                    else {
                        this.alertService.error(error);
                    }

                });

    }
    choseresloution(resolution) {
        console.log(resolution);
        localStorage.setItem('localResolution', resolution);
    }
    toDate(expiresAt: string) {
        var expDate = new Date(expiresAt)
        //return expDate.toString();
        return expDate;
    }
    isExpired(expiresAt: string) {
        var expDate = new Date(expiresAt)
        var now = new Date();
        return (expDate.getTime() < now.getTime());
    }
    room_name;
    options: any;
    publishLimit;
    userLimit;

    modes;
    mode;

    resolutions;

    _resolution;
    bitRate;
    bkColors;
    bkColor;

    maxInput;

    layouts;
    layout;

    _enable;
    _av_coordinated;
    _multi_streaming;
    _crop;

    is_crop;
    is_av_coordinated;
    is_multi_streaming;
    is_resolution;
    is_bit_rate;
    is_bk_color;
    is_max_input;
    is_layout;

    isVisible = false;
    isConfirmLoading = false;

    showModal = () => {
        this.isVisible = true;
        this.varfunction();
    }
    varfunction() {
        this.publishLimit = -1;
        this.userLimit = 9;

        this.modes = [
            { label: 'hybrid', value: 'hybrid' }
        ]
        this.mode = this.modes[0];

        this.resolutions = [
            { label: 'uhd_4k', value: 'uhd_4k' },
            { label: 'hd1080p', value: 'hd1080p' },
            { label: 'hd720p', value: 'hd720p' },
            { label: 'r720x720', value: 'r720x720' },
            { label: 'xga', value: 'xga' },
            { label: 'svga', value: 'svga' },
            { label: 'vga', value: 'vga' },
            { label: 'sif', value: 'sif' }
        ];

        this._resolution = this.resolutions[6];
        this.bitRate = 0;
        this.bkColors = [
            { label: 'black', value: 'black' },
            { label: 'white', value: 'white' },
        ];
        this.bkColor = this.bkColors[0];

        this.maxInput = 16;

        this.layouts = [
            { label: 'fluid', value: 'fluid' },
            { label: 'lectrue', value: 'lectrue' },
        ]
        this.layout = this.layouts[0];

        this._enable = true;
        this._av_coordinated = false;
        this._multi_streaming = false;
        this._crop = false;

        this.is_crop = false;
        this.is_av_coordinated = false;
        this.is_multi_streaming = false;
        this.is_resolution = false;
        this.is_bit_rate = false;
        this.is_bk_color = false;
        this.is_max_input = false;
        this.is_layout = false;
    }
    handleOk = (e) => {
        let time = new Date();
        this.options = {
            mode: this.mode.value,
            publishLimit: -1,
            userLimit: 9,
            enableMixing: this._enable ? '1' : '0',
            expirationDate: this.addDate(time, ''),
            mediaMixing: {
                mediaMixing: {
                    resolution: this._resolution.value,
                    bitrate: this.bitRate,
                    bkColor: this.bkColor.value,
                    maxInput: this.maxInput,
                    avCoordinated: this._av_coordinated ? '1' : '0',
                    multistreaming: this._multi_streaming ? '1' : '0',
                    crop: this._crop ? '1' : '0',
                    layout: {
                        base: this.layout.value,
                        custom: [],
                    }
                }
            }

        }
        console.log(this.room)
        this.roomService.create(this.room_name, this.options)
            .subscribe(
                room => {
                    if (room.status == 200) {
                        setTimeout(() => {
                            this.loading(); 
                        }, 1000);
                       
                    }
                    console.log(room);
                    console.log("Created room: " + JSON.stringify(room));
                    // this.router.navigate(['/room/join']);
                },
                error => {

                    console.log("createRoom error: " + JSON.stringify(error));

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
                    }
                    else {
                        this.alertService.error(error);
                    }
                });
        this.isConfirmLoading = true;
        console.log(this.options);
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
        }, 1000);
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }
    _console(value) {

        this.is_av_coordinated = !this.is_av_coordinated;
        this.is_multi_streaming = !this.is_multi_streaming;
        this.is_crop = !this.is_crop;
        this.is_resolution = !this.is_resolution;
        this.is_bit_rate = !this.is_bit_rate;
        this.is_bk_color = !this.is_bk_color;
        this.is_max_input = !this.is_max_input;
        this.is_layout = !this.is_layout;

    }
    create_room() {
        let time = new Date();
        this.options = {
            mode: this.mode.value,
            publishLimit: -1,
            userLimit: 9,
            enableMixing: this._enable ? '1' : '0',
            expirationDate: this.addDate(time, ''),
            mediaMixing: {
                mediaMixing: {
                    resolution: this._resolution.value,
                    bitrate: this.bitRate,
                    bkColor: this.bkColor.value,
                    maxInput: this.maxInput,
                    avCoordinated: this._av_coordinated ? '1' : '0',
                    multistreaming: this._multi_streaming ? '1' : '0',
                    crop: this._crop ? '1' : '0',
                    layout: {
                        base: this.layout.value,
                        custom: [],
                    }
                }
            }

        }
        console.log(this.room)
        this.roomService.create(this.room.name, this.options)
            .subscribe(
                room => {
                    if (room.status == 200) {
                        this.router.navigate(["/room/join"]);
                    }
                    console.log(room);
                    console.log("Created room: " + JSON.stringify(room));
                    // this.router.navigate(['/room/join']);
                },
                error => {

                    console.log("createRoom error: " + JSON.stringify(error));

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
                    }
                    else {
                        this.alertService.error(error);
                    }
                });
    }
    addDate(time, days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        let date = new Date(time);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day) + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '6Z';
    }
    getFormatDate(arg) {
        if (arg == undefined || arg == '') {
            return '';
        }

        let re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }

        return re;
    }


   
}
