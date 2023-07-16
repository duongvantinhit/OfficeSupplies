import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(private _fb: FormBuilder, private authServices: AuthService) {}
    loginForm: any;
    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    login() {
        console.log(this.loginForm.value);
        this.authServices.login('/SigIn', this.loginForm.value).subscribe((res) => {
            console.log(res.data.token);
            localStorage.setItem('token', res.data.token);
        });
    }
}
