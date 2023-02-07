import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatSelectModule } from '@angular/material/select';

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { PopoverModule } from "ngx-bootstrap/popover";
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';

import { IndexComponent } from "./index/index.component";
import { ProfilepageComponent } from "./main/profilepage/profilepage.component";
import { LandingpageComponent } from "./main/landingpage/landingpage.component";

import { MatFormFieldModule } from "@angular/material/form-field";
import { QuestionsComponent } from "./main/questions/questions.component";
import { AnswersComponent } from "./main/answers/answers.component";
import { NgxPaginationModule } from "ngx-pagination";
import { SuggestionComponent } from "./main/suggestions/suggestion.component";
import { ChangePasswordComponent } from "./main/change-password/change-password.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    DatePipe,
    MatSelectModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule
  ],
  declarations: [
    IndexComponent,
    ProfilepageComponent,
    LandingpageComponent,
    QuestionsComponent,
    AnswersComponent,
    SuggestionComponent,
    ChangePasswordComponent
  ],
  exports: [
    IndexComponent,
    LandingpageComponent,
  ],
})
export class PagesModule { }
