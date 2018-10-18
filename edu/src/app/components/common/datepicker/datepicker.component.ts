import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatepickerService } from './datepicker.service';
import * as moment from 'moment';
import { BaseService } from '../../../services/base.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [DatepickerService, NzMessageService]
})
export class DatepickerComponent implements OnInit {
  @Output() private outer = new EventEmitter<string>();
  @Output() private defaultOuter = new EventEmitter<string>();

  _startDate = moment(new Date()).format("YYYY-MM-DD");
  _endDate = moment(new Date()).format("YYYY-MM-DD");
  options = [];
  selectedOption = {};
  domain_infos = {};
  infos_data:any;
  // _disabledStartDate = (startValue) => {
  //   if (!startValue || !this._endDate) {
  //     return false;
  //   }
  //   return startValue.getTime() >= this._endDate.getTime();
  // };
  // _disabledEndDate = (endValue) => {
  //   if (!endValue || !this._startDate) {
  //     return false;
  //   }
  //   return endValue.getTime() <= this._startDate.getTime();
  // };


  constructor(
    private datepickerService: DatepickerService,
    private $http: BaseService,
    private router: Router,
    private _message: NzMessageService,
  ) { }

  ngOnInit() {
    //下拉框
    // this.options = [
    //   { value: 'jack', label: 'All' },
    //   { value: 'lucy', label: 'video3.omghk.com' },
    //   { value: 'disabled', label: 'Disabled', disabled: true }
    // ];
    let isStartTimes = localStorage.getItem('startTimes');
    let isendTimes = localStorage.getItem('endTimes');
    let $this = this;
    if (isStartTimes){
      this._startDate = isStartTimes;
      this._endDate = isendTimes;
    }

    this.datepickerService.get_customer().subscribe((res) => {
      // console.log(resq)
      let resq = JSON.parse(res['_body']);
      let isSelectDomain = localStorage.getItem('selectDomains');

      this.domain_infos = resq['apps'];
      this.infos_data = this.domain_infos;
      // this.options.push({value:this.infos_data,label:'All'})
      for (let i of this.infos_data){
        this.options.push({value:i,label:i})
      }


      if (isSelectDomain) {
        if(isSelectDomain.indexOf(',')>=1){
          this.selectedOption = this.options[0]
        }else{
          for (var j of this.options) {
            if (j['value'] === isSelectDomain) {
              this.selectedOption = j;
            }
          }
        }
      }else{
        this.selectedOption = this.options[0];
      }

      // this.options = this.infos_data;
      // console.log(this.infos_data, 6544333)
    }, error => {
      this._message.create('error', '请先登录', { nzDuration: 800 });
      setTimeout(() => {
        $this.router.navigate(['/login']);
      }, 1000);
    })

  }

  searchCharts(){
    // alert(555)
    // console.log(this._startDate, moment(this._startDate).unix(),888)
    // console.log(moment(this._startDate).unix(),88)
    // console.log(moment(this._endDate).add(1, 'd').unix(),88)
    let compare_start = moment(this._startDate).unix();
    let compare_end = moment(this._endDate).unix();
    let default_start = this._startDate;
    let default_end = this._endDate;
    if (compare_end >= compare_start){
      // 开始日期
      this._startDate = moment(this._startDate).format("YYYY-MM-DD");
      // 结束日期
      this._endDate = moment(this._endDate).format("YYYY-MM-DD");
    } else{
      // 开始日期
      this._startDate = moment(default_end).format("YYYY-MM-DD");
      // 结束日期
      this._endDate = moment(default_start).format("YYYY-MM-DD");
    }
    localStorage.setItem('startTimes', this._startDate);
    localStorage.setItem('endTimes', this._endDate);
    localStorage.setItem('selectDomains', this.selectedOption['value']);
    // console.log(this.selectedOption,89)
    // 域名
    // this.selectedOption = this.selectedOption['value'];

    // console.log(this.selectedOption['value'])
    // console.log(moment(this._startDate).format("YYYY-MM-DD"), moment(this._endDate).format("YYYY-MM-DD"))
    this.outer.emit()
  }

}
