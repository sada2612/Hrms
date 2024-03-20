import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailDto } from '../Dto/DataTypes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}
  Url = `http://localhost:5102/api/`;

  GetAll(Endpoint: string): Observable<any> {
    return this.http.get<any>(this.Url + Endpoint);
  }

  Get(Id: any, Endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.Url + Endpoint}/${Id}`);
  }

  Add(Data: any, Endpoint: string): Observable<any> {
    return this.http.post<any>(this.Url + Endpoint, Data);
  }

  Update(Data: any, Endpoint: string): Observable<any> {
    return this.http.put<any>(this.Url + Endpoint, Data);
  }

  Delete(Id: any, Endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.Url + Endpoint}/${Id}`);
  }

  ValidateEmail(Data: string, Endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.Url}${Endpoint}/email/${Data}`);
  }

  GetByUsing(Data: any, Endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.Url}${Endpoint}/AttendanceByDate/${Data}`);
  }

  GetWeelyAttedanceByUsingDate(id: number, Data: any, Endpoint: string): Observable<any> {
    const params = { id };
    return this.http.get<any>(`${this.Url}${Endpoint}/GetWeelyAttedanceByUsingDate/${Data}`, { params });
  }

  login(email: string, password: string, Endpoint: string): Observable<any> {
    const params = { email, password };
    return this.http.get<any>(`${this.Url}${Endpoint}/login`, { params });
  }
  JwtDecode(token:string, Endpoint: string): Observable<any> {
    const params = { token };
    return this.http.get<any>(`${this.Url}${Endpoint}/decode`, { params });
  }

  getbyemail(email: string, Endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.Url}${Endpoint}/getbyemail/${email}`);
  }
  sendemail(Data: EmailDto): Observable<any> {
    return this.http.post<any>(`${this.Url}Email/send-email`, Data);
  }

  updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes}:${seconds} ${amPm}`;
  };
}
