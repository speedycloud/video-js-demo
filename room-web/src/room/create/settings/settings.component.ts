import { Component } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../_services/index';

export class RoomSettingsContext extends BSModalContext {
  public storedOptions: any;
}

@Component({
  moduleId: module.id,
  selector: 'modal-content',
  styles: [`
        .room-options-container {
            padding: 15px;
        }

        .room-options-header {
            background-color: #003366;
            color: #efefef;
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],
  
  templateUrl: 'settings.component.html'
})


export class RoomSettings implements CloseGuard, ModalComponent<RoomSettingsContext> {
  context: RoomSettingsContext;
  complexForm : FormGroup;
  debug_log_enabled: boolean = false;

   resolutions = [
       {name: "uhd_4k"},
       {name: "hd1080p"},
       {name: "hd720p"},
       {name: "r720x720"},
       {name: "xga"},
       {name: "svga"},
       {name: "vga"},
       {name: "sif"}
     ];

   modes = [
       {id: 0, name: "hybrid"}
     ];

   bkColors = [
       {name: "black", value: {"r":0,"g":0,"b":0}},
       {name: "white", value: {"r":255,"g":255,"b":255}}
     ];

   layouts = [
       {name: "fluid"},
       {name: "lecture"}
     ];   

  private isValidated: boolean;

  constructor(fb: FormBuilder, public dialog: DialogRef<RoomSettingsContext>) {

      this.context = dialog.context;

      if (this.debug_log_enabled) {
        console.log("Context: " + JSON.stringify(this.context));
      }      
      let stored : any = {};

      if (this.context.storedOptions) {
         stored = this.context.storedOptions;

         if (!stored.enableMixing) {
            stored.mediaMixing = {video: {}};
            stored.mediaMixing.video.resolution = 'vga';
            stored.mediaMixing.video.bitrate = 0;
            stored.mediaMixing.video.bkColor = 'black';
            stored.mediaMixing.video.maxInput = 16;        
            stored.mediaMixing.video.avCoordinated = 0;
            stored.mediaMixing.video.multistreaming = 0;
            stored.mediaMixing.video.crop = 0;
            stored.mediaMixing.video.layout = {base:'fluid'}
         }
      }
      else {      
        stored.publishLimit = -1;
        stored.userLimit = 9;
        stored.mode = 'hybrid';
        stored.enableMixing = 1;

        stored.mediaMixing = {video: {}};
        stored.mediaMixing.video.resolution = 'vga';
        stored.mediaMixing.video.bitrate = 0;
        stored.mediaMixing.video.bkColor = 'black';
        stored.mediaMixing.video.maxInput = 16;        
        stored.mediaMixing.video.avCoordinated = 0;
        stored.mediaMixing.video.multistreaming = 0;
        stored.mediaMixing.video.crop = 0;
        stored.mediaMixing.video.layout = {base:'fluid'}
      }

    console.log("Stored: " + JSON.stringify(stored));

     this.complexForm = fb.group({        
        'publishLimit': [stored.publishLimit,  Validators.compose([Validators.required, ValidationService.minValueValidator(-1)])],
        'userLimit': [stored.userLimit,  Validators.compose([Validators.required, ValidationService.minValueValidator(0),  ValidationService.maxValueValidator(9)])],        
        'mode' : stored.mode,
        'mixing' : (stored.enableMixing == 1),
        'resolution' : {value: stored.mediaMixing.video.resolution, disabled: !stored.enableMixing},
        'bitrate': [{value: stored.mediaMixing.video.bitrate, disabled: !stored.enableMixing},  Validators.compose([Validators.required, ValidationService.minValueValidator(0)])],
        'bkColor': {value: stored.mediaMixing.video.bkColor, disabled: !stored.enableMixing},
        'maxInput': [{value: stored.mediaMixing.video.maxInput, disabled: !stored.enableMixing},  Validators.compose([Validators.required, ValidationService.minValueValidator(1)])],
        'avCoordinated' : {value: (stored.mediaMixing.video.avCoordinated == 1), disabled: !stored.enableMixing},
        'multistreaming' : {value: (stored.mediaMixing.video.multistreaming == 1), disabled: !stored.enableMixing},
        'crop' : {value: (stored.mediaMixing.video.crop == 1), disabled: !stored.enableMixing},
        'layout': {value: stored.mediaMixing.video.layout.base, disabled: !stored.enableMixing}
     });

     if (this.debug_log_enabled) {
        console.log(this.complexForm);
     }

     this.complexForm.valueChanges.subscribe( (form: any) => {
       if (this.debug_log_enabled) {
          console.log('form changed to:', form);
       }
     });

    this.context = dialog.context;
    this.isValidated = false;
    dialog.setCloseGuard(this);
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return !this.isValidated;
  }

  onSubmit(value: any) {
    
    let options : any = {};

    if (this.debug_log_enabled) {
        console.log('Form: ' + JSON.stringify(value));
    }
    
    options.mode = value.mode;
    options.publishLimit =  value.publishLimit;
    options.userLimit =  value.userLimit;
    options.enableMixing = (value.mixing ? 1 : 0);
    
    if (options.enableMixing) {
        options.mediaMixing = {video: {}};
        options.mediaMixing.video.resolution = value.resolution;
        options.mediaMixing.video.bitrate =  value.bitrate;
        options.mediaMixing.video.bkColor =  value.bkColor;
        options.mediaMixing.video.maxInput = value.maxInput;
        options.mediaMixing.video.avCoordinated =  (value.avCoordinated ? 1 : 0);
        options.mediaMixing.video.multistreaming =  (value.multistreaming ? 1 : 0);
        options.mediaMixing.video.crop =  (value.crop ? 1 : 0);
        options.mediaMixing.video.layout = {base: value.layout, custom:[]};
    }

    if (this.debug_log_enabled) {
      console.log("selected options: " + JSON.stringify(options));
    }
    
    this.isValidated = true;
    this.dialog.close(options);
  }

  onCancel () {
    this.isValidated = true;
    this.dialog.close();
    return false;
  }

  onEnableMixingClick(isChecked:boolean) {
    if (this.debug_log_enabled) {
      console.log("Clicked, old value = " + this.complexForm.controls['mixing'].value, ", checked: " + isChecked);
    }

    if (isChecked) {
      this.complexForm.controls['resolution'].enable();      
      this.complexForm.controls['bitrate'].enable();
      this.complexForm.controls['bkColor'].enable();
      this.complexForm.controls['maxInput'].enable();
      this.complexForm.controls['avCoordinated'].enable();
      this.complexForm.controls['multistreaming'].enable();
      this.complexForm.controls['crop'].enable();
      this.complexForm.controls['layout'].enable();
    }
    else {
      this.complexForm.controls['resolution'].disable();
      this.complexForm.controls['bitrate'].disable();
      this.complexForm.controls['bkColor'].disable();
      this.complexForm.controls['maxInput'].disable();
      this.complexForm.controls['avCoordinated'].disable();
      this.complexForm.controls['multistreaming'].disable();
      this.complexForm.controls['crop'].disable();
      this.complexForm.controls['layout'].disable();
    }
  }
}
