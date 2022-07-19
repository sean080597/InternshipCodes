import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() isGlobalScope: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
