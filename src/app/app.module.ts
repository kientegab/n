import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { PublicModule } from './public/public.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ComonModule } from './shared/comon/comon.module';
// import { ActionToolBarIudComponent } from './shared/common/action-tool-bar-iud/action-tool-bar-iud.component';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { CreerModifierEmploiComponent } from './creer-modifier-emploi/creer-modifier-emploi.component';

import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { AccountModule } from './account/account.module';
import { ArchwizardModule } from 'angular-archwizard';
import { AuthInterceptorProviders } from './shared/_helpers/auth.interceptor';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { ResourceInterceptor } from './shared/interceptors/resource.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
    declarations: [
        AppComponent,
      //  CreerModifierEmploiComponent,
        // ActionToolBarIudComponent
    ],
    imports: [
        AppRoutingModule,
       // PublicModule,
        AccountModule,
        AppLayoutModule,
        ComonModule,
        DividerModule,
        FormsModule ,
        MenubarModule,
        CardModule,
        MessageModule,
        DropdownModule,
        CalendarModule,
        CdkStepperModule,
        ArchwizardModule.forRoot(),
    ],
    providers: [
       // { provide: LocationStrategy, useClass: HashLocationStrategy },
       {provide: HTTP_INTERCEPTORS, useClass: ResourceInterceptor, multi: true},
        DialogService,
        ConfirmationService,
        MessageService,
        DynamicDialogRef,
        CdkStepper,
       // AuthInterceptorProviders
    ],
    exports: [
        // ActionToolBarIudComponent
        // DividerModule
        MessagesModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
