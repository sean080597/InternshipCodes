import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  constructor() { }

  genStartElNumber(currentPage: number, itemsPerPage: number) {
    return 1 + (itemsPerPage * (currentPage - 1))
  }

  genEndElNumber(currentPage: number, itemsPerPage: number, availableElements: number) {
    return currentPage * itemsPerPage < availableElements ? itemsPerPage * currentPage : availableElements
  }
}
