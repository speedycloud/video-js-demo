import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.css']
})
export class EchartComponent implements OnInit {
  options: any;
  @Input() echartData;
  data_x = [];
  data_y = [];
  data_default={
    'audio':'音频',
    'sd_video':'视频-720p及以下',
    'hd_video':'视频-720p-1080p',
    //'hdd_video':'HD+',
  }
  isLoading = false;
  updateOptions: any;
  constructor() { }
  // 点击刷新重绘：

  reloadCharts() {
    this.data_x = [];
    this.data_y = [];
    this.isLoading = true;
    this.onloading()
    // console.log(this.echartData,999)
    setTimeout(() => {
      this.updateOptions = {
        xAxis: {
          data: this.data_x
          // bottom:0
        },
        series: [{
          data: this.data_y
        }]
      };
      this.isLoading = false;
    }, 1200);
  }

  onloading(){
    for(var i in this.echartData[0]['value']){
        this.data_x.push(this.data_default[i]);
        this.data_y.push(this.echartData[0]['value'][i]);
      }
  }

  ngOnInit() {
    this.onloading()
    setTimeout(() => {
      // console.log(this.echartData, 999)
      this.options = {
        color: ['#3398DB'],
        title: {
          text: this.echartData[0]['title']
        },
        tooltip: {
          // trigger: 'axis',
          axisPointer: {
            // type: 'cross',
            axis: 'x'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.data_x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} ' + '分钟'
            }
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: this.data_y
          }
        ]
      };
    }, 1200);
  }

}
