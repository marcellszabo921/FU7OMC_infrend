import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrls } from "../api.urls";

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<any>(`${apiUrls.userServiceApi}profile`, {
      withCredentials: true
    });
  }

  depositToBalance() {
    return this.http.post<any>(`${apiUrls.rentalServiceApi}deposit`, {},{
      withCredentials: true
    });
  }

  getAllUsers() {
    return this.http.get<any>(`${apiUrls.userServiceApi}all`, { withCredentials: true });
  }

  updateUser(id: string, payload: any) {
    return this.http.put<any>(`${apiUrls.userServiceApi}/${id}`, payload, { withCredentials: true });
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${apiUrls.userServiceApi}/${id}`, { withCredentials: true });
  }
}
