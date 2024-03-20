import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Employee, Api } from 'src/app/Dto/DataTypes';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-birthday-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.scss']
})
export default class BirthdayListComponent {
  employees: Employee[] = [];
  constructor(private ApiService: ApiService) {
    this.getEmployees();
  }

  calculateAge(dateOfBirth: string): number | null {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return null;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getEmployees() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.employees = this.upcomingArray(data['result']);
    });
  }
  birthdayimg(data) {
    var res =
      'https://images.unsplash.com/photo-1604135307399-86c6ce0aba8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80';
    var res1 = `http://localhost:5102/Uploads/Employee/${data.email}/${data.imgUrl}`;
    return data.imgUrl != '' ? res1 : res;
  }
  upcomingArray(date) {
    var newarray = [];
    var newarray1 = [];
    date
      .sort((a, b) => {
        return (
          new Date(new Date().getFullYear(), new Date(a.dateOfBirth).getMonth(), new Date(a.dateOfBirth).getDate()).getTime() -
          new Date(new Date().getFullYear(), new Date(b.dateOfBirth).getMonth(), new Date(b.dateOfBirth).getDate()).getTime()
        );
      })
      .forEach((data) => {
        if (new Date(new Date().getFullYear(), new Date(data.dateOfBirth).getMonth(), new Date(data.dateOfBirth).getDate()) < new Date()) {
          newarray1.push(data);
        } else {
          newarray.push(data);
        }
      });

    return [...newarray, ...newarray1];
  }
}
