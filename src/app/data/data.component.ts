import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { QueryStringParametersService } from '../query-string-parameters.service';

/**
 * This class represents the data components on the main catalog page.
 * It is used to render the navigation bar and the results
 */
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  providers: [ItemDetailComponent]
})
export class DataComponent implements OnInit {

  data = {}; // store input data
  displayData = []; // data to be rendered; array of pages
  numPerPage = 12; // number of results per page
  itemsPerRow = 4; // number of items per row on a page

  currentPageNumber = 1; // tracks the current page number
  currentPageNumberButtonIndex = 1; // tracks the current button number

  // initialize values for the four page-navigation buttons
  buttonOnePageNumber = 1;
  buttonTwoPageNumber = 2;
  buttonThreePageNumber = 3;
  buttonFourPageNumber = 4;

  // results information on the navigation bar
  startResultsRange = 1;
  endResultsRange = 0;
  totalResults = 0;


  constructor(private getDataService: GetDataService,
    private itemDetailComponent: ItemDetailComponent,
    private queryStringParameters: QueryStringParametersService) { }

  ngOnInit() {
        this.getDataService.getData().subscribe(data => {
      this.populateDisplayData(data);
    });
  }

  /**
   * This function is triggered when the user clicks on a button on the page navigation bar
   * 
   * @param pageNumberInput page number of button clicked
   * @param buttonNumber the button which was clicked (1,2,3,4)
   */
  pageChange(pageNumberInput, buttonNumber): void {

    // IF user has clicked the '<' button
    if (pageNumberInput == '<') {
      // currentPageNumber has to be greater than 1
      if (this.currentPageNumber > 1) {
        // IF left shifting is needed
        if (this.currentPageNumber == this.buttonOnePageNumber) {
          this.buttonFourPageNumber = this.currentPageNumber - 1;
          this.buttonThreePageNumber = this.buttonFourPageNumber - 1;
          this.buttonTwoPageNumber = this.buttonThreePageNumber - 1;
          this.buttonOnePageNumber = this.buttonTwoPageNumber - 1;
          this.currentPageNumberButtonIndex = 4;
        }
        // ELSE no need to left shift buttons
        else {
          this.currentPageNumberButtonIndex--;
        }
        this.currentPageNumber--;
      }
    }
    //ELSE IF user have clicked the '>' button
    else if (pageNumberInput == '>') {
      // current page number has to be less than total number of pages
      if (this.currentPageNumber < this.displayData.length) {
        //IF right shifting is needed
        if (this.currentPageNumber == this.buttonFourPageNumber) {
          this.buttonOnePageNumber = this.buttonFourPageNumber + 1;
          this.buttonTwoPageNumber = this.buttonOnePageNumber + 1;
          this.buttonThreePageNumber = this.buttonTwoPageNumber + 1;
          this.buttonFourPageNumber = this.buttonThreePageNumber + 1;
          this.currentPageNumberButtonIndex = 1;
        }
        // ELSE no right shifting needed
        else {
          this.currentPageNumberButtonIndex++;
        }
        this.currentPageNumber++;
      }
    }
    // ELSE IF user clicked '<<' button
    else if (pageNumberInput == '<<') {
      this.currentPageNumber = 1;
      this.buttonOnePageNumber = this.currentPageNumber;
      this.buttonTwoPageNumber = this.buttonOnePageNumber + 1;
      this.buttonThreePageNumber = this.buttonTwoPageNumber + 1;
      this.buttonFourPageNumber = this.buttonThreePageNumber + 1;
      this.currentPageNumberButtonIndex = 1;
    }
    // ELSE IF user clicked '>>' button
    else if (pageNumberInput == '>>') {
      this.currentPageNumber = this.displayData.length;
      this.buttonFourPageNumber = this.currentPageNumber;
      this.buttonThreePageNumber = this.buttonFourPageNumber - 1;
      this.buttonTwoPageNumber = this.buttonThreePageNumber - 1;
      this.buttonOnePageNumber = this.buttonTwoPageNumber - 1;
      this.currentPageNumberButtonIndex = 4;
    }
    // ELSE user clicked a page number
    else {
      if (pageNumberInput > 0 && pageNumberInput <= this.displayData.length) {
        this.currentPageNumber = pageNumberInput;
        this.currentPageNumberButtonIndex = buttonNumber;
      }
    }

    // All button page numbers should be greater than 0 and less than or equal to total number of pages
    if (this.buttonOnePageNumber <= 0 || this.buttonOnePageNumber > this.displayData.length) this.buttonOnePageNumber = null;
    if (this.buttonTwoPageNumber <= 0 || this.buttonTwoPageNumber > this.displayData.length) this.buttonTwoPageNumber = null;
    if (this.buttonThreePageNumber <= 0 || this.buttonThreePageNumber > this.displayData.length) this.buttonThreePageNumber = null;
    if (this.buttonFourPageNumber <= 0 || this.buttonFourPageNumber > this.displayData.length) this.buttonFourPageNumber = null;

    // Caluclate starting range and ending range of results in navigation bar
    this.startResultsRange = ((this.currentPageNumber - 1) * this.numPerPage) + 1;
    if (this.currentPageNumber == this.displayData.length) {
      this.endResultsRange = this.totalResults;
    }
    else {
      this.endResultsRange = this.currentPageNumber * this.numPerPage;
    }

    // Highlight ONLY current page button
    Array.from(document.getElementsByName("buttonNumber1")).forEach((element) => { 
      element.style.backgroundColor = "white";
    })
    Array.from(document.getElementsByName("buttonNumber2")).forEach((element) => { 
      element.style.backgroundColor = "white";
    })
    Array.from(document.getElementsByName("buttonNumber3")).forEach((element) => { 
      element.style.backgroundColor = "white";
    })
    Array.from(document.getElementsByName("buttonNumber4")).forEach((element) => { 
      element.style.backgroundColor = "white";
    })
    Array.from(document.getElementsByName("buttonNumber" + this.currentPageNumberButtonIndex)).forEach((element) => { 
      element.style.backgroundColor = "darkgray";
    }); 

    // smooth scroll to top
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);

  }

  /**
   * Function executes when an item is selected on the page
   * 
   * @param item selected on the home page
   */
  onSelect(item): void {
    this.itemDetailComponent.populateItemDetails(this.data, item.stockId); // Get item details from data
    var newUrl = window.location.href + "item";
    window.location.href = this.queryStringParameters.updateQueryStringParameter(newUrl, "details", item.stockId);
  }

  /**
   * This function executes when the page is initialized. It organizes the data which will be displayed
   * @param data 
   */
  populateDisplayData(data) {
    this.data = data;

    var pageItem = []; // data within a page
    var rowItemNum = 0; // current number of items in row
    var rowItem = {}; // data within a row
    rowItem["data"] = [];
    var numItemsOnPage = 0; // current number of items on page

    // FOR each item in data
    for (var key in this.data) {
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
      numItemsOnPage++;
      this.totalResults++;

      // IF row is filled, push rowItem to pageItem
      if (rowItemNum == this.itemsPerRow) {
        pageItem.push(rowItem);
        rowItemNum = 0;
        rowItem = {};
        rowItem["data"] = [];
      }

      // IF items displayed on page equals number of items per page
      if (numItemsOnPage == this.numPerPage) {
        //IF row is not filled, push rowItem to pageItem
        if (rowItem["data"].length !== 0) {
          pageItem.push(rowItem);
          rowItemNum = 0;
          rowItem = {};
          rowItem["data"] = [];
        }
        this.displayData.push(pageItem);
        pageItem = [];
        numItemsOnPage = 0;
      }
    }

    // IF on last page and row is incomplete, push pageItem with rowItem
    if (rowItem["data"].length !== 0) {
      pageItem.push(rowItem);
      rowItemNum = 0;
      rowItem = {};
      rowItem["data"] = [];
      this.displayData.push(pageItem);
    }

    // initialize endResultsRange
    if (this.totalResults < this.numPerPage) {
      this.endResultsRange = this.totalResults;
    }
    else {
      this.endResultsRange = this.numPerPage;
    }

    // Highlight first page button in both navigation bars
    Array.from(document.getElementsByName("buttonNumber" + this.currentPageNumberButtonIndex)).forEach((element) => { 
      element.style.backgroundColor = "darkgray";
    });
  }
}
