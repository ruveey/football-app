import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Player } from '../../../../entities/player/model/types';

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface PlacedPlayer {
  positionId: string;
  player: Player;
}

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="field-container">
      <div class="football-field" [class.dragging-active]="isDragging">
        <div class="field-markup">
          <div class="field-center-circle"></div>
          <div class="field-center-line"></div>
          <div class="penalty-area top"></div>
          <div class="penalty-area bottom"></div>
          <div class="goal-area top"></div>
          <div class="goal-area bottom"></div>
          <div class="corner" *ngFor="let pos of ['top-left', 'top-right', 'bottom-left', 'bottom-right']" [class]="pos"></div>
        </div>

        <div *ngFor="let position of positions"
             class="position-marker"
             [id]="'position-' + position.id"
             cdkDropList
             [cdkDropListData]="position"
             (cdkDropListDropped)="dropPlayer($event)"
             [style.left.%]="position.x"
             [style.top.%]="position.y"
             [cdkDropListConnectedTo]="dropListIds">

          <ng-container *ngIf="getPlayerAtPosition(position.id) as player; else emptyPosition">
            <div class="player-marker"
                 cdkDrag
                 [cdkDragData]="player"
                 (cdkDragStarted)="isDragging = true"
                 (cdkDragEnded)="isDragging = false">

              <div class="player-icon">
                <div class="player-photo">
                  <span class="player-initials">{{ getPlayerInitials(player) }}</span>
                </div>
                <span class="player-number">{{ player.number }}</span>
              </div>

              <div class="player-name">{{ player.lastName }}</div>

              <button class="remove-button"
                      (click)="removePlayer(position.id)"
                      title="Удалить игрока">✕</button>
            </div>
          </ng-container>

          <ng-template #emptyPosition>
            <div class="empty-position">
              <span class="position-name">{{ position.name }}</span>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .field-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }

    .football-field {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      background-color: #4CAF50;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 3px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
    }

    .field-markup {
      position: absolute;
      inset: 0;
    }

    .field-center-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16%;
      height: 16%;
      border: 2px solid rgba(255, 255, 255, 0.7);
      border-radius: 50%;
    }

    .field-center-line {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.7);
      transform: translateY(-50%);
    }

    .penalty-area {
      position: absolute;
      width: 44%;
      height: 20%;
      border: 2px solid rgba(255, 255, 255, 0.7);
      left: 28%;

      &.top {
        top: 0;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top: none;
        height: 15%;
      }

      &.bottom {
        bottom: 0;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: none;
      }
    }

    .goal-area {
      position: absolute;
      width: 22%;
      height: 8%;
      border: 2px solid rgba(255, 255, 255, 0.7);
      left: 39%;

      &.top {
        top: 0;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top: none;
        height: 5%;
      }

      &.bottom {
        bottom: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: none;
      }
    }

    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.7);

      &.top-left {
        top: 0;
        left: 0;
        border-top: none;
        border-left: none;
        border-bottom-right-radius: 100%;
      }

      &.top-right {
        top: 0;
        right: 0;
        border-top: none;
        border-right: none;
        border-bottom-left-radius: 100%;
      }

      &.bottom-left {
        bottom: 0;
        left: 0;
        border-bottom: none;
        border-left: none;
        border-top-right-radius: 100%;
      }

      &.bottom-right {
        bottom: 0;
        right: 0;
        border-bottom: none;
        border-right: none;
        border-top-left-radius: 100%;
      }
    }

    .position-marker {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 90px;
      height: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .empty-position {
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.3);
      border: 3px dashed rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.9);
        transform: scale(1.1);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      }
    }

    .position-name {
      position: absolute;
      bottom: -25px;
      white-space: nowrap;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      opacity: 0.9;
      z-index: 5;
      pointer-events: none;
    }

    .player-marker {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .player-icon {
      position: relative;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      z-index: 2;
    }

    .player-photo {
      width: 100%;
      height: 100%;
      background-color: #4CAF50;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      border-radius: 50%;
    }

    .player-initials {
      font-size: 24px;
      text-transform: uppercase;
    }

    .player-number {
      position: absolute;
      bottom: -8px;
      right: -8px;
      background-color: #e91e63;
      color: white;
      width: 24px;
      height: 24px;
      font-size: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      border: 2px solid white;
    }

    .player-name {
      margin-top: 6px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 13px;
      padding: 4px 8px;
      border-radius: 4px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }

    .remove-button {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #f44336;
      color: white;
      border: none;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 3;

      .player-marker:hover & {
        opacity: 1;
      }
    }

    :host ::ng-deep {
      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        background-color: white;
      }

      .cdk-drop-list-dragging .empty-position {
        background-color: rgba(255, 255, 255, 0.4);
        border: 2px solid rgba(255, 255, 255, 0.9);
      }

      .cdk-drop-list-receiving {
        .empty-position {
          background-color: rgba(76, 175, 80, 0.3);
          border: 2px solid rgba(76, 175, 80, 0.7);
          transform: scale(1.1);
        }

        .player-marker {
          opacity: 0.7;
          transform: scale(1.05);
        }
      }

      .cdk-drag-placeholder {
        opacity: 0.3;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    }

    .football-field.dragging-active .empty-position {
      background-color: rgba(255, 255, 255, 0.4);
      border: 3px dashed rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
      animation: pulse-position 1.5s infinite;
      transform: scale(1.1);
    }

    @keyframes pulse-position {
      0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.4); }
      50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
      100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.4); }
    }
  `]
})
export class FieldComponent {
  @Input() positions: Position[] = [];
  @Input() placedPlayers: PlacedPlayer[] = [];
  @Output() playerRemoved = new EventEmitter<string>();
  @Output() playerPlaced = new EventEmitter<{player: Player; positionId: string}>();

  isDragging = false;
  dropListIds = ['player-list'];

  @HostListener('document:dragstart', ['$event'])
  onDocumentDragStart(event: DragEvent): void {
    if ((event.target as HTMLElement).closest('#player-list')) {
      this.isDragging = true;
    }
  }

  @HostListener('document:dragend')
  onDocumentDragEnd(): void {
    this.isDragging = false;
  }

  getPlayerAtPosition(positionId: string): Player | undefined {
    return this.placedPlayers.find(p => p.positionId === positionId)?.player;
  }

  dropPlayer(event: CdkDragDrop<Position>): void {
    const targetPositionId = event.container.data.id;
    const player = event.previousContainer.id === 'player-list'
      ? event.item.data as Player
      : this.getPlayerAtPosition(event.previousContainer.data.id);

    if (!player) return;

    if (event.previousContainer.id === 'player-list') {
      const existingPosition = this.placedPlayers.find(p => p.player.id === player.id);
      if (existingPosition) {
        this.playerRemoved.emit(existingPosition.positionId);
      }
    } else {
      const sourcePositionId = event.previousContainer.data.id;
      if (sourcePositionId === targetPositionId) return;
      this.playerRemoved.emit(sourcePositionId);
    }

    const existingPlayer = this.getPlayerAtPosition(targetPositionId);
    if (existingPlayer) {
      this.playerRemoved.emit(targetPositionId);
      this.playerPlaced.emit({
        player: existingPlayer,
        positionId: event.previousContainer.id === 'player-list' ? 'return-to-list' : event.previousContainer.data.id
      });
    }

    this.playerPlaced.emit({ player, positionId: targetPositionId });
  }

  removePlayer(positionId: string): void {
    this.playerRemoved.emit(positionId);
  }

  getPlayerInitials(player: Player): string {
    return `${player.firstName[0]}${player.lastName[0]}`;
  }

  ngOnInit(): void {
    this.dropListIds = ['player-list', ...this.positions.map(pos => `position-${pos.id}`)];
  }
}
