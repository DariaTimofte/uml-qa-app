import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import noUiSlider from "nouislider";
import { AuthenticationService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
})
export class IndexComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus;
  focus1;
  focus2;
  date = new Date();
  pagination = 3;
  pagination1 = 1;

  passwordChange: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ])
  });
  signUpForm: FormGroup = new FormGroup({});
  loginForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{6,}/
      ),
    ]),
  });

  constructor(
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) { }
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  ngOnInit() {
    this.signUpForm = new FormGroup(
      {
        email: new FormControl("", [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]),
        password: new FormControl("", [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{6,}/
          ),
        ]),
        confirmPassword: new FormControl("", [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{6,}/
          ),
        ]),
      },
      { validators: this.passwordMatchingValidator }
    );

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    var slider = document.getElementById("sliderRegular");

    noUiSlider.create(slider, {
      start: 40,
      connect: false,
      range: {
        min: 0,
        max: 100,
      },
    });

    var slider2 = document.getElementById("sliderDouble");

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
    });
  }

  passwordMatchingValidator(form: FormGroup) {
    const password = form.get("password").value;
    const confirmation = form.get("confirmPassword").value;

    if (!password || !confirmation) {
      // if the password or confirmation has not been inserted ignore
      return null;
    }

    if (confirmation.length > 0 && confirmation !== password) {
      form.get("confirmPassword").setErrors({ notMatch: true }); // set the error in the confirmation input/control
    }

    return null; // always return null here since as you'd want the error displayed on the confirmation input
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  register() {
    this.authService.SignUp(
      this.signUpForm.get("email").value,
      this.signUpForm.get("password").value
    );
  }

  checkFieldValidity(fieldName: string, action: string) {
    let errors =
      action === "login"
        ? this.loginForm.get(fieldName)?.errors
        : this.signUpForm.get(fieldName)?.errors;
    if (errors == null) {
      return null;
    }

    let touched =
      action === "login"
        ? this.loginForm.get(fieldName)?.touched
        : this.signUpForm.get(fieldName)?.touched;
    if (errors?.required && touched) {
      return fieldName === "confirmPassword"
        ? "Please confirm your password!"
        : fieldName[0].toUpperCase() +
        fieldName.substring(1).toLowerCase() +
        " is required!";
    }
    if (errors?.pattern) {
      return fieldName === "password" || fieldName === "confirmPassword"
        ? "Your password needs to have at least 6 characters and contain one uppercase, " +
        "one lowercase and one special character and one digit."
        : "Please introduce a valid email address.";
    }
    if (errors?.notMatch) {
      return "Your passwords don't match!";
    }
  }

  googleSignIn() {
    this.authService.GoogleAuth();
  }

  login() {
    this.authService.SignIn(
      this.loginForm.get("email").value,
      this.loginForm.get("password").value
    );
  }

  sendEmail() {
    this.authService.resetPasswordInit(this.passwordChange.get("email").value)
      .then(
        () => this.snackBar.open("A password reset link has been sent to your email address!", "Close"),
        (rejectionReason) => alert(rejectionReason))
      .catch(e => this.snackBar.open("An error occurred while attempting to reset your password"));
  }
}
