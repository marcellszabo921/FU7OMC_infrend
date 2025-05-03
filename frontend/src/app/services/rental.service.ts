import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({ providedIn: 'root' })
export class RentalService {
    constructor(private http: HttpClient) { }

    createRental(rentalData: { machineId: string, startDate: string }): Observable<any> {
        return this.http.post<any>(`${apiUrls.rentalServiceApi}createrent`, rentalData, { withCredentials: true });
    }

    closeRental(payload: { id: string, endDate: string, returnedInGoodCondition: boolean }) {
        return this.http.post<any>(`${apiUrls.rentalServiceApi}closerent`, payload, { withCredentials: true });
      }

    getUserRentals() {
        return this.http.get<any>(`${apiUrls.rentalServiceApi}getuserrent`, { withCredentials: true });
    }

    getUserTransactions() {
        return this.http.get<any>(`${apiUrls.rentalServiceApi}transactions`, { withCredentials: true });
    }
}
