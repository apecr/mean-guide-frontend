import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {}

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostsUpdatedListener()
      .subscribe((postData: { posts: Post[], count: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.count
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(_ => {
      this.currentPage = 1
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    });
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }
}
