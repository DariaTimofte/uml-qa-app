import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/main/profilepage/profilepage.component";
import { LandingpageComponent } from "./pages/main/landingpage/landingpage.component";

import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from "@angular/fire/compat/auth-guard";
import { QuestionsComponent } from "./pages/main/questions/questions.component";
import { AnswersComponent } from "./pages/main/answers/answers.component";
import { SuggestionComponent } from "./pages/main/suggestions/suggestion.component";
import { ChangePasswordComponent } from "./pages/main/change-password/change-password.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["home"]);
const redirectLoggedInLanding = () => redirectLoggedInTo(["landing"]);

const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  {
    path: "home",
    component: IndexComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInLanding },
  },
  {
    path: "profile",
    component: ProfilepageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "landing",
    component: LandingpageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "questions",
    component: QuestionsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "answers/:questionId",
    component: AnswersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "suggestions/:questionId",
    component: SuggestionComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  }, {
    path: "password-reset",
    component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
