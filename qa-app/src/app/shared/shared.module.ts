import { NgModule } from "@angular/core";
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from "@angular/material/snack-bar";
import { AlertModule } from "ngx-bootstrap/alert";
import { QuestionAdapter } from "./adapters/question.adapter";
import { AnswerService } from "./services/answer.service";
import { QuestionService } from "./services/question.service";
import { SuggestionService } from "./services/suggestion.service";

@NgModule({
  imports: [MatSnackBarModule, AlertModule],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        verticalPosition: "bottom",
        panelClass: "snack-bar",
      },
    },
    QuestionAdapter,
    QuestionService,
    AnswerService,
    SuggestionService
  ],
})
export class SharedModule { }
