import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Suggestion } from "src/app/shared/models/suggestion.model";
import { User } from "src/app/shared/models/user.model";
import { AuthenticationService } from "src/app/shared/services/auth.service";
import { SuggestionService } from "src/app/shared/services/suggestion.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: "app-suggestion",
    templateUrl: "suggestion.component.html"
})
export class SuggestionComponent implements OnInit {
    isCollapsed = true;
    questionId: string = "";
    suggestions: Suggestion[] = [];
    loggedUser: User;

    constructor(
        private suggestionService: SuggestionService,
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthenticationService,
        public router: Router
    ) { }

    ngOnInit() {
        this.userService.getUserData(this.authService.currentUser()).subscribe(res => {
            this.loggedUser = res[0];
        });

        this.questionId = this.route.snapshot.paramMap.get("questionId");
        this.getSuggestions();
    }

    getSuggestions() {
        this.suggestionService.getQuestionSuggestion(this.questionId).subscribe(res => {
            this.suggestions = res;
        })
    }

    acceptSuggestion(suggestion: Suggestion) {
        this.suggestionService.acceptSuggestion(
            suggestion.id,
            suggestion.questionId,
            suggestion.suggestion
        );
    }

    verifyIfQuestionHasAcceptedSuggestion() {
        let acceptedSuggestion = this.suggestions?.find(suggestion => suggestion.accepted);
        return acceptedSuggestion ? true : false;
    }

    goToProfile() {
        this.router.navigateByUrl("/profile");
    }

    logout() {
        this.authService.SignOut();
    }
}