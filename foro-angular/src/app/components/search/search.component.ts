import { Component, OnInit } from '@angular/core';
import {Topic} from '../../models/topic';
import {TopicService} from '../../services/topic.service';
import {Router, ActivatedRoute,Params} from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['./search.component.css'],
  providers:[TopicService]
})
export class SearchComponent implements OnInit {

  public page_title:string;
  public topics:Array<Topic>;
  public status;
  public no_paginate;
  constructor(
    private _topicService:TopicService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 

    this.page_title="Buscar: ";
    this.no_paginate=true;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      response => {

        let search = response.search;
        this.page_title=this.page_title+ ' '+search
        this.getTopics(search);

      }
    );
  }
  getTopics(search){
    this._topicService.search(search).subscribe(
      response=>{
        if(response.topic){
          this.topics=response.topic;
          console.log(this.topics);
          
        }else{
          this.status="error";
        }
      },
      error=>{
        console.error(error);
        
      }
    );

  }

}
