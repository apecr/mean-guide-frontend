import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = 'http://localhost:3000/api/posts'

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], count: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `pagesize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; count: number }>(
        `${BACKEND_URL}?${queryParams}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => ({
              id: post._id,
              ...post,
            })),
            count: postData.count,
          };
        })
      )
      .subscribe((pipedPostData) => {
        this.posts = pipedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], count: pipedPostData.count});
      });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${BACKEND_URL}/${postId}`);
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = createPostFromForm(title, content, image);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      const { title, content } = post;
      postData = createPostFromForm(title, content, image);
      postData.append('id', post.id);
    } else {
      postData = {
        ...post,
        imagePath: image,
      };
    }
    this.http
      .put<{ message: string; post: Post }>(
        `${BACKEND_URL}/${post.id}`,
        postData
      )
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(`${BACKEND_URL}/${postId}`);
  }
}
const createPostFromForm = (title: string, content: string, image: File) => {
  const postData = new FormData();
  postData.append('title', title);
  postData.append('content', content);
  postData.append('image', image, title);
  return postData;
};
