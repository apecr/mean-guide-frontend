import { Post } from './post.model';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient){}

  getPosts(){
    this.http.get<{message: string, posts: any}>
    ('http://localhost:3000/api/posts')
    .pipe(map(postData => {
      return postData.posts.map(post => ({
        id: post._id,
        title: post.title,
        content: post.content
      }))
    }))
    .subscribe((pipedPosts) => {
      this.posts = pipedPosts
      console.log(this.posts)
      this.postsUpdated.next([...this.posts])
    })
  }

  getPostsUpdatedListener(){
    return this.postsUpdated.asObservable()
  }

  addPost(title: string, content: string){
    const post: Post = {id: undefined, title, content}
    this.http.post<{message: string, post: any}>('http://localhost:3000/api/posts', post)
    .subscribe(response => {
      console.log('Created post info: Message')
      console.log(response.message)
      console.log('Created post info: Post')
      console.log(response.post)
      post.id = response.post._id
      this.posts.push(post)
      console.log(this.posts)
      this.postsUpdated.next([...this.posts])
    })
  }

  deletePost(postId: string){
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
    .subscribe(() => {
      console.log('Deleted')
      this.posts = this.posts.filter(post => post.id !== postId)
      this.postsUpdated.next([...this.posts])
    })
  }
}
