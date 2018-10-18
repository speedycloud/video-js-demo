import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css'],
  providers: [CommonService]
})
export class CommonComponent implements OnInit {
  isCollapsed = false;
  contentHeight:any;
  isVisible = false;
  username = 'xxx';
  @ViewChild('sidenav') sidernav: ElementRef;

  constructor(
    private router: Router,
    private $http: CommonService
  ) { }

  collapseChange(){
    this.isCollapsed = !this.isCollapsed;
    let rurl = window.location.href.slice(window.location.href.lastIndexOf('/')+1)
    // this.router.navigate(['maps']);
    // console.log(rurl,111)
  }

  showModal = () => {
    this.isVisible = true;
  }

  handleOk = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('startTimes');
    localStorage.removeItem('endTimes');
    localStorage.removeItem('selectDomains');
    this.router.navigate(['/login']);
    this.isVisible = false;
  }

  handleCancel = (e) => {
    // console.log(e);
    this.isVisible = false;
  }

  // 展开收起
  removeBg(vals){
    // console.log(e)
    let isTrue = vals>=0?this.sidernav['subMenus'][vals]['nzOpen']:false;
    if (isTrue && Number(vals) >=0){
      for (var i in this.sidernav['subMenus']) {
        if (i == vals) {
          this.sidernav['subMenus'][i]['nzOpen'] = true;
        } else {
          this.sidernav['subMenus'][i]['nzOpen'] = false;
        }
      }
    }else{
      for (let j of this.sidernav['subMenus']) {
        // console.log(this.sidernav['subMenus'],33)
        j['nzOpen']=false;
      }
    }
  }
  ngOnInit() {

    this.username = localStorage.getItem('username');

    // this.$http.get_email().subscribe(res=>{
    //   // console.log(res)
    //    let emial = JSON.parse(res['_body']);
    //   this.username = emial['name'];
    // },err=>{})

    // this.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) + 'px';
    // console.log(this.contentHeight)
    // console.log(this.sidernav)
  }

}
