import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { User } from "src/app/shared/models/user.model";
import { AuthenticationService } from "src/app/shared/services/auth.service";
import { UserService } from "src/app/shared/services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Question } from "src/app/shared/models/question.model";
import { QuestionService } from "src/app/shared/services/question.service";
import { Category } from "src/app/shared/models/category.model";
import { CategoryService } from "src/app/shared/services/category.service";
import { Router } from "@angular/router";
import { Answer } from "src/app/shared/models/answer.model";
import { AnswerService } from "src/app/shared/services/answer.service";
import { SuggestionService } from "src/app/shared/services/suggestion.service";
import { Suggestion } from "src/app/shared/models/suggestion.model";

@Component({
  selector: "app-landingpage",
  templateUrl: "landingpage.component.html",
  styleUrls: ["landingpage.component.scss"],
  providers: [CategoryService],
  encapsulation: ViewEncapsulation.None
})
export class LandingpageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  loggedUser: User;
  selectedQuestion: string = "";
  selectedQuestionData: Question;
  questions: Question[] = [];
  categories: Category[] = [];
  answers: Answer[] = [];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private questionService: QuestionService,
    private categoryService: CategoryService,
    public router: Router,
    private answerService: AnswerService,
    private suggestionService: SuggestionService
  ) { }

  categoryForm = new FormGroup({
    category: new FormControl("", [Validators.required])
  });

  questionForm = new FormGroup({
    category: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
  });

  answerForm = new FormGroup({
    answer: new FormControl("", [Validators.required])
  });

  suggestionForm = new FormGroup({
    description: new FormControl("", [Validators.required])
  });

  ngOnInit() {
    localStorage.setItem("isUserData", "false");
    this.userService.getUserData(this.authService.currentUser()).subscribe(res => {
      this.loggedUser = res[0];
    });
    this.getLatestQuestions();
    this.getCategories();

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  logout() {
    this.authService.SignOut();
  }

  getLatestQuestions() {
    this.questionService.getLatestQuestions().subscribe(res => {
      this.questions = res?.filter(q => q.postedBy != this.loggedUser.email).slice(0, 5);
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

  createCategory() {
    let categoryData = {
      name: this.categoryForm.get("category").value
    } as Category;
    this.categoryService.createCategory(categoryData);
  }

  createQuestion() {
    let questionData = {
      categoryId: this.questionForm.get("category").value,
      description: this.questionForm.get("description").value,
      postedBy: this.loggedUser.email,
      postedDate: new Date(),
      acceptedAnswerId: null,
      updatedDate: null,
      updatedDescription: null,
    } as Question;

    let questions = this.loggedUser.questions + 1;
    this.questionService.createQuestion(questionData, this.loggedUser.id, questions);
  }

  setSelectedQuestion(questionId) {
    this.selectedQuestion = questionId;
  }

  setSelectedQuestionData(question: Question) {
    this.selectedQuestionData = question;
  }

  answerQuestion() {
    let answerData = {
      questionId: this.selectedQuestion,
      description: this.answerForm.get("answer").value,
      postedBy: this.loggedUser.email,
      accepted: false,
      answeredDate: new Date(),
      votes: 0
    } as Answer;

    let answers = this.loggedUser.answers + 1;
    this.answerService.answerQuestion(answerData, this.loggedUser.id, answers);
  }

  suggestQuestionEdit() {
    let suggestion = {
      questionId: this.selectedQuestionData.id,
      suggestion: this.suggestionForm.get("description").value,
      suggestedBy: this.loggedUser.email,
      suggestedDate: new Date()
    } as Suggestion;

    let suggestions = this.loggedUser.suggestions + 1;
    this.suggestionService.createSuggestion(suggestion, this.loggedUser.id, suggestions);
  }

  goToAnswers() {
    localStorage.setItem("isUserData", "false")
    this.router.navigate(["/answers", this.selectedQuestion]);
  }

  goToProfile() {
    this.router.navigateByUrl("/profile");
  }

  goToQuestions() {
    this.router.navigateByUrl("/questions");
  }
}
