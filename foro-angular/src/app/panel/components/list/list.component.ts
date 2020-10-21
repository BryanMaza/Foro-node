import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {Topic} from '../../../models/topic';
import {UserService} from '../../../services/user.service';
import {TopicService} from '../../../services/topic.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers:[UserService, TopicService]
})
export class ListComponent implements OnInit {

  public page_title:string;
  public topics:Array<Topic>;
  public identity;
  public token;
  public status;
  constructor(
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _topicService:TopicService
  ) { 

    this.page_title="Mis temas";
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    

  }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(){

    this._topicService.getMyTopicsByUser(this.identity._id).subscribe(
      response=>{
        if(response && response.status=="success"){
          
          this.topics=response.topics;
          this.status="success";
          console.log(response);
          

        }else{
          this.status="error";
        }
        
      },
      error=>{
        console.log(<any>error);
        this.status="error";
      }
    );
  }

  deleteTopic(id){

   this._topicService.deleteTopic(id,this.token).subscribe(
     response=>{

      if(response && response.status=="success"){
        this.status=="success";
        this.getTopics();

      }else{
        this.status="error";
      }
      

     },
     error=>{
       this.status="error";
      console.log(error);
      
     }
   );
    
  }

}
