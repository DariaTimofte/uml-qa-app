import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-change-password",
    templateUrl: "change-password.component.html"
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    ngUnsubscribe: Subject<any> = new Subject<any>();

    isCollapsed = true;
    // The user management action to be completed
    mode: string;
    // Just a code Firebase uses to prove that
    // this is a real password reset.
    actionCode: string;

    actionCodeChecked: boolean;

    resetPassword = new FormGroup({
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
        { validators: this.passwordMatchingValidator });

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private auth: AngularFireAuth,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(params => {
                // if we didn't receive any parameters, 
                // we can't do anything
                if (!params) this.router.navigate(['/home']);

                this.mode = params['mode'];
                this.actionCode = params['oobCode'];

                switch (params['mode']) {
                    case "resetPassword": {
                        // Verify the password reset code is valid.
                        this.auth.verifyPasswordResetCode(this.actionCode)
                            .then(email => {
                                this.actionCodeChecked = true;
                            }).catch(e => {
                                // Invalid or expired action code. Ask user to try to
                                // reset the password again.
                                alert(e);
                                this.router.navigate(['/auth/login']);
                            });
                    } break
                    default: {
                        this.router.navigate(['/auth/login']);
                    }
                }
            })
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

    checkFieldValidity(fieldName: string) {
        let errors = this.resetPassword.get(fieldName)?.errors;
        if (errors == null) {
            return null;
        }

        let touched = this.resetPassword.get(fieldName)?.touched;
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

    /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
    handleResetPassword() {
        // Save the new password.
        this.auth.confirmPasswordReset(
            this.actionCode,
            this.resetPassword.get("password").value
        )
            .then(resp => {
                // Password reset has been confirmed and new password updated.
                this.snackBar.open('New password has been saved', 'Close');
                this.router.navigate(['/home']);
            }).catch(e => {
                // Error occurred during confirmation. The code might have
                // expired or the password is too weak.
                this.snackBar.open(e, 'Close');
            });
    }

    backToHome() {
        this.router.navigateByUrl('/home');
    }

    ngOnDestroy() { }
}