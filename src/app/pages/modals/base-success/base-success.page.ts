import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-base-success',
  templateUrl: './base-success.page.html',
  styleUrls: ['./base-success.page.scss'],
})
export class BaseSuccessPage implements OnInit {

  @Input() message;

  constructor() {}

  ngOnInit() {}

}
