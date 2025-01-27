import { Component, computed, Inject, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../../service/users/login/login.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent implements OnInit {

  isDropdownOpen: boolean = false;
  //userId: string = '67604f00371b9b63f3ad02a9'

  isLogged!: Observable<boolean>;
  isEmail!: string | null;
  isFname!: string | null;
  isLname!: string | null;

  private loginService = inject(LoginService);
  private router = inject(Router);
  
  //isLogged = computed(() => this.loginService.isLogged())


  ngOnInit() {

    this.isLogged = this.loginService.loggedIn$;

    //  this.loginService.getUserLoggedId();
    //  console.log('the User ID from Navbar', this.userId)

    this.getDetails();
  }


  get menuItems() {
    const userId = this.loginService.getUserLoggedId()
    const userMaterialPath = `/users/${userId}/material`;
    return [
    { name: 'Home', path: '/users/home' },
    { name: 'Study Material', path: userMaterialPath  },
    { name: 'Quiz', path: '/users/quiz' },
    { name: 'Contact' }
    ]
  };

  getDetails() {
    this.loginService.users$.subscribe({
      next: (user) => {
        this.isEmail = user.email;
        this.isFname = user.fname;
        this.isLname = user.lname;
        console.log('Logged email', user);
      },
    });
  }

  toggleDropdown = () => {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown toggled:', this.isDropdownOpen);
  };

  logOut = () => {
    this.isDropdownOpen = false;
    this.loginService.logOut();
    this.router.navigate(['/']);
  };
}
