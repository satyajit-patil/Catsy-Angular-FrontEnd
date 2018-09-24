import { Component, OnInit, Input } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { QueryStringParametersService } from '../query-string-parameters.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @Input() item;

  itemDetails = [];
  data = {};

  constructor(private getDataService : GetDataService,
    private queryStringParameters: QueryStringParametersService) {
   }

  ngOnInit() {
    var productDetails = {};
    productDetails['description'] = "";
    productDetails['stockNumber'] = "";
    productDetails['productCategory'] = "";
    productDetails['stockType'] = "";
    productDetails['eccn'] = "";
    productDetails['rohs'] = "";
    productDetails['manager'] = "";
    productDetails['packageType'] = "";
    productDetails['multiple'] = "";
    productDetails['productSeries'] = "";
    productDetails['productStatus'] = "";
    productDetails['COO'] = "";
    productDetails['htsCode'] = "";
    productDetails['leadtime'] = "";
    productDetails['unitWeight'] = "";
    productDetails['packageSize'] = "";
    productDetails['disMOQ'] = "";

    this.itemDetails.push(productDetails);

    var stockId = this.queryStringParameters.getParameterByName('details', null);
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
}
