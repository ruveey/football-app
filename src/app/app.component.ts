import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerFormationComponent } from '../features/player-formation/ui/player-formation/player-formation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlayerFormationComponent],
  template: `
    <div class="app-container">
      <main class="app-main">
        <app-player-formation></app-player-formation>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background-color: #f5f5f5;
    }

    .app-header {
      background-color: #2E7D32;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .app-main {
      flex: 1;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .app-footer {
      background-color: #1B5E20;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  `]
})
export class AppComponent {
}
