import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { apiUrls } from "../api.urls";

@Injectable({ providedIn: 'root' })
export class MachineService {
  constructor(private http: HttpClient) {}

  getMachines(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrls.machineServiceApi}`);
  }
}
