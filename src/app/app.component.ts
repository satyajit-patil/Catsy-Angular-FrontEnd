import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myName(){
    for(var i = 0; i < 100; i++)
    {
      console.log(i);
    }
  }
  title = 'ItemsDisplay';
}
