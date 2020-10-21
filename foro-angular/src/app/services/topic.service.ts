import { Injectable } from '@angular/core';
import  {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {global} from './global';


@Injectable()
export class TopicService {

    public url:string;

    constructor(
        private _http:HttpClient
    ) { 
        this.url=global.url;
    }

    addTopic(token,topic):Observable<any>{

        let params=JSON.stringify(topic);

        let headers=new HttpHeaders().set('Content-Type','application/json').set('Authorization',token);

        return this._http.post(this.url+"topic",params,{headers:headers});
    }

    getMyTopicsByUser(id):Observable<any>{



        let headers= new HttpHeaders().set('Content-Type','application/json');

        return this._http.get(this.url+"user-topics/"+id,{headers:headers});

    }

    getTopic(id):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');

        return this._http.get(this.url+"topic/"+id,{headers:headers});
    }

    update(id,token,topic):Observable<any>{
        let params=JSON.stringify(topic);
        let headers=new HttpHeaders().set('Content-Type','application/json').set('Authorization',token);

        return this._http.put(this.url+"topic/"+id,params,{headers:headers});
    }

    deleteTopic(id,token):Observable<any>{

        let headers= new HttpHeaders().set('Content-Type','application/json').set('Authorization',token);

        return this._http.delete(this.url+"topic/"+id,{headers:headers});
    }
    

    getTopics(page=1):Observable<any>{
        return this._http.get(this.url+"topics/"+page);
    }

    search(search):Observable<any>{
        
        return this._http.get(this.url+"search/"+search);
    }

    
}