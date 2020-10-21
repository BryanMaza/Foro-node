import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import {global} from './services/global';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { TopicService } from './services/topic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    UserService,
    TopicService
  ]
})
export class AppComponent implements OnInit,DoCheck {
  public title = 'FORO EN ANGULAR';
  public identity;
  public token;
  public url;
  public search;

  constructor(
    private _userService: UserService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _topicService:TopicService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url=global.url;
  }
  ngOnInit() {
    
   
  }
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
  logOut(){
    localStorage.clear();
    this.identity=null;
    this.token=null;

    this._router.navigate(['/inicio']);
  }

  goSearch(){
      
          this._router.navigate(['/buscar/'+this.search]);
       
  }
  
}
