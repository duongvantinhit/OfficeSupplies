import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-crud-category',
    templateUrl: './crud-category.component.html',
    styleUrls: ['./crud-category.component.scss'],
})
export class CrudCategoryComponent implements OnInit {
    constructor(private _router: Router, private _apiServices: AdminService) {}
    uploadImg: any;
    img: any;
    ngOnInit() {}
    onFileSelected(event: any) {
        console.log(event);
        this.uploadImg = event.originalEvent.target.files[0];
        this.img = this.uploadImg.name;
    }

    onSubmit() {
        const formUploadImg: FormData = new FormData();
        formUploadImg.append('file', this.uploadImg, this.uploadImg.name);
        this._apiServices.postData('/upload', formUploadImg).subscribe((res) => {
            console.log(res.url);
        });
    }
}
