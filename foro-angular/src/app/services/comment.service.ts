import { Injectable } from '@angular/core';
import  {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {global} from './global';


@Injectable()
export class CommentService {
    public url;
    constructor(
        private _http:HttpClient
    ) { 
        this.url=global.url;
    }
    
    add(id,token,comment):Observable<any>{

        let params=JSON.stringify(comment);
        let headers= new HttpHeaders().set('Content-Type','application/json').set('Authorization',token);

        return this._http.post(this.url+"comment/topic/"+id,params,{headers:headers});
    }

    delete(topicId,token,commentId):Observable<any>{

        let headers= new HttpHeaders().set('Content-Type','application/json').set('Authorization',token);

        return this._http.delete(this.url+'comment/'+topicId+"/"+commentId,{headers:headers});
    }
}