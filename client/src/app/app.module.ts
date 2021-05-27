import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';

import { RegisterFormComponent } from './register-form/register-form.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './Errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './Errors/_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,

    RegisterFormComponent,
     MemberListComponent,
     MemberDetailComponent,
     ListsComponent,
     MessagesComponent,
     TestErrorsComponent,
     NotFoundComponent,
     ServerErrorComponent,
     
   
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule

  ],


  providers: [

    {provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
