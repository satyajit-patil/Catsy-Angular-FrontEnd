import { Component, OnInit, Input } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { QueryStringParametersService } from '../query-string-parameters.service';

/**
 * This class is used to render the details page for a particular item
 */
@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @Input() item;

  itemDetails = []; // store product details object

  constructor(private getDataService : GetDataService,
    private queryStringParameters: QueryStringParametersService) {
   }

  ngOnInit() {
    // declare and initialize product details to empty values when page loads for first time
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
    this.populateItemDetails();
    return this.itemDetails;
  }

  /**
   * This method gets the items details for a particular stockId from the data provided
   * 
   * @param data 
   * @param stockId 
   */
  populateItemDetails() {
        // get product stockID
        var stockId = this.queryStringParameters.getParameterByName('details', null);
        if(stockId)
        {
          // get itemDetails for stockID by subsribing to data
          this.itemDetails = [];
          this.getDataService.getData().subscribe(data => {
            var productDetails = {};
            productDetails['description'] = data[stockId]['name'];
            productDetails['stockNumber'] = data[stockId]['number'];
            productDetails['productCategory'] = data[stockId]['category'];
            productDetails['stockType'] = data[stockId]['stock_type'];
            productDetails['eccn'] = data[stockId]['eccn'];
            productDetails['rohs'] = data[stockId]['rohs_compliant'];
            productDetails['manager'] = data[stockId]['product_manager'];
            productDetails['packageType'] = data[stockId]['package_type'];
            productDetails['multiple'] = data[stockId]['multiple'];
            productDetails['productSeries'] = data[stockId]['product_series'];
            productDetails['productStatus'] = data[stockId]['product_status'];
            productDetails['COO'] = data[stockId]['country_of_origin'];
            productDetails['htsCode'] = data[stockId]['hts_code'];
            productDetails['leadtime'] = data[stockId]['leadtime'];
            productDetails['unitWeight'] = data[stockId]['unite_weight_grams'];
            productDetails['packageSize'] = data[stockId]['package_size'];
            productDetails['disMOQ'] = data[stockId]['dis_moq'];
            this.itemDetails.push(productDetails);        });
        }
  }
}
