import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  height: string;
  
  constructor() { }

  ngOnInit() {
    this.height = String(Math.floor(window.outerHeight * 0.3)) + "px"
  }
}
