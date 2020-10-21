import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { TopicService } from '../../services/topic.service';
import { User } from '../../models/user';
import { Topic } from '../../models/topic';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, TopicService]
})
export class ProfileComponent implements OnInit {


  public user: User;
  public status;
  public topics: Array<Topic>;
  public url;
  public page_title;

  constructor(
    private _topicService: TopicService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = global.url;
    this.page_title = "Usuarios"
  }

  ngOnInit(): void {

    this._route.params.subscribe(
      response => {

        let id = response.id;
        this.getTopics(id);
        this.getUser(id);
      },
      error => {
        console.log(error);
        
      });
  }

  getUser(userId) {

    this._userService.getUser(userId).subscribe(
      response=>{
        if(response.user){
          this.user=response.user;
          
        }
        else{
          this.status="error";
        }
        
      },
      error=>{
          console.log(error);
          
      }
    );

  }
  getTopics(userId) {


    this._topicService.getMyTopicsByUser(userId).subscribe(
      response => {
        if (response && response.status == "success") {

          this.topics = response.topics;
          this.status = "success";


        } else {
          this.status = "error";
        }

      },
      error => {
        console.log(<any>error);
        this.status = "error";
      }
    );
  }

}
