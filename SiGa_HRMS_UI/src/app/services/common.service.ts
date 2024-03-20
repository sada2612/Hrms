import { Injectable } from '@angular/core';
import { Applicant, EmailDto } from '../Dto/DataTypes';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private datePipe: DatePipe) {}
  Total(checkIn) {
    const currentDate = new Date();
    const checkInTimeParts = checkIn.split(':');
    const checkInDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(checkInTimeParts[0]),
      Number(checkInTimeParts[1]),
      Number(checkInTimeParts[2])
    );
    const timeDifference = currentDate.getTime() - checkInDate.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  convertDecimalToTime(decimalTime) {
    const hours = Math.floor(decimalTime);
    const minutes = Math.floor((decimalTime - hours) * 60);
    const seconds = Math.floor((decimalTime * 3600) % 60);

    const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    return formattedTime;
  }

  convertTimeToDecimal(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const decimalTime = hours + minutes / 60 + seconds / 3600;
    return Number(decimalTime.toFixed(2));
  }
  
  TimePipe(timeString:string) {
    const timeArray = timeString.split(':');
    const date = new Date();
    date.setHours(Number(timeArray[0]));
    date.setMinutes(Number(timeArray[1]));
    date.setSeconds(Number(timeArray[2]));

    return this.datePipe.transform(date, 'h:mm a');
  }
  padZero(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }

  InterviewSheudleEmailTemplate(data: Applicant) {
    var Email = new EmailDto();

    Email.toEmail = data.email;
    Email.subject = 'Interview';
    Email.body = `<body style="font-family:Arial, sans-serif; margin: 0; padding: 0; ">
    <div style="max-width: 600px; margin: 20px auto; border-radius: 8px;box-shadow:0 4px 8px rgba(0, 0, 0, 0.1) ;">     
        <div style="padding: 20px;">
            <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;">Dear ${data.firstName} ${data.lastName},</p>
            <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;">This is HR Riddhi  from SiGa Systems Pvt. Ltd</p>
            <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;">Your face to face interview scheduled on ${this.datePipe.transform(
              data.interviewDate,
              'MMM d, y'
            )} ${this.daysOfWeek[new Date(data.interviewDate).getDay()]} at ${this.TimePipe(
              data.interviewTime
            )}  for the position of dev at SiGa Systems Pvt. Ltd.</p>
            <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;">Kindly confirm your availability and be available for the face to face interview before 15 minutes (${this.TimePipe(
              data.interviewTime
            )}) .</p>
            <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;"><b>Interview Venue</b>: <br>
                Address : SiGa Systems Pvt Ltd.,<br>
                Office No. 101, First Floor,<br>
                Metropole, Near BRT Bus Stop,<br>
                Dange Chowk, Pune,<br>
                Maharashtra 411033.</p>

                <b>Please carry updated hard-copy of your resume</b>
               <p style="font-size: 16px;line-height: 1.6;margin-bottom: 20px;">
                Best of Luck ! <br><br>
                Best regards,<br>
HR Riddhi <br>
 SiGa Systems Pvt Ltd.,<br>
hr.sigasystems@gmail.com<br>
               </p>
        </div>
    </div>
</body>`;
    return Email;
  }

  forgetPassword(email,otp) {
    var Email = new EmailDto();
    Email.toEmail = email;
    Email.subject = 'Password OTP';
    Email.body = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Your Brand Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>`;
  return Email;
  }
  InterviewSelecetdEmailTemplate(data: Applicant, date) {
    var currentDate = new Date(data.interviewDate);
    const sevenDaysBack = new Date(data.interviewDate);
    sevenDaysBack.setDate(currentDate.getDate() + 2);

    var Email = new EmailDto();
    Email.toEmail = data.email;
    Email.subject = 'Interview Result';
    Email.body = `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0">
    <div
      style="
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="padding: 20px">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Greetings ${data.firstName},
        </p>
        <h4>CONGRATULATIONS!!!</h4>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Thank you very much for spending your valuable time with us and having a
          word about the vacant ${data.job.postionType} position. We have finished
          conducting our interviews. I want you to know that it was a pleasure
          getting to know you.
        </p>
  
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          On behalf of SiGa Systems Pvt. Ltd., I am delighted to inform you that
          we have determined that you are the best candidate for this position.
          And we have selected you for this position. Like we discussed in your
          interview, we would like to offer you a starting salary of 1.5 LPA i.e.
          ₹12,500 /- per month (₹200 /-will be deducted as a PT) and you will be
          joining our organization from ${this.datePipe.transform(date, 'MMM d, y')}.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          If you decide to accept this offer, please reply to this email by ${this.datePipe.transform(
            new Date(sevenDaysBack),
            'MMM d, y'
          )} for confirming that you have accepted the offer. I will be able to
          proceed with the further formalities once I receive your confirmation.
          You can also reach out to me if you have any doubts or queries.
        </p>
        <b
          >Kindly share the soft copies of following documents by mail as
          documents verification.</b
        ><br />
        <p><li>Aadhar Card</li></p>
        <p><li>Pan card</li></p>
        <p><li>passport size photos</li></p>
        <p><li>Educational Documents</li></p>
        <p><li>H.S.C & S.S.C Mark sheet / Certificate</li></p>
        <p><li>Graduation Degree Mark sheet / certificate</li></p>
        <p><li>Post-Graduation Degree Mark sheet/certificate.</li></p>
        ${data.expriance == '0' ? '' : '<p><li>Experience letter / Salary Slip.</li></p>'}
        <br /><br />
  
        <p>Looking forward to your response.</p>
  
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          <b>Address </b>: <br />
          Address : SiGa Systems Pvt Ltd.,<br />
          Office No. 101, First Floor,<br />
          Metropole, Near BRT Bus Stop,<br />
          Dange Chowk, Pune,<br />
          Maharashtra 411033.
        </p>
  
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Warm Regards, <br />
          Riddhi Badak <br />
          HR Department<br />
          SiGa Systems<br />
          Mobile: +91 9923489950<br />
          Email: hr.sigasystems@gmail.com | info@sigasystems.com<br />
          <a href="http://sigasystems.com/">http://sigasystems.com/</a><br />
        </p>
      </div>
    </div>
  </body>`;
    return Email;
  }

  InterviewRejectedEmailTemplate(data: Applicant) {
    var Email = new EmailDto();
    Email.toEmail = data.email;
    Email.subject = 'Interview Result';
    Email.body = `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0">
    <div
      style="
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="padding: 20px">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          This is HR Riddhi from SiGa Systems Pvt. Ltd
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Thank you for taking the time to apply for the ${data.job.postionType} role
          with Siga Systems. We appreciate your interest in joining our team.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          After careful consideration, we regret to inform you that unfortunately,
          our team did not select you for further consideration. Thank you again
          for the time you invested in applying and interviewing for this role at
          SiGa Systems.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Although we are unable to offer you a position at this time, we
          encourage you to keep an eye on our job portals for future opportunities
          that may be a better fit for your skills and experience. We wish you all
          the best in your job search and your future endeavors. Thank you again
          for considering a career with Sigs Systems.
        </p>
        <br />
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Best of Luck For future <br />
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          Sincerely, <br />
          HR Riddhi <br />
          SiGa Systems Pvt Ltd.,<br />
          hr.sigasystems@gmail.com <br />
        </p>
      </div>
    </div>
  </body>`;
    return Email;
  }

  workingHours(checkin, checkout) {
    const currentDate = new Date();
    const checkInTimeParts = checkin.split(':');
    const checkOutTimeParts = checkout.split(':');
    const checkInDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(checkInTimeParts[0]),
      Number(checkInTimeParts[1]),
      Number(checkInTimeParts[2])
    );

    const checkOutDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(checkOutTimeParts[0]),
      Number(checkOutTimeParts[1]),
      Number(checkOutTimeParts[2])
    );

    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  weekChart: ApexCharts;
  weekOptions: any;
  monthChart: ApexCharts;
  monthOptions: any;
  clock = () =>
    setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const amPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      return `${hours}:${minutes}:${seconds} ${amPm}`;
    }, 1000);
}
