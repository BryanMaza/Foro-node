import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {UserService} from '../../services/user.service';
import {global} from '../../services/global';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-edit',
  templateUrl: '../register/register.component.html',
  styleUrls: ['../register/register.component.css'],
  providers:[UserService]
})
export class UserEditComponent implements OnInit {

  public page_title:string;
  public user:User;
  public status;
  public identity;
  public token;
  public user_edit:boolean;
  public afuConfig;
  public url;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _route:ActivatedRoute
  ) { 
    this.page_title="Ajustes del usuario";
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    this.user=this.identity;
    this.user_edit=true;
    this.url=global.url;
    this.afuConfig={
      multiple:false,
      formatsAllowed:".jpg, .jpeg, .png, .gif",
      maxSize:"50",
      uploadAPI:{
        url:this.url+"upload-avatar",
        headers:{
          "Authorization":this.token
        }
        
      },
      theme:"attachPin",
      hideProgressBar:false,
      hideResetBtn:false,
      hideSelectBtn:false,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Subir avatar',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }
    }
  }

  ngOnInit(): void {

  
    
  }

  onSubmit(form){

    this._userService.update(this.user).subscribe(
      response=>{
        if(!response.user){
          this.status="error";
        }else{
          this.status="success";
          localStorage.setItem('identity',JSON.stringify(this.user));
        }
        
      },
      error=>{
        this.status="error";
        console.log(<any>error);
        
      }
    );
  }
  avatarUpload(data){
    
    let data_obj=data.body.user;
    

    this.user.image=data_obj.image;
    
  
  }

  
}
