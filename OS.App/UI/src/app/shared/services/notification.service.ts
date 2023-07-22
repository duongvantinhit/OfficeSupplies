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
                summary: 'OS-ERROR',
                detail: message,
                life: 5000,
                icon: 'pi pi-times-circle',
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'OS-ERROR',
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
                summary: 'OS-WARN',
                detail: message,
                life: 5000,
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'OS-WARN',
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
