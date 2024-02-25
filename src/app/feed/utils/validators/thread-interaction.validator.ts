import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const ThreadInteractionValidator: ValidatorFn = (control: AbstractControl<string, string>): ValidationErrors | null => {
    const controlValue = control.value.trim();
    if (controlValue[0] === "@")
        return controlValue.split(" ").length > 1 ? null : { required: true };
    return controlValue === "" ? { required: true } : null;
}