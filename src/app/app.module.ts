import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule,MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNav, NgbOffcanvas, NgbOffcanvasConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { CountryService } from './country.service';
import { NgbdSortableHeader } from './sortable.directive';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './toast-container.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NgbdSortableHeader,
    ToastsContainer
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    // FlatTreeControl,
    // MatTreeFlatDataSource,
    // MatTreeFlattener,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbAccordionModule,
    NgbToastModule,
    NgbTooltipModule,
    JsonPipe,
    
  ],
  providers: [NgbOffcanvasConfig, NgbOffcanvas, DecimalPipe, CountryService, NgbNav, NgbTooltipConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
