//Importar los modulos del router
import{ModuleWithProviders} from '@angular/core';
import{Routes,RouterModule} from '@angular/router'
import { HomeComponent } from './components/home/home.component';

//Importar componentes
import{LoginComponent} from './components/login/login.component';
import{RegisterComponent} from './components/register/register.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { TopicsComponent } from './components/topics/topics.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

import {UserGuard} from './services/user.guard';
import {UsersComponent} from './components/users/users.component';
import {NoIdentityGuard} from './services/no.identity.guard';
import { ProfileComponent } from './components/profile/profile.component';
import {SearchComponent} from './components/search/search.component';

//Array de rutas
const appRoutes:Routes=[
    {path:'',component:HomeComponent},
    {path:'inicio',component:HomeComponent},
    {path:'login',canActivate:[NoIdentityGuard],component:LoginComponent},
    {path:'register',canActivate:[NoIdentityGuard],component:RegisterComponent},
    {path:'ajustes',canActivate:[UserGuard],component:UserEditComponent},
    {path:'temas',component:TopicsComponent},
    {path:'temas/:page',component:TopicsComponent},
    {path:'tema/:id',component:TopicDetailComponent},
    {path:'usuarios',component:UsersComponent},
    {path:'perfil/:id',canActivate:[UserGuard],component:ProfileComponent},
    {path:'buscar/:search',component:SearchComponent},
    {path:"**",component:HomeComponent}
]
//Exportar configuracion    

export const appRoutingProviders:any[]=[];

export const routing:ModuleWithProviders<any>=RouterModule.forRoot(appRoutes);