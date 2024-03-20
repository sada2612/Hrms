import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success m-3',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  CPassword = () =>
    Swal.fire({
      title: 'Password?',
      text: 'Password Not Match?',
      icon: 'question'
    });

  SimpleAlert = (data) => Swal.fire(data);

  SendOtp = (email) =>
    Swal.fire({
      title: 'You Want Send Otp To Email',
      input: 'text',
      inputLabel: 'Email',
      inputPlaceholder: `${email}`,
      inputValue: `${email}`,
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      confirmButtonText: 'Send Otp'
    });

  AddSucessAlert = (text) => {
    let timerInterval;
    Swal.fire({
      icon: 'success',
      title: 'SucessFull!',
      html: `${text} Added Sucessfully`,
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector('b');
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  };

  CheckOutAlert = (name) =>
    Swal.fire({
      title: 'Are you sure?',
      html: `Hi <b>${name}</b>, You want CheckOut Attedance !`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, CheckOut it!'
    });

  updateAlert = (title) =>
    Swal.fire({
      icon: 'warning',
      title: `Do you want to save the ${title} changes?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`
    });

  errorAlert = () =>
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!'
    });

  deleteSuccessAlert = () =>
    this.swalWithBootstrapButtons.fire({
      title: 'Deleted!',
      text: 'Your file has been deleted.',
      icon: 'success'
    });

  deleteCancelAlert = () =>
    this.swalWithBootstrapButtons.fire({
      title: 'Cancelled',
      text: 'Your imaginary file is safe :)',
      icon: 'error'
    });

  DeleteConfirm = () =>
    this.swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });

  SelectedImageConfirm = (e) =>
    Swal.fire({
      title: 'Your uploaded picture',
      imageUrl: e.target.result.toString(),
      imageAlt: 'The uploaded picture'
    });

  SelectedResumeConfirm = (e) =>
    Swal.fire({
      title: 'Your uploaded Resume',
      html: `<iframe width="100%" height="500px" src="${e}" frameborder="0" allowfullscreen></iframe>`,
      showConfirmButton: true
    });

  SelectImgPopup = () =>
    Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    });

  SelectResumePopup = () =>
    Swal.fire({
      title: 'Select File',
      input: 'file',
      inputAttributes: {
        accept: 'pdf/*',
        'aria-label': 'Upload Your Resume'
      }
    });

  Invalid = (title, text, icon) =>
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    });

  InputAlert = (title, input, inputLabel, inputPlaceholder) =>
    Swal.fire({
      title: title,
      input: input,
      inputLabel: inputLabel,
      inputPlaceholder: inputPlaceholder
    });
  FeedBack = (firstName) =>
    Swal.fire({
      input: 'textarea',
      title: 'FeedBack',
      inputPlaceholder: `Type your message for ${firstName}'s ...`,
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      confirmButtonText: 'Submit'
    });

  FeedBackConfirm = (text) =>
    Swal.fire({
      title: '<strong>FeedBack</strong>',
      html: text,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: `
         Add
      `
    });

  FeedBackResult = (text) =>
    Swal.fire({
      title: '<strong>FeedBack</strong>',
      html: `
        ${text}
      `,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: `
         Select!
      `,
      cancelButtonText: `
        Reject
      `
    });

  ViewFeedBack = (text) => {
    var viewdata = '<div style="margin-bottom: 25px;">';
    text.split(',').forEach((data) => {
      if (data.split('').length != 2) {
        viewdata += data + '<br></div>';
      }
    });
    Swal.fire({
      title: '<strong>FeedBack</strong><hr>',
      html: `<div style="margin-bottom: 15px ;">${viewdata}</div>`
    });
  };
  UpdateSuccess = () => Swal.fire(`Data Saved!`, '', 'success');

  UpdateErrorAlert = () => Swal.fire('Changes are not saved', '', 'info');

  AttedanceDateAlert = (title) =>
    Swal.fire({
      title: `${title}`,
      input: 'date',
      didOpen: () => {
        const today = new Date().toISOString();
        Swal.getInput().max = today.split('T')[0];
      }
    });

  LeaveApprove = (title, btntext) =>
    this.swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: title,
      showCancelButton: true,
      confirmButtonText: `${btntext} !`,
      cancelButtonText: 'Cancel!',
      reverseButtons: true
    });
  Onboard = () =>
    Swal.fire({
      title: 'Select Onboard Date',
      input: 'date',
      didOpen: () => {
        const today = new Date().toISOString();
        Swal.getInput().min = today.split('T')[0];
      }
    });
  date = () =>
    Swal.fire({
      title: 'select attedance date',
      input: 'date'
    });

  NotfoundAlert = () =>
    Swal.fire({
      title: 'Not Found?',
      text: 'That thing is still around?',
      icon: 'question'
    });

  CustomAlert = (title) =>
    Swal.fire({
      title: `${title}`,
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose something!';
        } else {
          return null;
        }
      }
    });

  ToastAlert = (data) =>
    this.Toast.fire({
      icon: 'success',
      title: `${data}`
    });
  BankFromAlert = () =>
    Swal.fire({
      title: 'Bank Details',
      html: `             
                <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="bankName">Bank Name</label>
                    <select
                      type="text"
                      class="form-control"
                      id="bankName"
                      placeholder="Select Bank Name"
                    >
                      <option value="HDFC Bank"> HDFC Bank</option>
                      <option value="Bank Of India"> Bank Of India</option>
                    </select></div
                  >                
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="bankAccNumber">Account Number</label>
                    <input
                      type="text"
                      class="form-control"
                      id="bankAccNumber"
                      placeholder="Enter Account Number"
                    />
                  </div>
                </div>
                </div>
                <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="bankIfscCode">Bank IFSC Code</label>
                    <input
                      type="text"
                      class="form-control"
                      id="bankIfscCode"
                      placeholder="Enter IFSC Code"
                    /></div
                  >                
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="bankBranch">Branch Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="bankBranch"
                      placeholder="Enter Bank Branch"
                    />
                  </div>
                </div>
                </div>
             
      `,
      focusConfirm: true,
      preConfirm: () => {
        var bankNameElement = document.getElementById('bankName') as HTMLSelectElement;
        var bankAccNumberElement = document.getElementById('bankAccNumber') as HTMLInputElement;
        var bankIfscCodeElement = document.getElementById('bankIfscCode') as HTMLInputElement;
        var bankBranchElement = document.getElementById('bankBranch') as HTMLInputElement;
        var bankNameValue = bankNameElement.value;
        var bankAccNumberValue = bankAccNumberElement.value;
        var bankIfscCodeValue = bankIfscCodeElement.value;
        var bankBranchValue = bankBranchElement.value;
        return {
          bankName: bankNameValue,
          bankAccNumber: bankAccNumberValue,
          bankIfscCode: bankIfscCodeValue,
          bankBranch: bankBranchValue
        };
      }
    });
}
