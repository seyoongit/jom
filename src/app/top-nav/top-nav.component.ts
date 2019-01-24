import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  title: string = "Just Omok";
  height: string;
  
  constructor() { }

  ngOnInit() {
    this.height = String(Math.floor(window.outerHeight * 0.3)) + "px"
  }

}
