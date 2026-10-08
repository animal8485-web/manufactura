import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export { site, pages, businessSchema } from './data/site';

export function render(path: string) {
  return renderToString(<StrictMode><App path={path} /></StrictMode>);
}
