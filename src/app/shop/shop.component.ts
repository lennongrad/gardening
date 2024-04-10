import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.less']
})
export class ShopComponent implements OnInit {
  @Input() activeWindow: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
