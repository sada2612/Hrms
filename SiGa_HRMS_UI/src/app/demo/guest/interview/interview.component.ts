import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Applicant, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export default class InterviewComponent {
  active: any;
  applicantDto: Applicant;
  interviews: Applicant[];
  todayInterviews: Applicant[];
  today: any;
  email: any;

  constructor(
    private ApiService: ApiService,
    private datePipe: DatePipe,
    private AlertService: AlertService,
    private CommonService: CommonService
  ) {
    this.today = this.datePipe.transform(new Date(), 'MMM d, y');
    this.decodeJwt();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.email = data['email'];
      this.getInterviews();
    });
  }
  getInterviews() {
    this.ApiService.GetAll(Api.Applicant).subscribe((data) => {
      this.interviews = data['result'].filter((data: Applicant) => {
        return data.jobId != null && data.employee.email == this.email;
      });
      this.todayInterviews = this.interviews.filter((date) => new Date(date.interviewDate) >= new Date());
    });
  }

  feedbackcheck(id) {
    let nn = true;
    var kk = this.interviews.find((data) => {
      return data.applicantId == id;
    });
    if (kk.feedBack == null) {
      return true;
    } else {
      kk.feedBack.split(',').forEach((data) => {
        if (data.split(':')[0].split('<')[1] == `b>${kk.employee.firstName}`) {
          nn = false;
        }
      });
    }

    return nn;
  }
  todayInterview(date) {
    const currentDate = formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
    this.todayInterviews = this.interviews.filter((date) => date.interviewDate == currentDate);
    this.today = this.datePipe.transform(new Date(currentDate), 'MMM d, y');
  }

  FeedBackview(text) {
    this.AlertService.ViewFeedBack(text);
  }
  getApplicant(Id: any) {
    this.ApiService.Get(Id, Api.Applicant).subscribe((data) => {
      this.applicantDto = data['result'];
    });
  }

  async FeedBackDone(id) {
    var user = this.todayInterviews.find((data) => {
      return data.applicantId == id;
    });
    const { value: text } = await this.AlertService.FeedBack(user.firstName);
    if (text) {
      this.AlertService.FeedBackConfirm(text).then((data) => {
        if (data.isConfirmed) {
          user.feedBack = `${user.feedBack == null ? ' ' : user.feedBack} , <b>${user.employee.firstName}</b> : ${text}`;
          this.ApiService.Update(user, Api.Applicant).subscribe(async (res) => {
            if (res) {
              this.AlertService.ToastAlert('FeedBack Submited').then(() => {
                this.getInterviews();
              });
            }
          });
        }
      });
    }
  }

  TimePipe(timeString) {
    return this.CommonService.TimePipe(timeString);
  }

  async selectDate() {
    const { value: date } = await this.AlertService.Onboard();
    if (date) {
      this.AlertService.SimpleAlert(`Interview Date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayInterview(date);
          if (this.todayInterviews.length == 0) {
            this.AlertService.Invalid('Not Found?', 'That thing is still around?', 'question').then(() =>
              this.todayInterview(this.datePipe.transform(new Date(), 'MMM d, y'))
            );
          }
        }
      });
    }
  }
}
