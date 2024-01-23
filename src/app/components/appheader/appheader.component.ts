import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})

export class AppheaderComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  user: string = ''

  ngOnInit(): void {
    const data = this.authenticationService.getLoggedUser()
    this.user = JSON.parse(data).username
  }

  logout() {
    this.authenticationService.loggout()
  }
}
