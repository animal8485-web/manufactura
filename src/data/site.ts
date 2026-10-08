export const site = {
  origin: 'https://manufakturabar.ru',
  name: 'Мануфактура',
  phone: '+7-996-501-87-57',
  image: '/og-image.png',
};

export const pages = [
  { path: '/', title: 'Мануфактура — бар и кухня в Барнауле', description: 'Бар «Мануфактура» в Барнауле, улица Льва Толстого, 36. Меню кухни и коктейлей, афиша событий и фотографии. Бронирование столов: +7 (996) 501-87-57.', index: true },
  { path: '/menu', title: 'Меню бара и кухни — Мануфактура, Барнаул', description: 'Меню бара «Мануфактура» в Барнауле: закуски, горячие блюда и коктейли с фотографиями и ценами. Ждём вас на улице Льва Толстого, 36.', index: true },
  { path: '/events', title: 'Афиша — Мануфактура, Барнаул', description: 'Афиша бара «Мануфактура» в Барнауле: события, даты и время начала. Адрес: улица Льва Толстого, 36. Бронирование: +7 (996) 501-87-57.', index: true },
  // Keep the separate gallery out of search until its placeholder is populated.
  { path: '/gallery', title: 'Галерея — Мануфактура, Барнаул', description: 'Галерея бара «Мануфактура» в Барнауле. Фотографии заведения доступны на главной странице сайта.', index: false },
  { path: '/booking', title: 'Бронирование стола — Мануфактура, Барнаул', description: 'Забронировать стол в баре «Мануфактура»: +7 (996) 501-87-57. Барнаул, улица Льва Толстого, 36.', index: true },
  { path: '/404', title: 'Страница не найдена — Мануфактура', description: 'Перейдите на главную страницу бара «Мануфактура».', index: false },
];

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BarOrPub',
  '@id': `${site.origin}/#business`,
  name: site.name,
  url: `${site.origin}/`,
  image: `${site.origin}${site.image}`,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'улица Льва Толстого, 36',
    addressLocality: 'Барнаул',
    addressRegion: 'Алтайский край',
    addressCountry: 'RU',
  },
  hasMenu: `${site.origin}/menu`,
  hasMap: 'https://2gis.ru/barnaul/geo/70000001115000756',
  sameAs: ['https://t.me/manufactura_bar', 'https://www.instagram.com/manufacturabar/'],
};
