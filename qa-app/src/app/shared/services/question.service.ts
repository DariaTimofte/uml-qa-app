import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { QuestionAdapter } from "../adapters/question.adapter";
import { Question } from "../models/question.model";
import { AnswerService } from "./answer.service";
import { SuggestionService } from "./suggestion.service";
import { UserService } from "./user.service";

@Injectable()
export class QuestionService {

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private answerService: AnswerService,
    private suggestionService: SuggestionService,
    private userService: UserService,
    private adapter: QuestionAdapter
  ) { }

  // Model-Adapter pattern example
  getLatestQuestions(): Observable<Question[]> {
    const temp = new Date();
    temp.setDate(temp.getDate() - 1);

    return this.firestore
      .collection<Question>("questions", ref => ref.where("postedDate", ">=", temp))
      .valueChanges({ idField: "id" })
      .pipe(
        map((items: any[]) => items.map(item => this.adapter.adapt(item)))
      )
  }

  getQuestionsByCategory(categoryId: string): Observable<any> {
    return this.firestore
      .collection("questions", ref => ref.where("categoryId", "==", categoryId))
      .valueChanges({ idField: "id" });
  }

  getQuestionsByUser(email: string): Observable<any> {
    return this.firestore
      .collection("questions", ref => ref.where("postedBy", "==", email))
      .valueChanges({ idField: "id" });
  }

  // add a question
  createQuestion(question: Question, userId: string, questions: number) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("questions")
        .add(question)
        .then(
          (res) => {
            this.userService.updateDynamicData(userId, "questions", questions);
            this.snackBar.open("Question submitted successfully!", "Close");
          },
          (err) => {
            this.snackBar.open(
              "An error has occured while trying to submit the question! " +
              err.message,
              "Close"
            );
          }
        );
    });
  }

  // edit a question
  editQuestion(question: Question) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("questions")
        .doc(question.id)
        .update(question)
        .then(
          (res) => {
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
  }

  editQuestionDescription(questionId: string, description: string) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("questions")
        .doc(questionId)
        .update({ description: description })
        .then(
          (res) => {
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
  }

  editQuestionAcceptedAnswer(answerId: string, questionId: string, userId: string, answers: number) {
    console.log(answerId)
    console.log(questionId)
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
  }

  // delete a question
  deleteQuestion(questionId: string) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("questions")
        .doc(questionId)
        .delete()
        .then(
          (res) => {
            this.answerService.deleteAnswersForQuestion(questionId);
            this.suggestionService.deleteSuggestionForQuestion(questionId);
            this.snackBar.open("Question deleted successfully!", "Close");
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
  }
}
