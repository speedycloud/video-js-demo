import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() dataIn:any
  @Input() dataHeader:any
  @Input() sortName:any
  constructor() { }

  search_value = '';
  sortValue = null;
  _current = 1;
  sizeArray = [10, 25, 50, 100];
  _pageSize = 10;
  _loading = false;

  sortMap = {
    datetime: null,
    pv: null,
    uv: null
  }
  //表头数据
  // dataHeader = [];
  dataKey = [];
  //body数据
  data = [];
  copyData = [];
  // 排序
  sort(sortName, value) {
    this.sortName = sortName;
    this.sortValue = value;
    // console.log(sortName,value)
    Object.keys(this.sortMap).forEach(key => {
      if (key !== sortName) {
        this.sortMap[key] = null;
      } else {
        this.sortMap[key] = value;
      }
    });
    this.search();
  }

  search() {
    this.data = [...this.data.sort((a, b) => {
      if (a[this.sortName] > b[this.sortName]) {
        return (this.sortValue === 'ascend') ? 1 : -1;
      } else if (a[this.sortName] < b[this.sortName]) {
        return (this.sortValue === 'ascend') ? -1 : 1;
      } else {
        return 0;
      }
    })];
  }

  getKeys(item) {
    return Object.keys(item);
  }
  // 表格搜索
  onSearch(event: string): void {
    // console.log(event);
    this.search_value = ''

  }

  reset(array) {
    array.forEach(item => {
      item.value = false;
    });
    this.search();
  }
  ifreshData(){

  }

  refreshData() {
    this._loading = true;
    // console.log(this.dataIn)
    setTimeout(() => {
      this._loading = false;
      if(this.dataIn){
        this.data = this.dataIn[0]['data'];
        // this.dataHeader = this.dataIn[1]['dataHeader'];
        this.sortMap = this.dataIn[1]['sortMap'];
        this.sort(this.sortName, 'descend');
      }
    },600);
  }

  ngOnInit() {
    this.refreshData()

  }

}
