import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';

import { Location } from '@angular/common';
import { filter, pairwise } from 'rxjs';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  httpCode: string = '';
  errMessage: string = '';
  errDesciption: string = '';
  previousUrl: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: any) => {
    //     this.previousUrl = event.url;
    //     if (this.previousUrl === '/error') {
    //       this.router.navigate(['/'])
    //     }
    //   })
    
  }

  ngOnInit(): void {
    if (!history.state['httpCode'] && this.route.snapshot.data && this.route.snapshot.data['httpCode']) {
      this.httpCode = this.route.snapshot.data['httpCode'];
      this.errMessage = this.httpCode ? 'Page not found' : 'Unknown error';
    } else if (history.state) {
      this.httpCode = history.state['httpCode'];
      this.errMessage = history.state['errMessage'] || 'Unknown error';
    }
  }

}
