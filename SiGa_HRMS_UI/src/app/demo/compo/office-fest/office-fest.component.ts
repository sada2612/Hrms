import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Fest } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-office-fest',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './office-fest.component.html',
  styleUrls: ['./office-fest.component.scss']
})
export default class OfficeFestComponent {
  festDto: Fest = new Fest();
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {}

  onFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      var filesAmount = e.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.festDto.photos.push(event.target.result);
        };
        reader.readAsDataURL(e.target.files[i]);
      }
    }
  }
  AddFest() {
    this.ApiService.Add(this.festDto, Api.OfficeFest).subscribe((data) => {
      if (data == true) {
        this.AlertService.ToastAlert('OfficeFest Added Sucessfully').then(() => this.router.navigate(['admin/dashboard']));
      }
    });
  }
}
