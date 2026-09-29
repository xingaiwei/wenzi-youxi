import './styles/main.css';
import { installInkDefs } from '@/art/registry';
import { App } from '@/ui/App';

installInkDefs();
new App(document.getElementById('app')!).start();
