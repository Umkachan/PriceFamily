import { Component } from '@angular/core';
import { XmlSender } from '../services/xml-sender.service';
import { PriceInfo } from '../models/price-info.model';
import { Category } from '../models/category.model';
import { Offer } from '../models/offer.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.css']
})
export class HomeComponent {

  fileToUpload: File = null;
  priceInfo = new PriceInfo();
  inputCategory: Category[];
  inputOffers: Offer[] = [];
  additionalPrice = 0;
  additionalProcent = 0;
  priceIsExists: boolean;
  procentIsExists: boolean;
  currentCategory: number = 0;
  privateadditionalProcent = 0;
  privateadditionalPrice = 0;
  oneOfferId: number = 0;
  oneOfferCategory: number = 0;
  oneOfferType: string = '';
  changeOneOfferPopup: boolean = false;
  oneOfferName: string = '';

  constructor(private xmlSender: XmlSender) { }

  onChange(value) {
    debugger;
    this.filterOffers(+value);
  }

  ngOnInit() {

    if (this.inputOffers.length == 0) {

      this.priceIsExists = true;
      this.procentIsExists = true;
    }
  }

  priceIsChanged() {
    debugger;
    this.checkNull();
    this.priceIsExists = true;
    this.additionalProcent = 0;
    this.checkParametrs();
  }

  procentIsChanged() {
    debugger;
    this.checkNull();
    this.procentIsExists = true;
    this.additionalPrice = 0;
    this.checkParametrs();
  }

  private checkNull() {

    if (this.additionalPrice == null) {
      this.additionalPrice = 0;
    }

    if (this.additionalProcent == null) {
      this.additionalProcent = 0;
    }

  }

  checkParametrs() {

    if (this.additionalPrice == 0 && this.additionalProcent == 0 && this.inputOffers.length > 0) {

      this.procentIsExists = false;
      this.priceIsExists = false;
      return;
    }
  }

  selectOneOffer(offer: Offer) {
    debugger;
    this.oneOfferCategory = offer.categoryId;
    this.oneOfferId = offer.id;
    this.oneOfferName = offer.name;
    this.privateadditionalPrice = offer.price;
    if (this.changeOneOfferPopup) {

      return;
    }
    this.changeOneOfferPopup = true;
  }

  changeOneOffer(type: string) {

    this.oneOfferType = type;
    debugger;
    this.changeOneOfferPopup = false;
    this.changeCurrentOffer();
  }

  changeCurrentOffer() {
    debugger;

    if (this.oneOfferCategory != 0 && this.oneOfferId != 0 && this.oneOfferType) {

      this.changeOneOfferMainOffersArray(this.oneOfferCategory, this.oneOfferId, this.oneOfferType);
      this.changeOneOfferInInputOffersArray(this.oneOfferCategory, this.oneOfferId, this.oneOfferType);
    }
  }

  changeOneOfferMainOffersArray(categoryId: number, id: number, type: string) {

    let flag = 0;

    this.priceInfo.PriceOffers.forEach((element) => {

      if (element.categoryId == categoryId && element.id == id && flag == 0) {

        if (type == 'procent') {

          let discount = (element.price / 100) * this.privateadditionalProcent;

          element.price = element.price + discount;
          flag = 1;
        }

        if (type == 'price') {

          element.price = element.price + this.privateadditionalPrice;
          flag = 1;
        }
      }

    });

  }

  changeOneOfferInInputOffersArray(categoryId: number, id: number, type: string) {

    let flag = 0;

    this.inputOffers.forEach((element) => {

      if (element.categoryId == categoryId && element.id == id && flag == 0) {

        if (type == 'procent') {

          let discount = (element.price / 100) * this.privateadditionalProcent;

          element.price = element.price + discount;
          flag = 1;
        }

        if (type == 'price') {

          element.price = element.price + this.privateadditionalPrice;
          flag = 1;
        }
      }

    })
   
  }

  changeInputOffersByPrice() {

    this.inputOffers = this.inputOffers.map((x) => {

      var res = new Offer();
      res.categoryId = x.categoryId;
      res.description = x.description;
      res.id = x.id;
      res.name = x.name;

      if (this.currentCategory > 0 && this.currentCategory == res.categoryId) {
        res.price = x.price + this.additionalPrice;
        return res;
      }
      res.price = x.price + this.additionalPrice;
      return res;
    });
  }

  changeMainOffersByPrice() {

    this.priceInfo.PriceOffers.forEach((element) => {

      if (this.currentCategory > 0) {

        if (element.categoryId == this.currentCategory) {
          element.price = element.price + this.additionalPrice;
        }
      }

      if (this.currentCategory == 0) {

        element.price = element.price + this.additionalPrice;
      }
    });
  }

  changeAllPrice() {
    debugger;
    if (this.inputOffers.length == 0) {
      return;
    }

    if (this.additionalPrice != 0) {

      this.changeInputOffersByPrice();
      this.changeMainOffersByPrice();
    }

    if (this.additionalProcent != 0) {

      this.changeInputOffersByProcent();
      this.changeMainOffersByProcent();
      
    }
  }

  changeMainOffersByProcent() {

    this.priceInfo.PriceOffers.forEach((element) => {

      let discount = (element.price / 100) * this.additionalProcent;

      if (this.currentCategory > 0) {

        if (element.categoryId == this.currentCategory) {
          element.price = element.price = element.price - discount;
        }
      }

      if (this.currentCategory == 0) {

        element.price = element.price = element.price - discount;
      }
    });

  }

  changeInputOffersByProcent() {
    this.inputOffers = this.inputOffers.map((x) => {

      var res = new Offer();
      res.categoryId = x.categoryId;
      res.description = x.description;
      res.id = x.id;
      res.name = x.name;
      let discount = (x.price / 100) * this.additionalProcent;

      if (this.currentCategory > 0 && this.currentCategory == res.categoryId) {
        res.price = x.price - discount;
        return res;
      }
      res.price = x.price - discount;
      return res;
    });
  }

  handleFileInput(files: FileList) {

    this.fileToUpload = files.item(0);

    this.xmlSender.uploadFile(this.fileToUpload).subscribe((inputCategories) => {


      this.xmlSender.getCategories(this.fileToUpload.name).subscribe((categories) => {

        this.priceInfo.PriceCategories = categories;
        this.inputCategory = Object.assign([], this.priceInfo.PriceCategories);


        this.xmlSender.getOffers(this.fileToUpload.name).subscribe((offers) => {

          this.priceInfo.PriceOffers = offers;
          this.inputOffers = Object.assign([], this.priceInfo.PriceOffers);

          debugger;
          if (this.inputOffers.length > 0) {
            this.procentIsExists = false;
            this.priceIsExists = false;
          }
        });

      });
     
    });
  }

  filterOffers(categoryId: number) {


    this.currentCategory = categoryId;
    if (categoryId == 0) {
      this.inputOffers = Object.assign([], this.priceInfo.PriceOffers);
      return;
    }
    this.inputOffers = [];
    var res = this.priceInfo.PriceOffers.filter(x => {
      debugger;
      x.categoryId == categoryId
    });
    this.inputOffers = this.priceInfo.PriceOffers.filter(x => x.categoryId == categoryId);

  }



}
