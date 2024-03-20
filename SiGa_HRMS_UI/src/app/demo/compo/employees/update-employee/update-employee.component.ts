import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export default class UpdateEmployeeComponent {
  Employee: Employee;
  projects: any;
  imageUrl: string;
  imgchange = false;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private ApiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getProjects();
    this.getEmployee(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {}
  getProjects() {
    this.ApiService.GetAll(Api.Project).subscribe((data) => {
      this.projects = data['result'];
    });
  }

  async addCustom() {
    if (this.Employee.designation == 'Custom') {
      const { value: Designation } = await this.AlertService.CustomAlert('Enter Designation');
      if (Designation) {
        this.Employee.designation = Designation;
      } else {
        this.Employee.designation = null;
      }
    } else if (this.Employee.qualification == 'Custom') {
      const { value: Qualification } = await this.AlertService.CustomAlert('Enter Qualification');
      if (Qualification) {
        this.Employee.qualification = Qualification;
      } else {
        this.Employee.qualification = null;
      }
    }
  }
  updateEmployee() {
    if (this.imgchange && this.imageUrl != null) {
      this.Employee.imgUrl = this.imageUrl;
    }
    if (this.Employee.projectId == 0) {
      this.Employee.projectId = null;
    }

    this.AlertService.updateAlert('Employee').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.Employee, Api.Employee).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/employees']);
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

  async EmailValidate() {
    this.ApiService.ValidateEmail(this.Employee.email, Api.Employee).subscribe((res) => {
      if (!res) {
        this.AlertService.Invalid('Warning', 'Your Email is Invalid :)', 'error').then((res) => {
          if (res.isConfirmed) {
            this.Employee.email = '';
          }
        });
      }
    });
  }
  getEmployee(id: any) {
    this.ApiService.Get(id, Api.Employee).subscribe((data) => {
      this.Employee = data['result'];
    });
  }
  async selectImage() {
    this.imgchange = true;
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()), this.AlertService.SelectedImageConfirm(e);
      };

      reader.readAsDataURL(file);
    }
  }
}
