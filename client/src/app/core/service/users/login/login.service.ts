import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Register } from '../../../../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api/users';
  private tokenKey = 'token';
  //private emailKey = 'email';
  private userKey = 'user';
  loggedInUserId: string = this.getUserIdFromStorage();
  private userIdKey = 'loggedInUserId';

  private isLogged = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.isLogged.asObservable();

  private isUsers = new BehaviorSubject<{
    email: string | null;
    fname: string | null;
    lname: string | null;
  }>({
    email: this.getEmailFromStorage(),
    fname: this.getFnameFromStorage(),
    lname: this.getLnameFromStorage(),
  });
  users$ = this.isUsers.asObservable();

  //isLogged = signal<boolean>(this.hasToken())

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{
    success: boolean;
    message: string;
    token: string;
    role: string;
    users: { email: string; fname: string; lname: string, _id: string };
  }> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        token: string;
        role: string;
        users: { email: string; fname: string; lname: string; _id: string };
      }>(`${this.apiUrl}/home`, { email, password })
      .pipe(
        tap((response) => {
          console.log('Login Response', response);
          console.log('User Role:', response.role);
          if (response.success && response.role) {
            this.loggedInUserId = response.users._id
            localStorage.setItem(this.userIdKey, this.loggedInUserId); 
            console.log('This is logged In User ID:', this.loggedInUserId)
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem('email', response.users.email);
            localStorage.setItem('fname', response.users.fname);
            localStorage.setItem('lname', response.users.lname);
            localStorage.setItem('role', response.role);
            this.isLogged.next(true);
            this.isUsers.next({
              email: response.users.email,
              fname: response.users.fname,
              lname: response.users.lname,
            });

            console.log('Users:', response.users);
            console.log('Token:', response.token);
          }
        })
      );
  }

  logOut() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('email');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    localStorage.removeItem('role');
    localStorage.removeItem(this.userIdKey);
    //localStorage.clear();
    this.isLogged.next(false);
    this.isUsers.next({ email: null, fname: null, lname: null });
    //this.isLogged.set(false)
    console.log('Token after logout:', this.getToken());
  }

  private getEmailFromStorage(): string | null {
    return localStorage.getItem('email');
  }

  private getFnameFromStorage(): string | null {
    return localStorage.getItem('fname');
  }

  private getLnameFromStorage(): string | null {
    return localStorage.getItem('lname');
  }

  getUserRoleStorage() {
    const userRole = localStorage.getItem('role');
    console.log('User Role is:', userRole);
    return userRole;
  }

  getToken() {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved Token:', token);
    return token;
  }

  getUserLoggedId() {
    return this.loggedInUserId || this.getUserIdFromStorage(); 
  }
 
  private getUserIdFromStorage(): string {
  return localStorage.getItem(this.userIdKey) || ''; // Retrieve ID from localStorage
}

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
