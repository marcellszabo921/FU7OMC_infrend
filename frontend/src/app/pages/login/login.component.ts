import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.loginService(this.loginForm.value)
    .subscribe({
      next: (res) => {
        console.log(res);
  
        if (res.data) {
          localStorage.setItem('token', res.data);
          localStorage.setItem('roles', res.roles[0].role);  
  
          //alert("User logged in!");
          console.log(document.cookie);
 
          if (res.roles[0].role === 'Admin') {
            this.router.navigate(['rent']);
          } else {
            this.router.navigate(['rent']);
          }
        }
  
        this.loginForm.reset();
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
  
}

