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
    var productDetails = {};
    productDetails['description'] = "Not Provided";
    productDetails['stockNumber'] = "Not Provided";
    productDetails['productCategory'] = "Not Provided";
    productDetails['stockType'] = "Not Provided";
    productDetails['eccn'] = "Not Provided";
    productDetails['rohs'] = "Not Provided";
    productDetails['manager'] = "Not Provided";
    productDetails['packageType'] = "Not Provided";
    productDetails['multiple'] = "Not Provided";
    productDetails['productSeries'] = "Not Provided";
    productDetails['productStatus'] = "Not Provided";
    productDetails['COO'] = "Not Provided";
    productDetails['htsCode'] = "Not Provided";
    productDetails['leadtime'] = "Not Provided";
    productDetails['unitWeight'] = "Not Provided";
    productDetails['packageSize'] = "Not Provided";
    productDetails['disMOQ'] = "Not Provided";

    this.itemDetails.push(productDetails);

    var stockId = this.getParameterByName('details', null);
    if(stockId)
    {
      this.itemDetails = [];
      this.getDataService.getData().subscribe(data => {
        this.populateItemDetails(data,stockId);
    });
    }
    return this.itemDetails;
  }

  populateItemDetails(data, stockId) {
    this.data = data;  
    var productDetails = {};
    productDetails['description'] = this.data[stockId]['name'];
    productDetails['stockNumber'] = this.data[stockId]['number'];
    productDetails['productCategory'] = this.data[stockId]['category'];
    productDetails['stockType'] = this.data[stockId]['stock_type'];
    productDetails['eccn'] = this.data[stockId]['eccn'];
    productDetails['rohs'] = this.data[stockId]['rohs_compliant'];
    productDetails['manager'] = this.data[stockId]['product_manager'];
    productDetails['packageType'] = this.data[stockId]['package_type'];
    productDetails['multiple'] = this.data[stockId]['multiple'];
    productDetails['productSeries'] = this.data[stockId]['product_series'];
    productDetails['productStatus'] = this.data[stockId]['product_status'];
    productDetails['COO'] = this.data[stockId]['country_of_origin'];
    productDetails['htsCode'] = this.data[stockId]['hts_code'];
    productDetails['leadtime'] = this.data[stockId]['leadtime'];
    productDetails['unitWeight'] = this.data[stockId]['unite_weight_grams'];
    productDetails['packageSize'] = this.data[stockId]['package_size'];
    productDetails['disMOQ'] = this.data[stockId]['dis_moq'];

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
