import type { Dish } from '../types/content';
import vegetables from '../assets/menu/menu-01.jpg';
import fries from '../assets/menu/menu-09.jpg';
import olives from '../assets/menu/menu-02.jpg';
import corn from '../assets/menu/menu-03.jpg';
import plate from '../assets/menu/menu-04.jpg';
import toast from '../assets/menu/menu-06.jpg';
import cocktailAmber from '../assets/menu/menu-05.jpg';
import cocktailGreen from '../assets/menu/menu-08.jpg';
import cocktailRed from '../assets/menu/menu-07.jpg';

// Names and photo assignments follow the latest MARK and confirmed spellings.
export const menuSections: { id: string; title: string; dishes: Dish[] }[] = [
  {
    id: 'snacks', title: 'Закуски', dishes: [
      { id: 'vegetables', name: 'Пряные маринованные овощи', description: '350 мл', price: '750', image: vegetables },
      { id: 'fries', name: 'Картофель фри', description: '150 мл', price: '750', image: fries },
      { id: 'olives', name: 'Оливки фри', description: '350 мл', price: '750', image: olives },
      { id: 'corn', name: 'Кукурузные ребра', description: '150 мл', price: '750', image: corn },
      { id: 'plate', name: 'Жареный баклажан Katsu Parmigiana', description: '350 мл', price: '750', image: plate },
      { id: 'toast', name: 'Тар-тар из говядины с мисо-горчицей', description: '350 мл', price: '750', image: toast },
    ],
  },
  {
    id: 'cocktails', title: 'Коктейли', dishes: [
      { id: 'cocktail-amber', name: 'Амаретти сауэр', description: '350 мл', price: '750', image: cocktailAmber },
      { id: 'cocktail-green', name: 'Капри дайкири', description: '150 мл', price: '750', image: cocktailGreen },
      { id: 'cocktail-red', name: 'Лост черри', description: '350 мл', price: '750', image: cocktailRed },
    ],
  },
];

export const menuCategories = [
  { id: 'snacks', title: 'Закуски', available: true },
  { id: 'salads', title: 'Салаты', available: false },
  { id: 'soups', title: 'Супы', available: false },
  { id: 'hot', title: 'Горячее', available: false },
  { id: 'pasta', title: 'Паста', available: false },
  { id: 'cocktails', title: 'Коктейли', available: true },
];
