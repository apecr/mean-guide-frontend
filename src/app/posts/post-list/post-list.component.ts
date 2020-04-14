import { Component } from '@angular/core';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  posts = [
    {
      title: 'First post',
      content: 'This is the first post content',
    },
    {
      title: 'Second post',
      content: 'This is the second post content',
    },
    {
      title: 'Third post',
      content: 'This is the third post content',
    },
  ];
}
