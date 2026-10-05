import { Footer, Header } from './components';
import { EventsPage, GalleryPage, HomePage, MenuPage } from './pages';

function getPage() {
  switch (window.location.pathname) {
    case '/menu':
      return <MenuPage />;
    case '/events':
      return <EventsPage />;
    case '/gallery':
      return <GalleryPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-container">{getPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
