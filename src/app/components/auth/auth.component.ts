import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Añadir FormBuilder, Validators
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service'; 


@Component({
  selector: 'app-auth',
  standalone: true,
  // Cambiamos FormsModule por ReactiveFormsModule
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './auth.component.html',

})
export default class AuthComponent implements OnInit {
  
  // Inyección de dependencias moderna
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder); // Inyectamos FormBuilder

  currentYear = new Date().getFullYear();
  form!: FormGroup; // Declaramos el FormGroup
  error: string = ''; // Para mostrar mensajes de error

  ngOnInit(): void {
    // Inicialización del formulario reactivo
    this.form = this.fb.group({
      // Definimos los controles y sus validadores (REQUIRED es el mínimo)
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Cambiamos onLogin() a submit() para ser estándar en formularios reactivos
  submit(){
    this.error = ''; 

    if (this.form.invalid) {
      this.error = 'Por favor, completa correctamente todos los campos.';
      this.form.markAllAsTouched(); // Para mostrar errores de validación en el HTML
      return;
    }

    // Usamos this.form.value para obtener los datos del formulario
    const credentials = { 
      nombreUsuario: this.form.value.email,      
      contrasenaPlana: this.form.value.password  
    };

    // Lógica de autenticación (la misma que tenías)
    this.authService.signIn(credentials)
      .subscribe({
        next: (res) => {
          // Almacenamiento y redirección basada en roles... (Misma lógica de antes)
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          // ... guardar otros datos de perfil ...
          
          const role = res.rol;
          let redirectUrl = '/dashboard'; 
          if (role === 'Administrador') redirectUrl = '/admin/dashboard';
          else if (role === 'Docente') redirectUrl = '/docente/dashboard';
          else if (role === 'Estudiante') redirectUrl = '/estudiante/dashboard';

          this.router.navigate([redirectUrl]);
        },
        error: () => {
          this.error = 'Credenciales incorrectas. Verifique usuario y contraseña.';
        }
      });
  }
}