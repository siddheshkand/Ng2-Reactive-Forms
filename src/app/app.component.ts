import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {rangeValidator2, emailMatcher} from './validators';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'reactive-forms';
  userForm: FormGroup;
  emailErrorMessage = "";
  validationMessages = {
    required: 'Please enter your email',
    pattern: 'Please enter valid email',
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      rating: [0, [Validators.required, rangeValidator2(1, 10)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')],],
        confirmEmail: ['', Validators.required]
      }, {validators: emailMatcher}),
      dateGroup: this.fb.group({
        startDate: ["", [Validators.required]],
        endDate: ["", [Validators.required]],
      })
    });
    const emailControl = this.userForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe(value =>
      this.setErrorMessage(emailControl)
    );
  }

  submitForm() {
    console.log(this.userForm.value);
  }

  fillTestData() {
    this.userForm.patchValue({
      firstName: "Siddhesh",
      lastName: "Kand",
      rating: 5,
      emailGroup: {
        email: "abc@gm.com",
        confirmEmail: "abc@gm.com"
      },
      dateGroup: {
        startDate: "2020-06-18",
        endDate: "2020-06-22",
      }
    });
  }

  setErrorMessage(emailControl: AbstractControl): void {
    this.emailErrorMessage = "";
    if ((emailControl.touched || emailControl.dirty) && emailControl.errors) {
      this.emailErrorMessage = Object.keys(emailControl.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }
}
