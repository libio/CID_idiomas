import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http"; // Necesario para la API REST
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

// Definiciones de interfaces (ajusta el nombre del archivo user.model.ts si es necesario)
interface UserCredentials {
  nombreUsuario: string;
  contrasenaPlana: string;
}

interface LoginResponse {
  token: string;
  rol: string;
  idUsuario: number;
  nombreCompleto: string;
  email: string; // Añadido
  telefono: string; // Añadido
  direccion: string; // Añadido
  fechaNacimiento: string; // Añadido
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Inyección de dependencias moderna
  private http = inject(HttpClient);
  private router = inject(Router);

  // Claves de almacenamiento
  private readonly API_URL = "http://181.65.139.37:8080/api/Auth/login"; // Usar la URL de tu API
  private readonly TOKEN_KEY = "jwt_token";
  private readonly ROL_KEY = "user_role";

  // =======================================================
  // 1. AUTENTICACIÓN (LOGIN)
  // =======================================================

  signIn(credentials: UserCredentials): Observable<LoginResponse> {
    const body = {
      nombreUsuario: credentials.nombreUsuario,
      contrasenaPlana: credentials.contrasenaPlana,
    };

    return this.http.post<LoginResponse>(this.API_URL, body).pipe(
      // Almacenar el token y el rol tras el éxito
      tap((response) => {
        if (response.token) {
          // 1. Datos de Sesión
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROL_KEY, response.rol);

          // 2. Datos de Perfil (AÑADIR ESTO)
          localStorage.setItem("idUsuario", response.idUsuario.toString());
          localStorage.setItem("nombreCompleto", response.nombreCompleto);
          localStorage.setItem("email", response.email);
          localStorage.setItem("telefono", response.telefono);
          localStorage.setItem("direccion", response.direccion);
          localStorage.setItem("fechaNacimiento", response.fechaNacimiento);
        }
      })
    );
  }

  // =======================================================
  // 2. LOGOUT Y UTILIDADES
  // =======================================================

  signOut() {
    // 1. Limpia todas las claves de sesión y perfil guardadas (¡Añadir las claves de perfil!)
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROL_KEY);
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("nombreCompleto");
    localStorage.removeItem("email");
    localStorage.removeItem("telefono");
    localStorage.removeItem("direccion");
    localStorage.removeItem("fechaNacimiento");

    // 2. Redirige a la ruta de Login (que está definida como /auth)
    this.routerlink("/auth"); // ✅ CORREGIDO
  }

  routerlink(url: string) {
    this.router.navigateByUrl(url);
  }

  // Métodos de consulta (Usados en Guards y Sidebar)
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROL_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Métodos de Rol
  isAdmin(): boolean {
    return this.getRole() === "Administrador";
  }

  isDocente(): boolean {
    return this.getRole() === "Docente";
  }

  isEstudiante(): boolean {
    return this.getRole() === "Estudiante";
  }

  // =======================================================
  // 3. CONSULTAS DE PERFIL (Para el PerfilComponent)
  // =======================================================

  getPerfil(): Observable<any> {
    const rol = this.getRole();
    let url = "";

    // Asume que el Interceptor se encarga de adjuntar el token.
    // Aquí solo defines la ruta específica por rol.

    if (rol === "Estudiante") {
      url = "http://181.65.139.37:8080/api/Estudiante/perfil";
    } else if (rol === "Administrador") {
      url = "http://181.65.139.37:8080/api/Administrador/perfil";
    } else if (rol === "Docente") {
      url = "http://181.65.139.37:8080/api/Docente/perfil";
    } else {
      return new Observable((obs) => obs.error("Rol no válido"));
    }

    return this.http.get(url); // El Interceptor añade el JWT automáticamente
  }

  // Nuevos métodos para obtener datos de perfil
  getUserFullName(): string | null {
    return localStorage.getItem("nombreCompleto");
  }
  getUserEmail(): string | null {
    return localStorage.getItem("email");
  }
}
