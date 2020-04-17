import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => ({
            id: post._id,
            ...post,
          }));
        })
      )
      .subscribe((pipedPosts) => {
        this.posts = pipedPosts;
        console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const post: Post = { id: undefined, title, content, imagePath: null };
    const postData = createPostFromForm(title, content, image);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {
        post.id = response.post.id;
        post.imagePath = response.post.imagePath;
        this.posts.push(post);
        console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      const { title, content } = post;
      postData = createPostFromForm(title, content, image);
      postData.append('id', post.id)
    } else {
      postData = {
        ...post,
        imagePath: image,
      };
    }
    this.http
      .put<{ message: string; post: Post }>(
        `http://localhost:3000/api/posts/${post.id}`,
        postData
      )
      .subscribe((response) => {
        this.posts = this.posts.map((p) => {
          if (p.id === post.id) {
            return {
              ...post,
              imagePath: response.post.imagePath,
            };
          }
          return p;
        });
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        console.log('Deleted');
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
const createPostFromForm = (title: string, content: string, image: File) => {
  const postData = new FormData();
  postData.append('title', title);
  postData.append('content', content);
  postData.append('image', image, title);
  return postData;
};
