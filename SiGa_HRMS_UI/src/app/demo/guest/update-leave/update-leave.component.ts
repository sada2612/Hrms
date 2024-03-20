import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Leave, Employee, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-leave',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './update-leave.component.html',
  styleUrls: ['./update-leave.component.scss']
})
export default class UpdateLeaveComponent {
  leaveDto: Leave;
  status: boolean;
  employees: Employee;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.getEmpLeave(this.route.snapshot.paramMap.get('id'));
  }

  getEmpLeave(id) {
    this.ApiService.Get(id, Api.Leave).subscribe((data) => {
      this.leaveDto = data['result'];
    });
  }
  updateLeave() {
    this.AlertService.updateAlert('Leave').then((result) => {
      if (result.isConfirmed) {
        this.leaveDto.employee = null;

        this.ApiService.Update(this.leaveDto, Api.Leave).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['guest/leave']);
              }
            });
          } else if (response == false) {
            this.AlertService.errorAlert();
          }
        });
      } else if (result.isDenied) {
        this.AlertService.UpdateErrorAlert();
      }
    });
  }
  onDateChange(selectedDate: string) {
    const date = new Date(selectedDate);
    if (new Date(date) >= new Date()) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops...', 'You Selected Weekday !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.formDate = '';
          }
        });
      }
    } else {
      this.AlertService.Invalid('Oops...', 'You Selected Date Not Valid !', 'error').then((data) => {
        if (data.isConfirmed) {
          this.leaveDto.formDate = '';
        }
      });
    }
  }

  toonDateChange(selectedDate: string) {
    const date = new Date(selectedDate);

    if (new Date(date) >= new Date(this.leaveDto.formDate)) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops...', 'You Selected Weekday !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.toDate = '';
          }
        });
      }
    } else {
      if (this.leaveDto.formDate == '') {
        this.AlertService.Invalid('Oops...', 'Please Select From Date !', 'error').then(() => {
          this.leaveDto.toDate = '';
        });
      } else {
        this.AlertService.Invalid('Oops...', 'You Selected Date Not Valid !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.toDate = '';
          }
        });
      }
    }
  }

  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 6 && day !== 0;
  }
}
