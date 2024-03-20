import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export default class CreateJobComponent {
  jobDto: Job = new Job();
  status: boolean;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {}

  async addCustom() {
    if (this.jobDto.postionType == 'Custom') {
      const { value: PostionType } = await this.AlertService.CustomAlert('Enter PostionType');
      if (PostionType) {
        this.jobDto.postionType = PostionType;
      } else {
        this.jobDto.postionType = null;
      }
    } else if (this.jobDto.qualification == 'Custom') {
      const { value: Qualification } = await this.AlertService.CustomAlert('Enter Qualification');
      if (Qualification) {
        this.jobDto.qualification = Qualification;
      } else {
        this.jobDto.qualification = null;
      }
    }
  }
  addJob() {
    this.ApiService.Add(this.jobDto, Api.Job).subscribe((response) => {
      if (response == true) {
        this.AlertService.ToastAlert('Job Added Sucessfully').then(() => this.router.navigate([`admin/jobs`]));
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }
}
