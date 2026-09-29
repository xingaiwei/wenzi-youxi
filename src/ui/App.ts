import { GAME_DATA } from '@/data';
import { Game, createInitialState } from '@/engine';
import { clear } from './dom';
import { SaveStore } from './save';
import { GameScreen } from './components/GameScreen';
import { TitleScreen } from './components/TitleScreen';

/** 顶层：在标题画面与游戏画面之间切换 */
export class App {
  private unsubscribe?: () => void;

  constructor(private root: HTMLElement) {}

  start(): void {
    this.showTitle();
  }

  private showTitle(): void {
    this.unsubscribe?.();
    clear(this.root);
    const save = SaveStore.load();
    const title = new TitleScreen({
      hasSave: !!save && !!GAME_DATA.story.scenes[save.sceneId],
      onNew: (name) => this.newGame(name),
      onContinue: () => save && this.play(new Game(GAME_DATA, save)),
    });
    this.root.append(title.el);
  }

  private newGame(name: string): void {
    this.play(new Game(GAME_DATA, createInitialState(GAME_DATA, name), true));
  }

  private play(game: Game): void {
    clear(this.root);
    SaveStore.save(game.state);
    this.unsubscribe = game.subscribe((g) => SaveStore.save(g.state));
    const screen = new GameScreen(game, {
      onRestart: () => {
        SaveStore.clear();
        this.newGame(game.state.name);
      },
      onExit: () => this.showTitle(),
    });
    this.root.append(screen.el);
  }
}
