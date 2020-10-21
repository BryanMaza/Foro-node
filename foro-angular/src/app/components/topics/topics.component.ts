import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  providers: [TopicService]
})
export class TopicsComponent implements OnInit {

  public page_title: string;
  public topics: Array<Topic>;
  public totalPages;
  public number_pages;
  public page;
  public next_pag;
  public prev_pag;
  public status;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {

    this.page_title = "Temas";
  }

  ngOnInit(): void {

    this._route.params.subscribe(
      response => {

        let page = +response.page;

        if (!page || page == null || page == undefined) {
          page = 1;
          this.prev_pag = 1;
          this.next_pag = 2;

        }
        this.getTopics(page);

      },
      error => {
        console.log(error);

      }
    );

    
  }

  getTopics(page = 1) {
    this._topicService.getTopics(page).subscribe(
      response => {
        if (response.topics) {
          this.topics = response.topics;

          //Navegacion de paginas
          this.totalPages = response.totalPages;

          var number_pages = [];
          for (var i = 1; i <= this.totalPages; i++) {
            number_pages.push(i);
          }

          this.number_pages = number_pages;

          if (page >= 2) {
            this.prev_pag = page - 1;
          } else {
            this.prev_pag = 1;
          }

          if (page < this.totalPages) {
            this.next_pag = page + 1;
          } else {
            this.next_pag = this.totalPages;
          }

        } else {
          this._router.navigate(['/inicio']);
        }
       

      },
      error => {
        console.log(error);

      }
    );
  }
}
