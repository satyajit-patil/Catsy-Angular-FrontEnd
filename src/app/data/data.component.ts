import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { QueryStringParametersService } from '../query-string-parameters.service';

/**
 * This class represents the data components on the main catalog page.
 * It is used to render the navigation bars and the results
 */
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  providers: [ItemDetailComponent]
})
export class DataComponent implements OnInit {

  numPerPage = 8; // number of results per page

  displayData = []; // data to be rendered; array of pages
  displayDataForCurrentPage = []; // data to be rendered; array of rows
  itemsPerRow = 4; // number of items per row on a page

  currentPageNumber; // tracks the current page number
  currentPageNumberButtonIndex; // tracks the current button number

  // variables for the four page-navigation buttons
  buttonOnePageNumber;
  buttonTwoPageNumber;
  buttonThreePageNumber;
  buttonFourPageNumber;

  // variable to store results information on the navigation bar
  startResultsRange;
  endResultsRange;
  totalResults = 0;

  constructor(private getDataService: GetDataService,
    private itemDetailComponent: ItemDetailComponent,
    private queryStringParameters: QueryStringParametersService) { }

  /**
   * This method executes whenever the page is reloaded.
   * It gets the current page number as a QSP and the current button index to render.
   */
  ngOnInit() {
    // get current page number
    var pageNumberParameter = this.queryStringParameters.getParameterByName('page', null);
    if (!pageNumberParameter) pageNumberParameter = "1";
    this.currentPageNumber = Number(pageNumberParameter);

    // get current page button index using cached value
    this.currentPageNumberButtonIndex = Number(localStorage.getItem("currentPageNumberButtonIndex"));
    if (!this.currentPageNumberButtonIndex) this.currentPageNumberButtonIndex = 1;
    if (this.currentPageNumber <= 4) this.currentPageNumberButtonIndex = this.currentPageNumber;

    // get current cached Items Per Page
    var cacheNumPerPage = Number(localStorage.getItem("numPerPage"));

    // get cached total results
    this.totalResults = Number(localStorage.getItem("totalResults"));

    // get cached display object
    var displayDataObject = JSON.parse(localStorage.getItem("displayDataObject"));

    this.getDataService.getData().subscribe(data => {
      //IF there is no cached display object OR the number of items per page value has changed
      if (!displayDataObject || (cacheNumPerPage != this.numPerPage)) {
        // repopulate displayData (number of pages and items per page has changed)
        this.totalResults = 0;
        this.populateDisplayData(data);
      }
      // ELSE get display data from cached display data
      else {
        this.displayData = displayDataObject["displayData"];
      }

      // IF page number is invalid, change current page number to 1
      if (this.currentPageNumber > this.displayData.length || this.currentPageNumber < 0) {
        window.location.href = this.queryStringParameters.updateQueryStringParameter("", "page", 1);
      }

      this.determineAndHighlightPageButtons();
      this.determineStartAndEndRange();

      // store display data for CURRENT page (-1 to account for 0-based indexing)
      this.displayDataForCurrentPage = this.displayData[this.currentPageNumber - 1]
    });
  }

  /**
   * This function executes when the page is initialized. It organizes the data which will be displayed
   * @param data 
   */
  populateDisplayData(data) {
    var pageItem = []; // data within a page
    var rowItemNum = 0; // current number of items in row
    var rowItem = {}; // data within a row
    rowItem["data"] = [];
    var numItemsOnPage = 0; // current number of items on page

    // FOR each item in data
    for (var key in data) {
      //get item information and push to data for row
      var itemInformation = {};
      itemInformation['stockId'] = key;
      itemInformation['description'] = data[key]['name'];
      itemInformation['imgSrc'] = data[key]['assets'][0]['thumbnail_url'];
      if (typeof itemInformation['imgSrc'] == 'undefined') itemInformation['imgSrc'] = 'https://mbtskoudsalg.com/images/no-image-png-1.png';
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

    // cache information about displayData
    var displayDataObject = {};
    displayDataObject["displayData"] = this.displayData;
    localStorage.setItem("displayDataObject", JSON.stringify(displayDataObject));
    localStorage.setItem("numPerPage", JSON.stringify(this.numPerPage));
    localStorage.setItem("totalResults", JSON.stringify(this.totalResults));
  }

  /**
   * Determines page numbers for each button. Highlights the current button.
   */
  determineAndHighlightPageButtons(): void {
    // IF current page button index is 1
    if (this.currentPageNumberButtonIndex == 1) {
      this.buttonOnePageNumber = this.currentPageNumber;
      this.buttonTwoPageNumber = this.buttonOnePageNumber + 1;
      this.buttonThreePageNumber = this.buttonTwoPageNumber + 1;
      this.buttonFourPageNumber = this.buttonThreePageNumber + 1;
    }
    //ELSE IF current page button index is 2
    else if (this.currentPageNumberButtonIndex == 2) {
      this.buttonTwoPageNumber = this.currentPageNumber;
      this.buttonOnePageNumber = this.buttonTwoPageNumber - 1;
      this.buttonThreePageNumber = this.buttonTwoPageNumber + 1;
      this.buttonFourPageNumber = this.buttonThreePageNumber + 1;
    }
    //ELSE IF current page button index is 3
    else if (this.currentPageNumberButtonIndex == 3) {
      this.buttonThreePageNumber = this.currentPageNumber;
      this.buttonTwoPageNumber = this.buttonThreePageNumber - 1;
      this.buttonOnePageNumber = this.buttonTwoPageNumber - 1;
      this.buttonFourPageNumber = this.buttonThreePageNumber + 1;
    }
    //ELSE IF current page button index is 4
    else if (this.currentPageNumberButtonIndex == 4) {
      this.buttonFourPageNumber = this.currentPageNumber;
      this.buttonThreePageNumber = this.buttonFourPageNumber - 1;
      this.buttonTwoPageNumber = this.buttonThreePageNumber - 1;
      this.buttonOnePageNumber = this.buttonTwoPageNumber - 1;
    }

    // All button page numbers should be greater than 0 and less than or equal to total number of pages
    if (this.buttonOnePageNumber <= 0 || this.buttonOnePageNumber > this.displayData.length) this.buttonOnePageNumber = null;
    if (this.buttonTwoPageNumber <= 0 || this.buttonTwoPageNumber > this.displayData.length) this.buttonTwoPageNumber = null;
    if (this.buttonThreePageNumber <= 0 || this.buttonThreePageNumber > this.displayData.length) this.buttonThreePageNumber = null;
    if (this.buttonFourPageNumber <= 0 || this.buttonFourPageNumber > this.displayData.length) this.buttonFourPageNumber = null;

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
  }

  /**
  * Calculate starting range and ending range of results in navigation bar
  */
  determineStartAndEndRange(): void {
    this.startResultsRange = ((this.currentPageNumber - 1) * this.numPerPage) + 1;
    if (this.currentPageNumber == this.displayData.length) {
      this.endResultsRange = this.totalResults;
    }
    else {
      this.endResultsRange = this.currentPageNumber * this.numPerPage;
    }
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
      this.currentPageNumberButtonIndex = 1;
    }
    // ELSE IF user clicked '>>' button
    else if (pageNumberInput == '>>') {
      this.currentPageNumber = this.displayData.length;
      this.currentPageNumberButtonIndex = 4;
    }
    // ELSE user clicked a page number
    else {
      if (pageNumberInput > 0 && pageNumberInput <= this.displayData.length) {
        this.currentPageNumber = pageNumberInput;
        this.currentPageNumberButtonIndex = buttonNumber;
      }
    }

    // smooth scroll to top
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);

    //store current page button index so it can be used on page reload
    localStorage.setItem("currentPageNumberButtonIndex", this.currentPageNumberButtonIndex + "");

    var newUrl = window.location.href;
    window.location.href = this.queryStringParameters.updateQueryStringParameter(newUrl, "page", this.currentPageNumber);
  }

  /**
   * Function executes when an item is selected on the page
   * 
   * @param item selected on the home page
   */
  onSelect(item): void {
    this.itemDetailComponent.populateItemDetails(); // Get item details from data
    window.location.href = this.queryStringParameters.updateQueryStringParameter("item", "details", item.stockId);
  }
}
