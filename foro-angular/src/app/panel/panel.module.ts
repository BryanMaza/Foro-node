import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PanelRoutingModule } from './panel.routing.module';
import { MomentModule} from 'angular2-moment';

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import {UserGuard} from '../services/user.guard';
import {UserService} from '../services/user.service';

@NgModule({
    imports: [CommonModule,FormsModule,HttpClientModule,PanelRoutingModule,MomentModule],
    exports: [CommonModule,FormsModule,HttpClientModule,PanelRoutingModule],
    declarations: [MainComponent, AddComponent, ListComponent, EditComponent],
    providers: [UserGuard,UserService],
})
export class PanelModule {

 }
