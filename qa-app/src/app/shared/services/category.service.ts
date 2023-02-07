import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Category } from "../models/category.model";

@Injectable()
export class CategoryService {

    constructor(
        private firestore: AngularFirestore,
        private snackBar: MatSnackBar
    ) { }

    getCategories(): Observable<any> {
        return this.firestore
            .collection("categories")
            .valueChanges({ idField: "id" });
    }

    // add a category
    createCategory(category: Category) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("categories")
                .add(category)
                .then(
                    (res) => {
                        this.snackBar.open("Category created successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to create the category! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        });
    }

    // edit a category

    // delete a question
    deleteQuestion(questionId: string) {
        this.firestore
            .collection("questions")
            .doc(questionId)
            .delete()
            .then(
                (res) => {
                    this.snackBar.open("Question deleted successfully!", "Close");
                },
                (err) => {
                    this.snackBar.open(
                        "An error has occured while trying to delete the question! " +
                        err.message,
                        "Close"
                    );
                }
            );
    }
}