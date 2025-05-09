import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({ providedIn: 'root' })
export class PostService {

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<any>(apiUrls.postServiceApi);
  }

  createPost(postData: any) {
    return this.http.post<any>(`${apiUrls.postServiceApi}create`, postData, { withCredentials: true });
  }

  updatePost(id: string, postData: any) {
    return this.http.put<any>(`${apiUrls.postServiceApi}/${id}`, postData, { withCredentials: true });
  }

  deletePost(id: string) {
    return this.http.delete<any>(`${apiUrls.postServiceApi}/${id}`, { withCredentials: true });
  }
}
