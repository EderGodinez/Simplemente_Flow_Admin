import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
   private fb=inject(FormBuilder);
   private authService=inject(AuthService)
   private router=inject(Router)

   public LoginForm: FormGroup=this.fb.group({
    email:['SalazarHerrera@hotmail.com',[Validators.email,Validators.required]],
    password:['1010101010aaa',[Validators.minLength(10),Validators.required]],
   })
   login (){
    const {email,password}=this.LoginForm.value;
    this.authService.login(email,password)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (error) =>{
        Swal.fire({
          icon: 'error',
          title: error,
          text: 'Something went wrong!',
        })
      }
    })
   }
}
