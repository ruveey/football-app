import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldComponent } from '../field/field.component';
import { PlayerListComponent } from '../player-list/player-list.component';
import { Player, Position, PlacedPlayer } from '../../../../entities/player/model/types';

interface FormationScheme {
  id: string;
  name: string;
  positions: Position[];
}

interface PlayerPlacementEvent {
  player: Player;
  positionId: string;
}

@Component({
  selector: 'app-player-formation',
  standalone: true,
  imports: [CommonModule, DragDropModule, FieldComponent, PlayerListComponent],
  template: `
    <div class="formation-wrapper">
      <div class="formation-header">
        <h2>Расстановка футболистов</h2>
        <div class="formation-info">
          <div class="current-scheme">{{ getCurrentFormationName() }}</div>
        </div>
        <div class="formation-actions">
          <div class="formation-schemes">
            <button
              *ngFor="let scheme of formationSchemes"
              class="scheme-button"
              [class.active]="currentSchemeId === scheme.id"
              (click)="changeFormation(scheme.id)">
              {{ scheme.name }}
            </button>
          </div>
          <button class="reset-button" (click)="resetFormation()">Сбросить</button>
        </div>
      </div>

      <div class="formation-container">
        <div class="sidebar">
          <app-player-list
            [players]="availablePlayers"
            (onDragStarted)="setFieldDraggingState(true)"
            (onDragEnded)="setFieldDraggingState(false)">
          </app-player-list>
        </div>

        <div class="main-content">
          <app-field
            [positions]="positions"
            [placedPlayers]="placedPlayers"
            (playerRemoved)="handlePlayerRemoved($event)"
            (playerPlaced)="addPlayerToPosition($event.player, $event.positionId)"
            #fieldComponent>
          </app-field>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .formation-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      gap: 20px;
    }

    .formation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;

      h2 {
        font-size: 24px;
        font-weight: 700;
        color: #333;
        margin: 0;
      }
    }

    .formation-info {
      flex-grow: 1;
      display: flex;
      justify-content: center;
    }

    .current-scheme {
      background-color: #2E7D32;
      color: white;
      font-size: 18px;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
    }

    .formation-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .formation-schemes {
      display: flex;
      gap: 8px;
    }

    .scheme-button {
      background-color: #e0e0e0;
      color: #333;
      border: none;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #bdbdbd;
      }

      &.active {
        background-color: #2196F3;
        color: white;
      }
    }

    .reset-button {
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #d32f2f;
      }
    }

    .formation-container {
      display: flex;
      gap: 24px;
      height: 100%;
    }

    .sidebar {
      width: 300px;
      min-width: 300px;
    }

    .main-content {
      flex: 1;
      min-height: 600px;
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 991px) {
      .formation-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        min-width: unset;
      }
    }

    @media (max-width: 768px) {
      .formation-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .formation-info {
        justify-content: flex-start;
      }

      .formation-actions {
        width: 100%;
        flex-wrap: wrap;
      }
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PlayerFormationComponent {
  readonly formationSchemes: FormationScheme[] = [
    {
      id: '4-4-2',
      name: '4-4-2',
      positions: [
        { id: 'gk', name: 'Вратарь', x: 50, y: 10 },
        { id: 'lb', name: 'Левый защитник', x: 20, y: 20 },
        { id: 'cb1', name: 'Центральный защитник (Л)', x: 40, y: 20 },
        { id: 'cb2', name: 'Центральный защитник (П)', x: 60, y: 20 },
        { id: 'rb', name: 'Правый защитник', x: 80, y: 20 },
        { id: 'lm', name: 'Левый полузащитник', x: 20, y: 35 },
        { id: 'cm1', name: 'Центральный полузащитник (Л)', x: 40, y: 35 },
        { id: 'cm2', name: 'Центральный полузащитник (П)', x: 60, y: 35 },
        { id: 'rm', name: 'Правый полузащитник', x: 80, y: 35 },
        { id: 'st1', name: 'Нападающий (Л)', x: 35, y: 45 },
        { id: 'st2', name: 'Нападающий (П)', x: 65, y: 45 }
      ]
    },
    {
      id: '4-3-3',
      name: '4-3-3',
      positions: [
        { id: 'gk', name: 'Вратарь', x: 50, y: 10 },
        { id: 'lb', name: 'Левый защитник', x: 20, y: 20 },
        { id: 'cb1', name: 'Центральный защитник (Л)', x: 40, y: 20 },
        { id: 'cb2', name: 'Центральный защитник (П)', x: 60, y: 20 },
        { id: 'rb', name: 'Правый защитник', x: 80, y: 20 },
        { id: 'cdm', name: 'Опорный полузащитник', x: 50, y: 30 },
        { id: 'cm1', name: 'Центральный полузащитник (Л)', x: 35, y: 35 },
        { id: 'cm2', name: 'Центральный полузащитник (П)', x: 65, y: 35 },
        { id: 'lw', name: 'Левый нападающий', x: 20, y: 45 },
        { id: 'st', name: 'Центральный нападающий', x: 50, y: 45 },
        { id: 'rw', name: 'Правый нападающий', x: 80, y: 45 }
      ]
    },
    {
      id: '3-5-2',
      name: '3-5-2',
      positions: [
        { id: 'gk', name: 'Вратарь', x: 50, y: 10 },
        { id: 'cb1', name: 'Центральный защитник (Л)', x: 30, y: 20 },
        { id: 'cb2', name: 'Центральный защитник (Ц)', x: 50, y: 18 },
        { id: 'cb3', name: 'Центральный защитник (П)', x: 70, y: 20 },
        { id: 'lwb', name: 'Левый латераль', x: 15, y: 30 },
        { id: 'cm1', name: 'Центральный полузащитник (Л)', x: 35, y: 30 },
        { id: 'cdm', name: 'Опорный полузащитник', x: 50, y: 30 },
        { id: 'cm2', name: 'Центральный полузащитник (П)', x: 65, y: 30 },
        { id: 'rwb', name: 'Правый латераль', x: 85, y: 30 },
        { id: 'st1', name: 'Нападающий (Л)', x: 35, y: 45 },
        { id: 'st2', name: 'Нападающий (П)', x: 65, y: 45 }
      ]
    }
  ];

  readonly allPlayers: Player[] = [
    { id: '1', firstName: 'Игорь', lastName: 'Акинфеев', number: 1 },
    { id: '2', firstName: 'Сергей', lastName: 'Игнашевич', number: 4 },
    { id: '3', firstName: 'Юрий', lastName: 'Жирков', number: 18 },
    { id: '4', firstName: 'Александр', lastName: 'Головин', number: 17 },
    { id: '5', firstName: 'Артём', lastName: 'Дзюба', number: 22 },
    { id: '6', firstName: 'Денис', lastName: 'Черышев', number: 6 },
    { id: '7', firstName: 'Марио', lastName: 'Фернандес', number: 2 },
    { id: '8', firstName: 'Фёдор', lastName: 'Кудряшов', number: 13 },
    { id: '9', firstName: 'Роман', lastName: 'Зобнин', number: 11 },
    { id: '10', firstName: 'Илья', lastName: 'Кутепов', number: 3 },
    { id: '11', firstName: 'Алан', lastName: 'Дзагоев', number: 10 }
  ];

  currentSchemeId = '4-4-2';
  positions: Position[] = [];
  placedPlayers: PlacedPlayer[] = [];
  availablePlayers: Player[] = [];

  @ViewChild('fieldComponent') fieldComponent!: FieldComponent;

  constructor() {
    this.positions = this.getCurrentScheme().positions;
    this.availablePlayers = [...this.allPlayers];
  }

  private getCurrentScheme(): FormationScheme {
    return this.formationSchemes.find(scheme => scheme.id === this.currentSchemeId)!;
  }

  getCurrentFormationName(): string {
    return this.getCurrentScheme().name;
  }

  changeFormation(schemeId: string): void {
    if (this.currentSchemeId === schemeId) return;

    // Сохраняем текущих игроков
    const currentPlayers = [...this.placedPlayers];

    // Меняем схему
    this.currentSchemeId = schemeId;
    this.positions = this.getCurrentScheme().positions;

    // Очищаем текущие расстановки
    this.placedPlayers = [];
    this.availablePlayers = [...this.allPlayers];

    // Возвращаем игроков на позиции, которые существуют в новой схеме
    currentPlayers.forEach(({positionId, player}) => {
      if (this.positions.some(pos => pos.id === positionId)) {
        this.addPlayerToPosition(player, positionId);
      }
    });

    if (this.fieldComponent) {
      this.fieldComponent.isDragging = false;
    }
  }

  resetFormation(): void {
    this.placedPlayers = [];
    this.availablePlayers = [...this.allPlayers];
  }

  handlePlayerRemoved(positionId: string): void {
    const removedPlayer = this.placedPlayers.find(p => p.positionId === positionId)?.player;
    if (removedPlayer) {
      this.availablePlayers = [...this.availablePlayers, removedPlayer];
      this.placedPlayers = this.placedPlayers.filter(p => p.positionId !== positionId);
    }
  }

  addPlayerToPosition(player: Player, positionId: string): void {
    if (positionId === 'return-to-list') {
      this.availablePlayers = [...this.availablePlayers, player];
      return;
    }

    this.availablePlayers = this.availablePlayers.filter(p => p.id !== player.id);
    this.placedPlayers = [
      ...this.placedPlayers.filter(p => p.positionId !== positionId && p.player.id !== player.id),
      { positionId, player }
    ];
  }

  setFieldDraggingState(isDragging: boolean): void {
    if (this.fieldComponent) {
      this.fieldComponent.isDragging = isDragging;
    }
  }
}
