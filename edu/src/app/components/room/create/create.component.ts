import { Component, OnInit , } from '@angular/core';
import { Router } from "@angular/router";
import { RoomService } from '../../../services/room.service';
import { AlertService } from '../../../services/alert.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers:[RoomService,AlertService],
})
export class CreateComponent implements OnInit {

  constructor( 
              private router : Router,
              private roomService:RoomService,
              private alertService: AlertService,
              ) { }

  ngOnInit() {
    this.varfunction();
      
  }
  room:any ={};
  options:any;
  //取消跳回jion页面
  cancel(){
    this.router.navigate(['/room/join'])
  }
  //模态框的相关信息
  publishLimit;
  userLimit;
  
  modes ;
  mode ;

  resolutions ;

  resolution ;
  bitRate ;
  bkColors ;
  bkColor ;

  maxInput ;

  layouts ;
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

  isVisible = false ;
  isConfirmLoading = false;

  showModal = () => {
    this.isVisible = true;
    this.varfunction(); 
  }
  varfunction(){
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

    this.resolution = this.resolutions[6];
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
    this.isConfirmLoading = true;
    console.log(this.options);
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 800);
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }
  _console(value){

       this.is_av_coordinated = !this.is_av_coordinated ;
       this.is_multi_streaming = !this.is_multi_streaming;
       this.is_crop = !this.is_crop; 
       this.is_resolution = !this.is_resolution;
       this.is_bit_rate = !this.is_bit_rate;
       this.is_bk_color = !this.is_bk_color;
       this.is_max_input = !this.is_max_input;
       this.is_layout = !this.is_layout;
 
  }
  create_room(){
    let time = new Date();
    this.options = {
      mode: this.mode.value,
      publishLimit: -1,
      userLimit: 9,
      enableMixing: this._enable?'1':'0',
      expirationDate:this.addDate(time,''),
      mediaMixing:{
          mediaMixing: {
            resolution: this.resolution.value,
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
          if(room.status == 200){
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
// 日期月份/天的显示，如果是1位数，则在前面加上'0'

}

