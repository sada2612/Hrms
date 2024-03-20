import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Applicant, Job, Api, Employee } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-interview',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss']
})
export default class CreateInterviewComponent {
  applicantDto: Applicant = new Applicant();
  status: boolean;
  jobs: Job[];
  imageUrl: any;
  resumeUrl: any;
  emps: Employee[];
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  constructor(
    private ApiService: ApiService,
    private AlertService: AlertService,
    private router: Router,
    private datePipe: DatePipe,
    private CommonService: CommonService
  ) {
    this.getJobs();
    this.empList();
  }

  empList() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.emps = data['result'];
    });
  }
  async addCustom() {
    if (this.applicantDto.qualification == 'Custom') {
      const { value: Qualification } = await this.AlertService.CustomAlert('Enter Qualification');
      if (Qualification) {
        this.applicantDto.qualification = Qualification;
      } else {
        this.applicantDto.qualification = null;
      }
    }
  }
  getJobs() {
    this.ApiService.GetAll(Api.Job).subscribe((data) => {
      this.jobs = data['result'];
    });
  }
  async addApplicant() {
    this.applicantDto.imgUrl = this.imageUrl;
    this.applicantDto.resumeUrl = this.resumeUrl;
    this.applicantDto.status = 'Scheduled';
    this.ApiService.Add(this.applicantDto, Api.Applicant).subscribe(async (response) => {
      if (response == true) {
        this.AlertService.ToastAlert('Interview Added Sucessfully').then(async () => {
          await this.ApiService.sendemail(this.CommonService.InterviewSheudleEmailTemplate(this.applicantDto)).subscribe(() => {
            this.router.navigate([`admin/interviews`]);
          });
        });
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }

  async selectImage() {
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()), this.AlertService.SelectedImageConfirm(e);
      };
      reader.readAsDataURL(file);
    }
  }

  async selectResume() {
    const { value: file } = await this.AlertService.SelectResumePopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.resumeUrl = e.target.result.toString()), this.AlertService.SelectedResumeConfirm(this.resumeUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  async EmailValidate() {
    this.ApiService.ValidateEmail(this.applicantDto.email, Api.Applicant).subscribe((res) => {
      if (!res) {
        this.AlertService.Invalid('Warning', 'Your Email is Invalid :)', 'error').then((res) => {
          if (res.isConfirmed) {
            this.applicantDto.email = '';
          }
        });
      }
    });
  }
}
