import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectLitService } from './project-list.service'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: [NzMessageService, ProjectLitService]
})
export class ProjectListComponent implements OnInit {

  constructor(
    private router: Router,
    private $http: ProjectLitService,
    private _message: NzMessageService,
  ) { }

  options = [];
  selectedOption;
  _value = '';
  isVisible = false;
  isCreat = false;
  isEdit = false;
  siteName = '';
  _projectName: string;
  _projectID: string;
  _projectDomain: string;
  isSwitch:Boolean = false;
  project_data = [];

  onSearch(event: string): void {
    console.log(event);
  }
  // 新建项目
  showProModal = () => {
    this.isCreat = true;
  }
  proOk = (e) => {
    console.log()
    this.siteName = this.siteName.trim();
    if (this.siteName !== '') {
      console.log(this.siteName)
      this.$http.post_name({"name":this.siteName}).subscribe(res=>{
        console.log(res)
      },err=>{})
      this._message.create('success', '恭喜，创建成功！', { nzDuration: 800 });
      // this.isLoadingOne = true
    } else {
      this._message.create('error', '项目名不能为空', { nzDuration: 800 });
    }
  }
  proCancel = (e) => {
    // console.log(e);
    this.isCreat = false;
  }

  _console(e){

  }

  // 编辑项目
  showEditModal = () => {
    this.isEdit = true;
  }
  editOk = (e) => {
    this.siteName = this.siteName.trim();
    if (this.siteName !== ''){
      // console.log(this.siteName)
      this._message.create('success', '恭喜，创建成功！', { nzDuration: 800 });
      // this.isLoadingOne = true
    }else{
      this._message.create('error', '项目名不能为空', { nzDuration: 800 });
    }
    // localStorage.removeItem('token');
    
  }
  editCancel = (e) => {
    // console.log(e);
    this.isEdit = false;
  }
  //关闭项目
  showModal = () => {
    this.isVisible = true;
  }
  handleOk = (e) => {
    this._message.create('success', '已关闭', { nzDuration: 800 });
    this.isVisible = false;
  }
  handleCancel = (e) => {
    // console.log(e);
    this.isVisible = false;
  }

  ngOnInit() {
    this.$http.get_list().subscribe(res=>{
      //console.log(res,888)
      let resq = JSON.parse(res['_body']);
      this.project_data = resq['apps'];
    },error=>{})
    /*模拟服务器异步加载*/
    setTimeout(_ => {
      this.options = [
        { value: 'dafault', label: '默认排序' },
        { value: 'time_down', label: '创建时间 ↓' },
        { value: 'time_up', label: '创建时间 ↑' },
        { value: 'project_up', label: '项目名 ↑' },
        { value: 'project_down', label: '项目名 ↓' }
      ];
      this.selectedOption = this.options[0];
    }, 100);
  }

}
