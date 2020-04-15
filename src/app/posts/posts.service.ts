import { Post } from './post.model';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient){}

  getPosts(){
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe((postData) => {
      this.posts = postData.posts
      this.postsUpdated.next([...this.posts])
    })
    // return [...this.posts]
  }

  getPostsUpdatedListener(){
    return this.postsUpdated.asObservable()
  }

  addPost(title: string, content: string){
    this.posts.push({id: undefined, title, content})
    this.postsUpdated.next([...this.posts])
  }
}
