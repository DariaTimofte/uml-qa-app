import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Suggestion } from "../models/suggestion.model";
import { QuestionService } from "./question.service";
import { UserService } from "./user.service";

@Injectable()
export class SuggestionService {

    constructor(
        private firestore: AngularFirestore,
        private snackBar: MatSnackBar,
        private questionService: QuestionService,
        private userService: UserService
    ) { }

    // add a question
    createSuggestion(suggestion: Suggestion, userId: string, suggestions: number) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("suggestions")
                .add(suggestion)
                .then(
                    (res) => {
                        this.userService.updateDynamicData(userId, "suggestions", suggestions);
                        this.snackBar.open("Suggestion submitted successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to submit the suggestion! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        });
    }

    deleteSuggestionForQuestion(questionId: string) {
        var query = this.firestore.collection("suggestion").ref.where('questionId', '==', questionId);
        query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });
    }

    // get answers for question
    getQuestionSuggestion(questionId: string): Observable<any> {
        return this.firestore
            .collection("suggestions", ref => ref.where("questionId", "==", questionId))
            .valueChanges({ idField: "id" });
    }

    acceptSuggestion(suggestionId: string, questionId: string, suggestion: string) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("suggestions")
                .doc(suggestionId)
                .update({ accepted: true })
                .then(
                    (res) => {
                        return new Promise<any>((resolve, reject) => {
                            this.firestore
                                .collection("questions")
                                .doc(questionId)
                                .update({ description: suggestion })
                                .then(
                                    (res) => {
                                        this.snackBar.open("Suggested accepted successfully!", "Close");
                                    },
                                    (err) => {
                                        this.snackBar.open(
                                            "An error has occured while trying to update the question! " +
                                            err.message,
                                            "Close"
                                        );
                                    }
                                );
                        })
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to accept the suggestion! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        })
    }
}