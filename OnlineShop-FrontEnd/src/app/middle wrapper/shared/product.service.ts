import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AppSettings } from '../../app.settings';

import { Product } from './product';
import { ProductDTO } from './product-dto';

@Injectable()
export class ProductService {

  constructor(private httpService: Http) { }

  getProductsIdsBy(params: { target: string, category: string, type: string }): Observable<number[]>;

  getProductsIdsBy(param: { searchParameter: string }): Observable<number[]>;

  getProductsIdsBy(arg: Object): Observable<number[]> {
    // Jquery
    let queryString = $.param(arg);

    let url = AppSettings.API_ENDPOINT + '/api/product/ids/?' + queryString;
    return this.httpService.get(url)
      .map(this.extractDatas)
      .catch(this.handleError);
  }


  getProductBy(id: number): Observable<Product> {
    let url = AppSettings.API_ENDPOINT + '/api/product/' + id.toString();
    return this.httpService.get(url)
      .map(this.extractProduct)
      .catch(this.handleError);
  }

  getProductsBy(ids: number[]): Observable<Product[]> {
    let url = AppSettings.API_ENDPOINT + '/api/product/?ids=' + ids.toString();
    return this.httpService.get(url)
      .map(this.extractProducts)
      .catch(this.handleError);
  }

  getNewProducts(): Observable<Product[]> {
    return this.httpService.get(AppSettings.API_ENDPOINT + '/api/product/new')
      .map(this.extractProducts)
      .catch(this.handleError);
  }

  getBestProducts(): Observable<Product[]> {
    return this.httpService.get(AppSettings.API_ENDPOINT + '/api/product/best')
      .map(this.extractProducts)
      .catch(this.handleError);
  }

  private extractProduct(res: Response) {
    let dto = res.json() as ProductDTO;

    // TO DO: replace it by some libary
    let p = new Product();
    p.id = dto.Id;
    p.name = dto.Name;
    p.description = dto.Description;
    p.details = dto.Details;
    p.imagesUrl = dto.ImagesUrl;
    p.price = dto.Price;
    p.category = dto.Category;
    p.target = dto.Target;
    p.type = dto.Type;
    return p || {};
  }

  private extractProducts(res: Response) {
    let dtos = res.json() as ProductDTO[];

    // TO DO: replace it by some libary
    let ps = new Array<Product>();
    for (let dto of dtos) {
      let p = new Product();
      p.id = dto.Id;
      p.name = dto.Name;
      p.description = dto.Description;
      p.details = dto.Details;
      p.imagesUrl = dto.ImagesUrl;
      p.price = dto.Price;
      p.category = dto.Category;
      p.target = dto.Target;
      p.type = dto.Type;
      ps.push(p);
    }   
    return ps || [];
  }

    private extractDatas(res: Response) {
    return res.json() || []
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private lowerJSONKeysFirstLetter(json: string): string {
    return json.replace(/"(.)[\w]+":/g, ($0: string) => {
      return $0.substr(1, 1).toLowerCase() + $0.substr(2)
    });
  }
}

/*
var json='{"ID":1234, ".oNTENT":"HELLO"}';
document.write(json.replace(/"(.)[\w]+":/g, function($0){
$0 = $0.substr(1, 1).toLowerCase()  + $0.substr(2);

return $0 }));
 
*/


/*
  public getProductBy(paramWrapper: { id: number } | { idList: number[] }): Observable<Product[]> {
      if (this.compareKeys(paramWrapper, ['id']))
        this.getProductById(paramWrapper);
      else if (this.compareKeys(paramWrapper, ['idList']))
        this.getProductByIdList(paramWrapper);
  
      let url = this.leftUrl.concat('/').concat(id.toString());
      return this.httpService.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }
  */

   /*
    private compareKeys(first: Object, keys: string[]): boolean {
      let firstKeys = Object.keys(first).sort();
      let secondKeys = keys.sort();
      return JSON.stringify(firstKeys) === JSON.stringify(keys.sort());
    }
  */