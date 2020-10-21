import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {Topic} from '../../../models/topic';
import {UserService} from '../../../services/user.service';
import {TopicService} from '../../../services/topic.service';
import { param } from 'jquery';

@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['./edit.component.css'],
  providers:[UserService,TopicService]
})
export class EditComponent implements OnInit {
  public page_title:string;
  public topic:Topic;
  public identity;
  public token;
  public status;

  constructor(
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _topicService:TopicService
  ) { 

    this.page_title="Editar tema";
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    this.topic= new Topic('','','','','','',this.identity._id,null);
   

  }

  ngOnInit(): void {

    this.getTopic();
    
  }

  onSubmit(form){

    this._route.params.subscribe(
      response=>{
        
        let id= response.id;

        this._topicService.update(id,this.token,this.topic).subscribe(
          response=>{
           
            
            if(response && response.status=="success"){
              this.status="success";
              this.topic=response.topicUpdated;
              
        
            }else{
              this.status="success";
            }
            
          },
          error=>{
            console.log(error);
            this.status="success";
          }
        );
        
      },
      error=>{
        console.log(error);
        
      }
    );

    //this._topicService.update(,this.token);

  }

  getTopic(){
    this._route.params.subscribe(
      response=>{
        let id=response.id;
        
        this._topicService.getTopic(id).subscribe(
          response=>{
            if(response && response.status=="success"){

              this.topic=response.topic;
           

            }else{
              this._router.navigate(['/panel']);
            }
            
          },
          error=>{
            this.status="error";
            console.log(error);
          }
        );
      },
      error=>{
        this.status="error";
        console.log(error);
        
      }
    );
  }

}
