import { useHydrated } from '../hooks/useHydrated';
import { events } from '../data/events';
import { Contacts } from '../components/Contacts';
import{useEffect,useState}from'react';
import{BookingModal,DishCard,EventCard,GalleryGrid,SectionHeader}from'../components';
import type{Dish,GalleryItem}from'../types/content';
import menu01 from'../assets/menu/menu-01.jpg';
import menu02 from'../assets/menu/menu-02.jpg';
import menu03 from'../assets/menu/menu-03.jpg';
import menu04 from'../assets/menu/menu-04.jpg';
import menu05 from'../assets/menu/menu-05.jpg';
import menu06 from'../assets/menu/menu-06.jpg';
import menu07 from'../assets/menu/menu-07.jpg';
import menu08 from'../assets/menu/menu-08.jpg';
import menu09 from'../assets/menu/menu-09.jpg';
import gallery01 from'../assets/gallery/gallery-01.jpg';
import gallery02 from'../assets/gallery/gallery-02.jpg';
import gallery03 from'../assets/gallery/gallery-03.jpg';
import gallery04 from'../assets/gallery/gallery-04.jpg';
import gallery05 from'../assets/gallery/gallery-05.jpg';
import gallery06 from'../assets/gallery/gallery-06.jpg';
import facade from'../assets/brand/facade.svg';
import emblem from'../assets/brand/emblem.svg';
import heroHeading from'../assets/brand/hero-heading.svg';
const dishes:Dish[]=[{id:'1',name:'Пряные маринованные овощи',description:'350 мл',price:'750',image:menu01},{id:'2',name:'Картофель фри',description:'150 мл',price:'750',image:menu09},{id:'3',name:'Кукурузные ребра',price:'940 ₽',image:menu03},{id:'4',name:'Жареный баклажан Katsu Parmigiana',price:'490 ₽',image:menu04},{id:'5',name:'Амаретти сауэр',price:'720 ₽',image:menu05},{id:'6',name:'Тар-тар из говядины с мисо-горчицей',price:'580 ₽',image:menu06},{id:'7',name:'Лост черри',price:'450 ₽',image:menu07},{id:'8',name:'Капри дайкири',price:'650 ₽',image:menu08},{id:'9',name:'Оливки фри',price:'790 ₽',image:menu02}];

const gallery:GalleryItem[]=[{id:'1',src:gallery04,alt:'Фасад Мануфактуры'},{id:'2',src:gallery05,alt:'Винная коллекция Мануфактуры'},{id:'3',src:gallery03,alt:'Бар Мануфактуры'},{id:'4',src:gallery01,alt:'Детали интерьера Мануфактуры'},{id:'5',src:gallery02,alt:'Атмосфера Мануфактуры'},{id:'6',src:gallery06,alt:'Зал Мануфактуры'}];

export function HomePage(){const hydrated=useHydrated();const[isBookingOpen,setBookingOpen]=useState(()=>typeof window!=='undefined'&&window.location.hash==='#booking');
useEffect(()=>{const openBooking=()=>{if(window.location.hash==='#booking')setBookingOpen(true)};window.addEventListener('hashchange',openBooking);return()=>window.removeEventListener('hashchange',openBooking)},[]);
function closeBooking(){setBookingOpen(false);if(window.location.hash==='#booking')window.history.replaceState(null,'',window.location.pathname+window.location.search)}
return <div className="home-page"><section className="hero-section" aria-labelledby="hero-title"><div className="hero-card"><h1 id="hero-title" className="hero-brand"><span className="sr-only">Мануфактура — бар и кухня в Барнауле. ВС–ПН 17:00–02:00. ПТ–СБ 17:00–05:00.</span><img src={heroHeading} alt="" width="344" height="104"/></h1><div className="facade-slot"><img src={facade} alt="Исторический фасад Мануфактуры" width="343" height="234"/></div><button className="hero-cta" type="button" onClick={()=>setBookingOpen(true)}>ЗАБРОНИРОВАТЬ СТОЛ</button></div></section><section className="home-section menu-section"><SectionHeader title="Бар и кухня" actionHref="/menu"/><div className="horizontal-scroll card-row">{dishes.map(dish=><DishCard key={dish.id} dish={dish}/>)}</div></section><section className="home-section events-section"><SectionHeader title="Афиша" actionHref="/events"/><div className="horizontal-scroll event-row">{events.map(event=><EventCard key={event.id} event={event}/>)}</div></section><section className="home-section about-section" aria-labelledby="about-title"><img className="about-emblem" src={emblem} alt=""/><h2 id="about-title">Дом 36 на улице Льва Толстого построен в 1873 году как магазин «Мануфактурные товары» купца Андрея Морозова</h2><p className="about-copy">Круг в айдентике продолжает фирменный знак Морозова — у этого места он появился больше 150 лет назад</p></section><section className="home-section gallery-section"><SectionHeader title="Галерея" actionHref="/gallery"/><GalleryGrid items={gallery}/></section><Contacts className="home-section"/><div id="booking"><BookingModal isOpen={hydrated&&isBookingOpen} onClose={closeBooking}/></div></div>}
