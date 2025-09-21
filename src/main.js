import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

if (import.meta.env.DEV) {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  cspMeta?.remove();
}

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
