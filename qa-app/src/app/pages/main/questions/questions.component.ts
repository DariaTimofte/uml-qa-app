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
    selector: "app-questions",
    templateUrl: "questions.component.html",
    providers: [CategoryService]
})
export class QuestionsComponent implements OnInit {
    isCollapsed = true;
    loggedUser: User;
    selectedCategory: string;
    selectedQuestion: string;
    selectedQuestionData: Question;
    categories: Category[] = [];
    questions: Question[] = [];
    answers: Answer[] = [];

    answerForm = new FormGroup({
        answer: new FormControl("", [Validators.required])
    });

    suggestionForm = new FormGroup({
        description: new FormControl("", [Validators.required])
    });

    constructor(
        private authService: AuthenticationService,
        public router: Router,
        private categoryService: CategoryService,
        private userService: UserService,
        private questionService: QuestionService,
        private answerService: AnswerService,
        private suggestionService: SuggestionService
    ) { }

    ngOnInit() {
        localStorage.setItem("isUserData", "false");
        this.userService.getUserData(this.authService.currentUser()).subscribe(res => {
            this.loggedUser = res[0];
        });
        this.getCategories();
    }

    getCategories() {
        this.categoryService.getCategories().subscribe(res => {
            this.categories = res;
        })
    }

    changeCategory(event) {
        this.getQuestions();
    }

    getQuestions() {
        this.questionService.getQuestionsByCategory(this.selectedCategory).subscribe(res => {
            this.questions = res;
            this.questions.forEach(question => {
                question.categoryName = this.categories.find(category => category.id === this.selectedCategory)?.name;
            })
        })
    }

    setSelectedQuestion(questionId) {
        this.selectedQuestion = questionId;
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

    goToAnswers() {
        this.router.navigate(["/answers", this.selectedQuestion]);
    }

    setSelectedQuestionData(question: Question) {
        this.selectedQuestionData = question;
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

    goToProfile() {
        this.router.navigateByUrl("/profile");
    }

    logout() {
        this.authService.SignOut();
    }
}