import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Player } from '../../../../entities/player/model/types';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="player-list-container">
      <h3 class="list-title">Список игроков</h3>

      <div class="players-list"
           cdkDropList
           id="player-list"
           [cdkDropListData]="players"
           [cdkDropListConnectedTo]="fieldPositionIds">

        <div *ngFor="let player of players"
             class="player-item"
             cdkDrag
             [cdkDragData]="player"
             (cdkDragStarted)="onDragStarted.emit()"
             (cdkDragEnded)="onDragEnded.emit()">

          <div class="player-content">
            <div class="player-avatar">
              <span class="player-initials">{{ getPlayerInitials(player) }}</span>
              <span class="player-number">{{ player.number }}</span>
            </div>
            <div class="player-details">
              <span class="player-name">{{ player.firstName }} {{ player.lastName }}</span>
            </div>
          </div>

          <div class="drag-handle" cdkDragHandle>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10,4H14V8H10V4M10,10H14V14H10V10M10,16H14V20H10V16M4,4H8V8H4V4M4,10H8V14H4V10M4,16H8V20H4V16M16,4H20V8H16V4M16,10H20V14H16V10M16,16H20V20H16V16Z" />
            </svg>
          </div>
        </div>

        <div *ngIf="players.length === 0" class="empty-list">
          Список игроков пуст
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-list-container {
      width: 100%;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      z-index: 10;
    }

    .list-title {
      padding: 16px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
    }

    .players-list {
      padding: 12px;
      max-height: 460px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #ccc #f9f9f9;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f9f9f9;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 10px;
        border: 2px solid #f9f9f9;
      }
    }

    .player-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background-color: #f9f9f9;
      border-radius: 6px;
      cursor: move;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      }
    }

    .player-content {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .player-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #4CAF50;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      border: 2px solid #388E3C;
      position: relative;
    }

    .player-initials {
      font-size: 16px;
      text-transform: uppercase;
    }

    .player-details {
      display: flex;
      flex-direction: column;
    }

    .player-number {
      position: absolute;
      bottom: -6px;
      right: -6px;
      background-color: #e91e63;
      color: white;
      width: 20px;
      height: 20px;
      font-size: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      border: 2px solid white;
      z-index: 2;
    }

    .player-name {
      font-size: 14px;
      color: #333;
    }

    .drag-handle {
      color: #aaa;
      cursor: move;

      &:hover {
        color: #666;
      }
    }

    .empty-list {
      padding: 20px;
      text-align: center;
      color: #888;
      font-style: italic;
    }

    :host ::ng-deep {
      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 6px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        background-color: white;
        padding: 12px;
        z-index: 1000 !important;
      }

      .cdk-drag-placeholder {
        opacity: 0.3;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    }

    .players-list.cdk-drop-list-dragging .player-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class PlayerListComponent {
  @Input() players: Player[] = [];
  @Output() onDragStarted = new EventEmitter<void>();
  @Output() onDragEnded = new EventEmitter<void>();

  readonly fieldPositionIds = [
    'position-gk',
    'position-lb',
    'position-cb1',
    'position-cb2',
    'position-rb',
    'position-lm',
    'position-cm1',
    'position-cm2',
    'position-rm',
    'position-st1',
    'position-st2'
  ];

  getPlayerInitials(player: Player): string {
    return `${player.firstName[0]}${player.lastName[0]}`;
  }
}
