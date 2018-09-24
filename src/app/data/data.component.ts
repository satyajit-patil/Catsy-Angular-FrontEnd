import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { QueryStringParametersService } from '../query-string-parameters.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  providers: [ItemDetailComponent]
})
export class DataComponent implements OnInit {

  data = {};
  displayData = [];
  numPerPage = 16;
  numPerRow = 4;
  currentPageNumber = 1;
  totalPages = 1; 

  constructor(private getDataService: GetDataService, 
    private itemDetailComponent: ItemDetailComponent, 
    private queryStringParameters: QueryStringParametersService) { }

  ngOnInit() {
    this.getDataService.getData().subscribe(data => {
      this.populateDisplayData(data);
  });
  }

  pageChange(pageNumberInput): void {
  if(pageNumberInput == '<')
    {
      if(this.currentPageNumber > 1)
      {
        this.currentPageNumber--;
      }
    }
    else if(pageNumberInput == '>')
    {
      if(this.currentPageNumber < this.displayData.length)
      this.currentPageNumber++;
    }
    else if(pageNumberInput == '<<')
    {
      this.currentPageNumber = 1;
    }
    else if(pageNumberInput == '>>')
    {
      this.currentPageNumber = this.displayData.length;
    }
    else
    {
      this.currentPageNumber = pageNumberInput;
    }
  }
  
  onSelect(item): void {
    this.itemDetailComponent.populateItemDetails(this.data, item.stockId);
    window.location.href = this.queryStringParameters.updateQueryStringParameter(window.location.href, "item", "details", item.stockId);//this.updateQueryStringParameter(window.location.href, "item", "details", item.stockId);
  }

  populateDisplayData(data) {
    this.data = data;

    var pageItem = [];
    var rowItem = {};
    var rowNum = 1;
    var rowItemNum = 0;
    rowItem["row"] = rowNum;
    rowItem["data"] = [];
    var numDataDisplayed = 0;

    // FOR each product in data
    for (var key in this.data) {
      // IF data displayed equal number per page
      if (numDataDisplayed == this.numPerPage) {
        this.displayData.push(pageItem);
        pageItem = [];
        numDataDisplayed = 0;
        rowNum = 1;
        //break;
      }
        //get item information and push to data for row
        var itemInformation = {};
        itemInformation['stockId'] = key;
        itemInformation['description'] = this.data[key]['name'];
        itemInformation['imgSrc'] = this.data[key]['assets'][0]['thumbnail_url'];
        if (typeof itemInformation['imgSrc'] == 'undefined') {
          itemInformation['imgSrc'] = 'https://mbtskoudsalg.com/images/no-image-png-1.png';
        }
        rowItem["data"].push(itemInformation);
        rowItemNum++;
        numDataDisplayed++;

        // IF reached row max, push rowItem to displayData
        if (rowItemNum == this.numPerRow) {
          pageItem.push(rowItem);
          //this.displayData.push(rowItem);
          rowItemNum = 0;

          var rowItem = {};
          rowNum++;
          rowItem["row"] = rowNum;
          rowItem["data"] = [];
        }
    }
    this.totalPages = this.displayData.length;
  }
}
