import { Component, OnInit } from '@angular/core';

import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {global} from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers:[UserService]
})
export class UsersComponent implements OnInit {

  public users:User[];
  public status;
  public url;
  public page_title;
  constructor(
    private _userService:UserService
  ) { 
    this.url=global.url;
    this.page_title="Usuarios"
  }

  ngOnInit(): void {

    this.getUsers();
    
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        if(response.status=="success"){
          this.users=response.users;
          console.log(this.users);
          
        }else{
          this.status="error";
        }
        
      },
      error=>{
        console.log(error);
        
      }
    );
  }

}
