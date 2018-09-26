import { Component, OnInit } from '@angular/core';

/**
 * This class is used to render the sidebar (to filter) on the home catalog page
 */
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /**
   * When a particular filter is selected, show its dropdown content
   * @param dropdownContent 
   */
  onFilterSelect(dropdownContent) {
    document.getElementById(dropdownContent).classList.toggle("show");
}

}
