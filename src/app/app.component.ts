import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Title for this resource sharing platform';

  onGetStarted() {
    alert('Get started clicked!');
  }
  onLearnMore() {
    alert('Learn more clicked!');
  }  
}


