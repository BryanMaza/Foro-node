import { Router, ActivatedRoute, Params } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { User } from 'src/app/models/user';
import { global } from '../../services/global';
@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css'],
  providers: [TopicService, UserService, CommentService]
})
export class TopicDetailComponent implements OnInit {


  public topic: Topic;
  public comment: Comment;
  public identity;
  public status;
  public token;
  public url;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService,
    private _userService: UserService,
    private _commentService: CommentService
  ) {

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    this.comment = new Comment('', '', '', this.identity._id);
  }

  ngOnInit(): void {
    this.getTopic();


  }

  getTopic() {
    this._route.params.subscribe(
      response => {
        let id = response.id;
        this._topicService.getTopic(id).subscribe(
          response => {
            if (response.topic) {
              this.topic = response.topic;

            } else {
              this._router.navigate(['/inicio']);
            }

          },
          error => {
            console.log(<any>error);

          }
        );
      },
      error => {
        console.log(<any>error);

      }
    );
  }
  onSubmit(form) {


    this._commentService.add(this.topic._id, this.token, this.comment).subscribe(
      response => {
        if (response.topic) {
          this.status = "success";
          this.topic = response.topic;

          form.reset();

        }
        else {
          this.status = "error";
        }
      },
      error => {
        console.log(error);

      }
    );

  }

  deleteComment(id) {

    this._commentService.delete(this.topic._id, this.token, id).subscribe(
      response => {
        if (response.topic) {

          this.topic = response.topic;
          this.status = "success";
        } else {
          this.status = "error";
        }
      },
      error => {
        console.log(error);

      }
    );
  }

}
