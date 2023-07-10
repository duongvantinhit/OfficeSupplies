import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private messageService: MessageService) {}

    error(message: string, key: string = ''): void {
        if (key) {
            this.messageService.add({
                key: key,
                severity: 'error',
                summary: 'UA-ERROR',
                detail: message,
                life: 5000,
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'UA-ERROR',
                detail: message,
                life: 5000,
            });
        }
    }

    errorMobile(message: string, key: string = ''): void {
        if (key) {
            this.messageService.add({
                key: key,
                severity: 'error',
                summary: 'UA-Lỗi',
                detail: message,
                life: 5000,
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'UA-Lỗi',
                detail: message,
                life: 5000,
            });
        }
    }

    warn(message: string, key: string = '') {
        if (key) {
            this.messageService.add({
                key: key,
                severity: 'warn',
                summary: 'UA-Warn',
                detail: message,
                life: 5000,
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'UA-Warn',
                detail: message,
                life: 5000,
            });
        }
    }

    success(message: string, key: string = '', titleOfToast = 'Success') {
        if (key) {
            this.messageService.add({
                key: key,
                severity: 'success',
                summary: titleOfToast,
                detail: message,
                life: 5000,
            });
        } else {
            this.messageService.add({
                severity: 'success',
                summary: titleOfToast,
                detail: message,
                life: 5000,
            });
        }
    }

    inform(message: string) {
        if (message) {
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: message,
                life: 5000,
            });
        }
    }

    // errorWithFocusControl(form: FormGroup, message: string, key: string = '') {
    // 	this.focusErrorControl(form);
    // 	this.error(message, key);
    // }

    // errorWithFocusControls(forms: FormGroup[], message: string, key: string = '') {
    // 	forms.forEach(form => {
    // 		this.focusErrorControl(form);
    // 	});
    // 	this.error(message, key);
    // }

    // warnWithFocusControl(form: FormGroup, message: string, key: string = '') {
    // 	this.focusErrorControl(form);
    // 	this.warn(message, key);
    // }

    // focusErrorControl(form: FormGroup):void{
    // 	for (let k in form.controls) {
    // 		let ctr = form.controls[k];
    // 		if (ctr && ctr.invalid) {
    // 			ctr.markAsDirty();
    // 		}
    // 	}
    // }

    setDirtyControl(form: any): void {
        if (form) {
            if (form.controls) {
                this.setDirtyControl(form.controls);
            } else if (form && form.invalid) {
                form.markAsDirty();
            } else if (!('value' in form))
                for (let k in form) {
                    let ctl = form[k];
                    this.setDirtyControl(ctl);
                }
        }
    }

    setErrorAndDirtyForm(form: any, err: string = ''): void {
        this.setDirtyControl(form);
        if (err) this.error(err);
    }
}
