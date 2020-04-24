import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userAuthenticated: boolean = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostsUpdatedListener()
      .subscribe((postData: { posts: Post[]; count: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.count;
      });
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getUserId();
        this.userAuthenticated = isAuthenticated;
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe((_) => {
      this.currentPage = 1;
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }
}
