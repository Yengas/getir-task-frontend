import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MyDateRangePickerModule } from 'mydaterangepicker';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ListingComponent } from './components/listing/listing.component';
import { RecordService } from './services/record.service';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    ListingComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    Ng2SmartTableModule,
    MyDateRangePickerModule
  ],
  providers: [RecordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
