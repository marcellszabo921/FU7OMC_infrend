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

  updateMachine(id: string, data: any) {
    return this.http.put<any>(`${apiUrls.machineServiceApi}${id}`, data, { withCredentials: true });
  }
  
  deleteMachine(id: string) {
    return this.http.delete<any>(`${apiUrls.machineServiceApi}${id}`, { withCredentials: true });
  }

  createMachine(data: any) {
    return this.http.post<any>(`${apiUrls.machineServiceApi}create`, data, { withCredentials: true });
  }
}
