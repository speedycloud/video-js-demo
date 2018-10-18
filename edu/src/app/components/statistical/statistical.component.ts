import { Component, OnInit,ViewChild } from '@angular/core';
import { StatisticalService } from './statistical.service';
import * as moment from 'moment';

@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css'],
  providers: [StatisticalService]
})

export class StatisticalComponent implements OnInit {

  table_data = [];
  echart_data01 = [
    {
      "title": "实时音视频通信-publish",
      "value":{}
    }
  ];
  echart_data02 = [
    {
      "title": "实时音视频通信-subscribe",
      "value": {}
    }
  ];
  echart_data03 = [
    {
      "title": "实时音视频通信-braoadcast",
      "value": {}
    }
  ];
  echart_data04 = [
    {
      "title": "实时音视频通信-recording",
      "value": {}
    }
  ];
  echart_data05 = [
    {
      "title": "实时音视频通信-mix",
      "value": {}
    }
  ];
  echart_data06 = [
    {
      "title": "实时音视频通信-transcoding",
      "value": {}
    }
  ];

  isLoading = false;
  @ViewChild('publish') publish;
  @ViewChild('subscribe') subscribe;
  @ViewChild('braoadcast') braoadcast;
  @ViewChild('recording') recording;
  @ViewChild('mix') mix;
  @ViewChild('transcoding') transcoding;
  @ViewChild('appDatas') appDatas;
  tabledatas = [
    { data: [] },
    {
      sortMap: {
        audio:null,
        hd_video:null,
        //hdd_video:null,
        sd_video:null,
        time: null
      }
    }
  ];
  dataHeader = [
    { name: "日期", value: "time" },
    { name: "音频", value: "audio" },
    { name: "视频-720p及以下", value: "sd_video" },
    { name: "视频-720p-1080p", value: "hd_video" },
    //{ name: "HD+", value: "hdd_video" },
  ];
  sortName = 'time';
  constructor(
    private $http: StatisticalService
  ) { }

  // 点击刷新重绘：
  search() {
    this.isLoading = true;
    this.onLoading(); //HTTP请求数据
  }

  onLoading() {
    this.tabledatas[0]['data'] = [];
    for(var key in this.echart_data01[0]['value']){
      delete this.echart_data01[0]['value'][key];
    }
    for(var data2 in this.echart_data02[0]['value']){
      delete this.echart_data02[0]['value'][data2];
    }
    for(var data3 in this.echart_data03[0]['value']){
      delete this.echart_data03[0]['value'][data3];
    }
    for(var data4 in this.echart_data04[0]['value']){
      delete this.echart_data04[0]['value'][data4];
    }
    for(var data5 in this.echart_data05[0]['value']){
      delete this.echart_data05[0]['value'][data5];
    }
    for(var data6 in this.echart_data06[0]['value']){
      delete this.echart_data06[0]['value'][data6];
    }
    // 获取本地存储
    let startTimes = localStorage.getItem('startTimes');
    let endTimes = localStorage.getItem('endTimes');
    let selectDomains = localStorage.getItem('selectDomains');

    this.$http.get_bill({
      "start": moment(startTimes).unix(),
      "end": moment(endTimes).unix(),
      "app": selectDomains,
    }).subscribe(res => {
      let resq = JSON.parse(res['_body']);

      this.echart_data01[0]['value'] = {
        "audio":Math.round(resq['pub_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['pub_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['pub_bill']['hd_video']/1000/60),
        //"hdd_video":Math.round(resq['mcu_bill']['hdd_video']/1000/60), 
      };
      // this.echart_data02[0]['value'] = resq['sfu_bill'];
      this.echart_data02[0]['value'] = {
        "audio":Math.round(resq['sub_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['sub_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['sub_bill']['hd_video']/1000/60),
      };
      this.echart_data03[0]['value'] = {
        "audio":Math.round(resq['broad_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['broad_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['broad_bill']['hd_video']/1000/60),
      };
      this.echart_data04[0]['value'] = {
        "audio":Math.round(resq['record_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['record_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['record_bill']['hd_video']/1000/60),
      };
      this.echart_data05[0]['value'] = {
        "audio":Math.round(resq['mix_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['mix_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['mix_bill']['hd_video']/1000/60),
      };
      this.echart_data06[0]['value'] = {
        "audio":Math.round(resq['transcode_bill']['audio']/1000/60),
        "sd_video":Math.round(resq['transcode_bill']['sd_video']/1000/60),
        "hd_video":Math.round(resq['transcode_bill']['hd_video']/1000/60),
      };
      this.table_data = resq['detail'];

      this.publish.reloadCharts();
      this.subscribe.reloadCharts();
      this.braoadcast.reloadCharts();
      this.recording.reloadCharts();
      this.mix.reloadCharts();
      this.transcoding.reloadCharts();
      for (let i of this.table_data) {
        i['time'] = moment(i['time'] * 1000).format("YYYY-MM-DD");
        this.tabledatas[0]['data'].push(
          {
            'audio': Math.round(i['audio'] / 1000 / 60),
            'sd_video': Math.round(i['sd_video'] / 1000/ 60),
            'hd_video': Math.round(i['hd_video'] / 1000/ 60),
            //'hdd_video': Math.round(i['hdd_video'] / 1000/ 60),
            'time': i['time']
          }
        )
      }
      this.appDatas.refreshData();
      // this.project_data = res['apps'];
    }, error => { })
  }

  ngOnInit() {
    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    this.onLoading()
  }

}
