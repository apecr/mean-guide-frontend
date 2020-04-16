import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription
  constructor(public postsService: PostsService) {}

  ngOnDestroy(): void {
    this.postsSub.unsubscribe()
  }
  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostsUpdatedListener().subscribe((posts: Post[]) => {
      this.posts = posts
    });
  }

  onDelete(id: string){
    this.postsService.deletePost(id)
  }
}
