import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { AlertService } from 'src/app/services/alert.service';
import { Job, Api } from 'src/app/Dto/DataTypes';

@Component({
  selector: 'app-jobslist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './jobslist.component.html',
  styleUrls: ['./jobslist.component.scss']
})
export default class JobslistComponent {
  jobDto: Job = new Job();
  jobs: Job[];
  active: any;

  constructor(private ApiService: ApiService) {
    this.getJobs();
  }

  getJobs() {
    this.ApiService.GetAll(Api.Job).subscribe((data) => {
      this.jobs = data['result'];
    });
  }
}
