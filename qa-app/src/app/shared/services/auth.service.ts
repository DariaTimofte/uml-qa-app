import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from "rxjs";
import firebase from "firebase/compat/app";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { GoogleAuthProvider } from "firebase/auth";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  userData: Observable<firebase.User>;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    this.userData = angularFireAuth.authState;
  }

  // Current user data
  currentUser() {
    // retrieve user data from collection
    return firebase.auth().currentUser.email;
  }

  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.userService.createUser();
        this.snackBar.open("Successfully signed up!", "Close");
      })
      .catch((error) => {
        this.snackBar.open(error.message, "Close");
      });
  }

  /* Sign in */
  SignIn(email: string, password: string) {
    this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.snackBar.open("Successfully logged in!", "Close");
        this.router.navigateByUrl("/landing");
      })
      .catch((err) => {
        this.snackBar.open(err.message, "Close");
      });
  }

  /* Sign out */
  SignOut() {
    this.angularFireAuth
      .signOut()
      .then((res) => {
        this.snackBar.open("Successfully logged out!", "Close");
        this.router.navigateByUrl("/home");
      })
      .catch((err) => {
        this.snackBar.open(err.message, "Close");
      });
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        let loggedUser = this.userService.getLoggedInUserData();
        console.log(loggedUser)
        this.snackBar.open("Successfully logged in!", "Close");
        this.router.navigateByUrl("/landing");
      })
      .catch((error) => {
        this.snackBar.open(error.message, "Close");
      });
  }

  /** 
   * Initiate the password reset process for this user 
   * @param email email of the user 
   */
  resetPasswordInit(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }
}
