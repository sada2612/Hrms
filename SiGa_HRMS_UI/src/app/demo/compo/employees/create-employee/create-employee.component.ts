import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Employee, Api, CredentialDto } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export default class CreateEmployeeComponent {
  imageUrl: any = '';
  active: any;
  projects: any;
  employee: any;
  employeeDto: Employee = new Employee();
  _message$ = new Subject<string>();
  imgchange = false;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  customdesignation: any = '';
  constructor(
    private router: Router,
    private AlertService: AlertService,
    private ApiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getProjects();
  }

  getProjects() {
    this.ApiService.GetAll(Api.Project).subscribe((data) => {
      this.projects = data['result'];
    });
  }

  async addCustom() {
    if (this.employeeDto.designation == 'Custom') {
      const { value: color } = await this.AlertService.CustomAlert('Enter Designation');
      if (color) {
        this.employeeDto.designation = color;
      } else {
        this.employeeDto.designation = null;
      }
    } else if (this.employeeDto.qualification == 'Custom') {
      const { value: color } = await this.AlertService.CustomAlert('Enter Qualification');
      if (color) {
        this.employeeDto.qualification = color;
      } else {
        this.employeeDto.qualification = null;
      }
    }
  }
  addEmployee() {
    if (this.imgchange == true) {
      this.employeeDto.imgUrl = this.imageUrl;
    }
    if (this.employeeDto.projectId == 0) {
      this.employeeDto.projectId = null;
    }
    this.ApiService.Add(this.employeeDto, Api.Employee).subscribe((response) => {
      if (response == true) {
        this.ApiService.getbyemail(this.employeeDto.email, Api.Employee).subscribe((data) => {
          var Credential = new CredentialDto();
          Credential.employeeId = data['result']['employeeId'];
          Credential.email = this.employeeDto.email;
          data['result']['Designation'] == 'HR Executive' ? (Credential.role = 'Hr') : (Credential.role = 'Employee');
          this.ApiService.Add(Credential, Api.UserRole).subscribe((datak) => {
            if (datak) {
              this.AlertService.ToastAlert('Employee Added Sucessfully').then(() => this.router.navigate([`admin/employees`]));
            }
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
        (this.imageUrl = e.target.result.toString()),
          this.AlertService.SelectedImageConfirm(e).then((data) => {
            if (data.isConfirmed) {
              this.imgchange = true;
            }
          });
      };
      reader.readAsDataURL(file);
    }
  }

  async EmailValidate() {
    this.ApiService.ValidateEmail(this.employeeDto.email, Api.Employee).subscribe((res) => {
      if (!res) {
        this.AlertService.Invalid('Warning', 'Your Email is Invalid :)', 'error').then((res) => {
          if (res.isConfirmed) {
            this.employeeDto.email = '';
          }
        });
      }
    });
  }
}
