import { Component, OnInit, Input } from '@angular/core';
import { GetDataService } from '../get-data.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @Input() item;

  itemDetails = [];
  data = {};

  constructor(private getDataService : GetDataService) {
   }

  ngOnInit() {
    //this.data = this.getDataService.getData();
    var stockId = this.getParameterByName('details', null);
    if(stockId)
    {
      this.getDataService.getData().subscribe(data => {
        this.populateItemDetails(data,stockId);
    });
    }
    else
    {
      var productDetails = {};
      productDetails['description'] = "";
      this.itemDetails.push(productDetails);
    }
  }

  populateItemDetails(data, stockId) {
    this.data = data;  
    var productDetails = {};
    productDetails['description'] = this.data[stockId]['name'];
    this.itemDetails.push(productDetails);
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

}
