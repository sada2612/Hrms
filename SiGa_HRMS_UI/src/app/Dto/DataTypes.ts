export enum Api {
  Client = 'Client',
  Employee = 'Employee',
  Project = 'Project',
  Applicant = 'Applicant',
  Attendance = 'Attendance',
  Holiday = 'Holiday',
  Leave = 'Leave',
  LeaveBalance = 'LeaveBalance',
  Job = 'Job',
  Event = 'Event',
  UserRole = 'UserRole',
  Bank='Bank',
  OfficeFest='OfficeFest'
}

export class Bank{
  bankName:string;
  bankAccNumber:any
  bankIfscCode:any;
  bankBranch:any;
  EmployeeId:any;
  id:any
}
export class Job {
  jobId: number = 0;
  title: string;
  postionType: string;
  department: string;
  noOfPostions: number;
  expriance: string;
  qualification: any;
  reportingTo: string;
  skill: string;
  description: any;
  postingDate: any;
  rolesAndResponsibility:any
}

export class EmailDto{
  toEmail:string;
  subject :string
  body :string
}
export class Applicant {
  applicantId: number = 0;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  expriance: string;
  phone: string;
  address: string;
  imgUrl: string;
  interviewDate: string;
  dateOfBirth: any;
  job: Job;
  jobId: number = null;
  qualification: string;
  interviewTime: any;
  employeeId:any=null;
  employee:any=null;
  resumeUrl: string;
  status: string;
  feedBack:string=null;
  onBoardDate:any=null
}

export class Attendance {
  attendanceId: number;
  checkIn: any = null;
  checkOut: any = null;
  date: string;
  workingHours: any = null;
  status: string;
  employeeId: number;
  employee: Employee = null;
}

export class Employee {
  employeeId: number = 0;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  gender: string;
  expriance: string;
  address: string;
  phone: string;
  imgUrl: string = '';
  joinDate: string;
  dateOfBirth: any;
  projectId: number = null;
  slackUrl: string = null;
  project: Project = null;
  currentAddress:any=null;
  firstJobDoj:any=null;
  bloodGroup:any=null;
  slackEmail:any=null
  emergencyPhone:any=null
  personalEmail:any=null
  qualification:any=null

}

export class Fest{
  name: string=null;
  date: any=null;
  photos:any[]=[]
}
export class Project {
  projectId: number = 0;
  projectName: string;
  status: string;
  email: string;
  logoUrl: string = '';
  onBoradDate: string;
  clientId: any = null;
  client: Client = null;
}

export class Client {
  clientId: number = 0;
  firstName: string;
  lastName: string=' ';
  email: string;
  gender: string=' ';
  country: string;
  phone: string;
  address: string;
  imgUrl: string = '';
  joinDate: string;
}

export class Event {
  eventID: number = 0;
  name: string;
  date: any;
  details: string;
  imgUrl: string = '';
  email: string = '';
}

export class Holiday{
    holidayId: number =0 ;
    title: string ;
    type: string ;
    startDate: string ='' ;
    details: number;
    imgUrl:string='';
}

export class Leave{
    leaveId: number =0;
    leaveType: string ;
    applyDate: any ;
    formDate:any='';
    toDate: any='';
    details: string ;
    status: string ='Initiated' ;
    employee:Employee=null;
    employeeId: number = null ;
    leaveLength:any='Full'
}

export class CalendarDto {
    date: Date;
    eventName: string;
  }
  
export class LeaveBalance{
    leaveBalanceId: number =0;
    entitled: number ;
    utilized: number ;
    carried_Forworded:number;
    date: any;
    lastUpdated: any ;
    employee:Employee;
    employeeId: number = null ;
}

export class NotificationDto{
    Name:string;
    Link:string;
    Time:string;
    Icon:string;
    color:string
}

export class CredentialDto{
    userRoleId: number=0 ;
    email: string;
    employee: Employee=null;
    employeeId: number ;
    password: string='' ;
    role: string;
}
