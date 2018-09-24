import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { GetDataService } from './get-data.service';
import { ItemNailComponent } from './item-nail/item-nail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    DataComponent,
    SideBarComponent,
    ItemNailComponent,
    ItemDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path:'item',
        component: ItemDetailComponent
      }
    ])
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
