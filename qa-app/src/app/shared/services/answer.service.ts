import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Answer } from "../models/answer.model";
import { QuestionService } from "./question.service";
import { UserService } from "./user.service";

@Injectable()
export class AnswerService {

    constructor(
        private firestore: AngularFirestore,
        private snackBar: MatSnackBar,
        private questionService: QuestionService,
        private userService: UserService
    ) { }

    // get answers for question
    getQuestionAnswers(questionId: string): Observable<any> {
        return this.firestore
            .collection("answers", ref => ref.where("questionId", "==", questionId))
            .valueChanges({ idField: "id" });
    }

    getAnswersByUser(email: string): Observable<any> {
        return this.firestore
            .collection("answers", ref => ref.where("postedBy", "==", email))
            .valueChanges({ idField: "id" });
    }

    // answer question
    answerQuestion(answer: Answer, userId: string, answers: number) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("answers")
                .add(answer)
                .then(
                    (res) => {
                        this.userService.updateDynamicData(userId, "answers", answers);
                        this.snackBar.open("Answer submitted successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to submit the answer! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        });
    }

    // vote answer
    vote(answerId: string, votes: number) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("answers")
                .doc(answerId)
                .update({ votes: votes })
                .then(
                    (res) => {
                        this.snackBar.open("Answer voted successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to vote the answer! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        })
    }

    deleteAnswersForQuestion(questionId: string) {
        var query = this.firestore.collection("answers").ref.where('questionId', '==', questionId);
        query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });
    }

    // edit answer
    editAnswer(answer: Answer) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("answers")
                .doc(answer.id)
                .update(answer)
                .then(
                    (res) => {
                        this.snackBar.open("Answer updated successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to answer the question! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        })
    }

    // delete answer
    deleteAnswer(answerId: string) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("answers")
                .doc(answerId)
                .delete()
                .then(
                    (res) => {
                        this.snackBar.open("Answer deleted successfully!", "Close");
                    },
                    (err) => {
                        this.snackBar.open(
                            "An error has occured while trying to update the answer! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        })
    }

    acceptAnswer(answerId: string, questionId: string, userId: string, answers: number) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection("answers")
                .doc(answerId)
                .update({ accepted: true })
                .then(
                    (res) => {
                        return new Promise<any>((resolve, reject) => {
                            this.firestore
                                .collection("questions")
                                .doc(questionId)
                                .update({ acceptedAnswerId: answerId })
                                .then(
                                    (res) => {
                                        this.userService.updateDynamicData(userId, "acceptedAnswers", answers);
                                        this.snackBar.open("Question updated successfully!", "Close");
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
                            "An error has occured while trying to accept the question! " +
                            err.message,
                            "Close"
                        );
                    }
                );
        })
    }
}