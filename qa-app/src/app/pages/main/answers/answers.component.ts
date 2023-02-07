import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/shared/models/answer.model";
import { User } from "src/app/shared/models/user.model";
import { AnswerService } from "src/app/shared/services/answer.service";
import { AuthenticationService } from "src/app/shared/services/auth.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: "app-answers",
    templateUrl: "answers.component.html"
})
export class AnswersComponent implements OnInit {
    isCollapsed = true;
    loggedUser: User;
    isUserData = false;
    questionId: string;
    answers: Answer[] = [];

    constructor(
        private answerService: AnswerService,
        private userService: UserService,
        private authService: AuthenticationService,
        public router: Router,
        public route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.questionId = this.route.snapshot.paramMap.get("questionId");
        this.userService.getUserData(this.authService.currentUser()).subscribe(res => {
            this.loggedUser = res[0];
        });

        this.isUserData = localStorage.getItem("isUserData") === "true" ? true : false;
        this.getQuestionAnswers();

    }

    getQuestionAnswers() {
        this.answerService.getQuestionAnswers(this.questionId).subscribe(res => {
            this.answers = res;
        })
    }

    vote(answer: Answer, action: string) {
        let votes = answer.votes;
        votes = action === "upvote" ? (votes + 1) : (votes - 1);
        this.answerService.vote(answer.id, votes);
    }

    acceptAnswer(answer: Answer) {
        let answers = this.loggedUser.answers + 1;
        this.answerService.acceptAnswer(answer.id, answer.questionId, this.loggedUser.id, answers);
    }

    verifyIfQuestionHasAcceptedAnswer() {
        let acceptedAnswer = this.answers?.find(answer => answer.accepted);
        return acceptedAnswer ? true : false;
    }

    goToProfile() {
        this.router.navigateByUrl("/profile");
    }

    logout() {
        this.authService.SignOut();
    }

    backToQuestions() {
        this.router.navigateByUrl("/questions");
    }
}