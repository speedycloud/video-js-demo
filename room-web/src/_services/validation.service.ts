import { FormControl, ValidatorFn } from '@angular/forms';

export class ValidationService {

    static minValueValidator(minValue:number):ValidatorFn {
        return (control: FormControl):{ [key: string]: any} => {

            if (control.value >= minValue) {            
                return null;
            } 
            else {            
                return { 'min-value': true };
            }            
       }; 
    }

    static maxValueValidator(maxValue:number):ValidatorFn {
        return (control: FormControl):{ [key: string]: any} => {

            if (control.value <= maxValue) {            
                return null;
            } 
            else {            
                return { 'max-value': true };
            }            
       }; 
    }    

  static valueValidator(control: FormControl): { [key: string]: any} {

        if (control.value < -1) {            
            return null;
        }
        else {            
            return { 'min-value': true };
        }            
    }

}