import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Answer } from "src/app/shared/models/answer.model";
import { Category } from "src/app/shared/models/category.model";
import { Question } from "src/app/shared/models/question.model";
import { Suggestion } from "src/app/shared/models/suggestion.model";
import { User } from "src/app/shared/models/user.model";
import { AnswerService } from "src/app/shared/services/answer.service";
import { AuthenticationService } from "src/app/shared/services/auth.service";
import { CategoryService } from "src/app/shared/services/category.service";
import { QuestionService } from "src/app/shared/services/question.service";
import { SuggestionService } from "src/app/shared/services/suggestion.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html",
  styleUrls: ["profilepage.component.scss"],
  providers: [CategoryService]
})
export class ProfilepageComponent implements OnInit {
  selectedQuestion: Question;
  selectedAnswer: Answer;
  isCollapsed = true;
  loggedUser: User;
  questions: Question[] = [];
  answers: Answer[] = [];
  questionAnswers: Answer[] = [];
  categories: Category[] = [];
  suggestions: Suggestion[] = [];
  p = 1;
  p1 = 1;

  questionForm = new FormGroup({
    description: new FormControl("", [Validators.required]),
  });

  answerForm = new FormGroup({
    description: new FormControl("", [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private categoryService: CategoryService,
    public router: Router,
    private suggestionService: SuggestionService
  ) { }

  ngOnInit() {
    this.userService.getUserData(this.authService.currentUser()).subscribe(res => {
      this.loggedUser = res[0];

      this.getCategories();
      this.getUserQuestions();
      this.getUserAnswers();
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    })
  }

  getQuestionCategory(categoryId: string) {
    return this.categories?.find(category => category.id === categoryId)?.name;
  }

  getUserQuestions() {
    this.questionService.getQuestionsByUser(this.loggedUser.email).subscribe(res => {
      this.questions = res;
    })
  }

  getUserAnswers() {
    this.answerService.getAnswersByUser(this.loggedUser.email).subscribe(res => {
      this.answers = res;
    })
  }

  getQuestionAnswers(questionId: string) {
    localStorage.setItem("isUserData", "true");
    this.router.navigate(["/answers", questionId]);
  }

  deleteQuestion(questionId: string) {
    this.questionService.deleteQuestion(questionId);
  }

  deleteAnswer(answerId: string) {
    this.answerService.deleteAnswer(answerId);
  }

  setSelectedQuestion(question: Question) {
    this.selectedQuestion = question;
  }

  updateQuestion() {
    this.selectedQuestion.description = this.questionForm.get("description").value;
    this.selectedQuestion.updatedDate = new Date();

    this.questionService.editQuestion(this.selectedQuestion);
  }

  setSelectedAnswer(answer: Answer) {
    this.selectedAnswer = answer;
  }

  updateAnswer() {
    this.selectedAnswer.description = this.answerForm.get("description").value;
    this.selectedAnswer.updatedDate = new Date();

    this.answerService.editAnswer(this.selectedAnswer);
  }

  goToSuggestions(questionId: string) {
    this.router.navigate(["/suggestions", questionId]);
  }

  logout() {
    this.authService.SignOut();
  }
}
