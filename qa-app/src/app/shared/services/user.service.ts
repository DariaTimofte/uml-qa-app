import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import firebase from "firebase/compat/app";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  // create reference to user with other fields
  createUser() {
    let loggedUser = firebase.auth().currentUser.email;
    let user = {
      email: loggedUser,
      questions: 0,
      answers: 0,
      suggestions: 0,
      acceptedAnswers: 0
    } as User;
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("users")
        .add(user)
        .then(
          (res) => {
            this.router.navigateByUrl("/landing");
          },
          (err) => {
            this.snackBar.open(
              "An error has occured while trying to insert user data! " +
              err.message
            );
          }
        );
    });
  }

  getUserData(email: string): Observable<any> {
    return this.firestore
      .collection<User>("users", ref => ref.where("email", "==", email))
      .valueChanges({ idField: "id" });
  }

  getLoggedInUserData(): any {
    let email = firebase.auth().currentUser.email;
    const query = this.firestore
      .collection<User>("users")
      .ref.where("email", "==", email);
    query.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        this.createUser();
        return null;
      } else if (querySnapshot.size > 1) {
        this.snackBar.open(
          "There were multiple users found with the same email address!"
        );
        return null;
      } else {
        querySnapshot.forEach((documentSnapshot) => {
          return this.firestore.doc(documentSnapshot.ref).valueChanges();
        });
      }
    });
  }

  getUpdateOperation(field: string, value: number) {
    switch (field) {
      case "questions":
        return "{ questions: " + value + "}";
      case "answers":
        return "{ answers: " + value + "}";
      case "suggestions":
        return "{ suggestions: " + value + "}";
      case "acceptedAnswers":
        return "{ acceptedAnswers: " + value + "}";
    }
  }

  updateDynamicData(userId: string, field: string, value: number) {
    if (field === "questions") {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection("users")
          .doc(userId)
          .update({ questions: value })
          .then(
            (res) => {
              this.snackBar.open("User updated successfully!", "Close");
            },
            (err) => {
              this.snackBar.open(
                "An error has occured while trying to update the user! " +
                err.message,
                "Close"
              );
            }
          );
      })
    } else if (field === "answers") {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection("users")
          .doc(userId)
          .update({ answers: value })
          .then(
            (res) => {
              this.snackBar.open("User updated successfully!", "Close");
            },
            (err) => {
              this.snackBar.open(
                "An error has occured while trying to update the user! " +
                err.message,
                "Close"
              );
            }
          );
      })
    } else if (field === "suggestions") {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection("users")
          .doc(userId)
          .update({ suggestions: value })
          .then(
            (res) => {
              this.snackBar.open("User updated successfully!", "Close");
            },
            (err) => {
              this.snackBar.open(
                "An error has occured while trying to update the user! " +
                err.message,
                "Close"
              );
            }
          );
      })
    } else {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection("users")
          .doc(userId)
          .update({ acceptedAnswers: value })
          .then(
            (res) => {
              this.snackBar.open("User updated successfully!", "Close");
            },
            (err) => {
              this.snackBar.open(
                "An error has occured while trying to update the user! " +
                err.message,
                "Close"
              );
            }
          );
      })
    }
  }
}
