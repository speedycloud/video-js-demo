"use strict";
class ValidationService {
    static minValueValidator(minValue) {
        return (control) => {
            if (control.value >= minValue) {
                return null;
            }
            else {
                return { 'min-value': true };
            }
        };
    }
    static maxValueValidator(maxValue) {
        return (control) => {
            if (control.value <= maxValue) {
                return null;
            }
            else {
                return { 'max-value': true };
            }
        };
    }
    static valueValidator(control) {
        if (control.value < -1) {
            return null;
        }
        else {
            return { 'min-value': true };
        }
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map