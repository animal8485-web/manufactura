import { useHydrated } from '../hooks/useHydrated';
import { EventsAnnouncement } from '../components/EventsAnnouncement';
import { Contacts } from '../components/Contacts';
import{useEffect,useState}from'react';
import{BookingModal,DishCard,GalleryGrid,SectionHeader}from'../components';
import { featuredDishes } from '../data/menu';
import { gallery } from '../data/gallery';
import { PhotoRail } from '../components/PhotoRail';
import facade from'../assets/brand/facade.svg';
import emblem from'../assets/brand/emblem.svg';
import heroHeading from'../assets/brand/hero-heading.svg';



export function HomePage(){const hydrated=useHydrated();const[isBookingOpen,setBookingOpen]=useState(()=>typeof window!=='undefined'&&window.location.hash==='#booking');
useEffect(()=>{const openBooking=()=>{if(window.location.hash==='#booking')setBookingOpen(true)};window.addEventListener('hashchange',openBooking);return()=>window.removeEventListener('hashchange',openBooking)},[]);
function closeBooking(){setBookingOpen(false);if(window.location.hash==='#booking')window.history.replaceState(null,'',window.location.pathname+window.location.search)}
return <div className="home-page"><section className="hero-section" aria-labelledby="hero-title"><div className="hero-card"><h1 id="hero-title" className="hero-brand"><span className="sr-only">Мануфактура — бар и кухня в Барнауле. ВС–ЧТ 17:00–02:00. ПТ–СБ 17:00–05:00.</span><img src={heroHeading} alt="" width="344" height="104"/></h1><div className="facade-slot"><img src={facade} alt="Исторический фасад Мануфактуры" width="343" height="234"/></div><button className="hero-cta" type="button" onClick={()=>setBookingOpen(true)}>ЗАБРОНИРОВАТЬ СТОЛ</button></div></section><section className="home-section menu-section"><SectionHeader title="Бар и кухня" actionHref="/menu"/><PhotoRail className="horizontal-scroll card-row" label="Блюда Мануфактуры">{featuredDishes.map(dish=><DishCard key={dish.id} dish={dish}/>)}</PhotoRail></section><section className="home-section events-section"><SectionHeader title="Афиша"/><EventsAnnouncement /></section><section className="home-section about-section" aria-labelledby="about-title"><img className="about-emblem" src={emblem} alt=""/><h2 id="about-title">Дом 36 на улице Льва Толстого построен в 1873 году как магазин «Мануфактурные товары» купца Андрея Морозова</h2><p className="about-copy">Круг в айдентике продолжает фирменный знак Морозова — у этого места он появился больше 150 лет назад</p></section><section className="home-section gallery-section"><SectionHeader title="Галерея" actionHref="/gallery"/><GalleryGrid items={gallery} horizontal/></section><Contacts className="home-section"/><div id="booking"><BookingModal isOpen={hydrated&&isBookingOpen} onClose={closeBooking}/></div></div>}
