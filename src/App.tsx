import { Footer, Header } from './components';
import { EventsPage, GalleryPage, HomePage, LoyaltyPage, MenuPage } from './pages';
import { BookingPage } from './pages/BookingPage';

function App({ path }: { path: string }) {
  const isBooking = path === '/booking';
  const isInterior = ['/menu', '/events', '/gallery', '/loyalty'].includes(path);
  const page = path === '/menu' ? <MenuPage /> : path === '/events' ? <EventsPage /> : path === '/gallery' ? <GalleryPage /> : path === '/loyalty' ? <LoyaltyPage /> : isBooking ? <BookingPage /> : path === '/' ? <HomePage /> : <section className="home-section"><h1>Страница не найдена</h1><p><a href="/">Вернуться на главную</a></p></section>;
  return <div className={`app-shell${isInterior ? ' app-shell--interior' : ''}${isBooking ? ' app-shell--booking' : ''}`}>
    {!isBooking && <Header path={path} />}
    <main className="page-container">{page}</main>
    {!isBooking && <Footer />}
  </div>;
}
export default App;
