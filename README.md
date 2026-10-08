# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Публикация и домен

Сайт опубликован 7 октября 2026 года в Cloudflare Pages.

- Проект: `manufakturabar`, production-ветка: `main`, загружается каталог `dist`.
- Основной технический адрес: https://manufakturabar.pages.dev/
- Первая публикация: https://a402b835.manufakturabar.pages.dev/
- Пользовательский домен: `manufakturabar.ru`, куплен на REG.RU.
- Домен добавлен в Cloudflare 7 октября 2026 года на Free. Zone ID: f6fc815ff623da5e3ed60d2eb84722a9. Пользователь сообщил о смене NS в REG.RU на ashley.ns.cloudflare.com и frank.ns.cloudflare.com. Последняя проверка: публичный DNS ещё возвращает ns1.hosting.reg.ru / ns2.hosting.reg.ru, Cloudflare pending. Запущена повторная проверка активации; ожидается обновление делегирования.
- В Cloudflare Pages добавлены manufakturabar.ru и www.manufakturabar.ru; DNS CNAME обоих имён указывает на manufakturabar.pages.dev (proxied). После смены NS нужно проверить активацию зоны, обоих доменов Pages и HTTPS.
- Токен DNS получен из Android-буфера без вывода в чат, проверен и хранится в .qa/cloudflare-config/dns-token с правами 0600. Для REG.RU создан и добавлен пользователем клиентский RSA-сертификат (.qa/regru/client.crt; закрытый ключ .qa/regru/client.key, 0600). Проверка TLS теперь проходит; запрос с подписью RSA-SHA512 возвращает NO_AUTH, доступ к домену ещё не подтверждён. Альтернативный пароль API сохранён в игнорируемой .qa/regru/credentials.json (0600); его правильность пока не подтверждена. Проверка с паролем, сертификатом и подписью возвращает ACCESS_DENIED_FROM_IP; требуется добавить текущий IP 89.185.80.63 в разрешённые адреса API REG.RU. NS в REG.RU пока не менялись; публичный DNS возвращает NXDOMAIN.
- Авторизация Wrangler подтверждена. Локальные данные доступа находятся внутри игнорируемой `.qa/cloudflare-config`; не публиковать и не коммитить.
- Перед публикацией прошли `npm run build`, `npm run lint`; в браузере проверены открытие модального бронирования, Escape, возврат фокуса и прокрутки. Опубликованная главная страница открывается в браузере.
- Форма бронирования пока не отправляет заявки: при отправке сообщает об этом и предлагает позвонить. MAX пока без ссылки.

Для следующих публикаций: собрать сайт (`npm run build`), затем выполнить из корня проекта:

```bash
XDG_CONFIG_HOME="$PWD/.qa/cloudflare-config" WRANGLER_SEND_METRICS=false npm exec --cache .qa/npm-cache --yes --package node@22 --package wrangler -- wrangler pages deploy dist --project-name manufakturabar --branch main --commit-dirty=true
```

Проект Pages уже создан. Повторно создавать его или использовать `--force` не нужно.


## Правки аудита — 7 октября 2026

Актуальный основной адрес: https://manufakturabar.ru/. Он отвечает по HTTPS; записи выше о pending DNS относятся к более раннему этапу подключения домена.

Сборка `npm run build` теперь выполняет предварительный рендеринг страниц в HTML. Обязателен полный npm-скрипт: отдельно `vite build` не создаёт итоговые метаданные и CSP-хеш. Данные заведения и метаданные находятся в `src/data/site.ts`, генератор — в `scripts/prerender.mjs`, шаблон заголовков — в `public/_headers`. В Cloudflare загружается только `dist`, каталог `dist-ssr` содержит промежуточную сборку и не публикуется.

Добавлены description, canonical, Open Graph/Twitter, картинка 1200×630, JSON-LD BarOrPub, robots.txt и sitemap.xml. H1 и основной контент доступны без JavaScript. Страница бронирования содержит статический телефон, а актуальные даты формы вычисляются в браузере. Технические домены Pages и незаполненная отдельная галерея исключены из индексации. Неизвестные адреса получают 404.

CSP ограничивает ресурсы собственным доменом и уже используемой аналитикой Cloudflare; JSON-LD разрешён по вычисляемому SHA-256. Установлены HSTS (без includeSubDomains/preload), X-Frame-Options DENY, Permissions-Policy, nosniff и Referrer-Policy. Открытый CORS удалён у новых ответов Pages. Ранее закэшированные статические файлы на пользовательском домене могут временно сохранять прежние заголовки CDN; проверка HTML выполнена отдельно.

Проверены сборка, lint, HTML всех пяти страниц, пути ресурсов, CSP-хеш, мобильный и настольный интерфейс, категории меню, открытие/закрытие бронирования, Escape, возврат фокуса и существующее уведомление о недоступной онлайн-отправке. В опубликованной главной все 22 изображения загрузились.

Остаются уточнения владельца: точные часы по дням недели (в исходном макете ВС–ПН и ПТ–СБ, без вторника–четверга) и использование почты @manufakturabar.ru. График не добавлен в JSON-LD до подтверждения; SPF/DMARC/DKIM не менялись. Повторный внешний аудит следует запускать на основном домене, а не pages.dev.


## Живая проверка ReMarked — 7 октября 2026

Локальная интеграция: `src/integrations/remarked.ts`, точка 599599, форма `src/components/BookingForm.tsx`. Production пока содержит старую форму без отправки. Новую сборку не публиковали.

Блокирующий результат: одинаковый `GetToken` с `additional_info: true` получает токен и capacity 1–8 для Origin/Referer `https://remarked.ru`, но возвращает `status: error`, `message: Unknown error` для `https://manufakturabar.ru`. Это указывает на ограничение разрешённых доменов ReMarked; нужно проверить настройки приложения/виджета и разрешить домен сайта. Не подменять Origin/Referer в рабочей интеграции.

`npm run lint` и полная сборка проходят. Все 10 тестов бронирования проходят на Node 22 (`npm exec --cache .qa/npm-cache --yes --package node@22 -- node --experimental-strip-types --test tests/remarked.test.ts`); системный Node не поддерживает `--experimental-strip-types`. Живую заявку не создавали.

Далее: разрешить домен в ReMarked → проверить GetToken/GetSlots с домена сайта → опубликовать сборку вместе с CSP из `public/_headers` → создать одну контрольную бронь с предоставленными пользователем данными и подтвердить её появление в CRM.

## Согласованные правки — 8 октября 2026

Опубликованы на https://manufakturabar.ru/; deployment https://56396412.manufakturabar.pages.dev (production/main).

- В шапке — точный 32×32 знак, извлечённый из предоставленного пользователем SVG `a_1440 (1).svg`; историческая эмблема в блоке о заведении остаётся отдельным элементом.
- Настольный первый экран вместе с шапкой заполняет высоту окна; фасад масштабируется с сохранением пропорций, кнопка бронирования видна.
- Добавлена маска телефона с префиксом +7, форматированием, вставкой 8/+7/10 цифр и проверкой полного номера.
- В карточках убран видимый знак рубля, добавлены количества. По прямому согласованию пользователя текущие числа пока сохранены: еда — г, напитки — мл. Актуальные названия и табы сохранены. Существующие числовые цены главной и полного меню не выравнивались между собой.
- Галерея заполнена шестью существующими фотографиями (3 колонки на компьютере, 2 на телефоне), добавлены контакты и индексируемая страница в sitemap.
- Настольная афиша соответствует структуре референса: постер слева, дата/время/день справа. Существующие даты и время сохранены; мобильная компоновка сохранена.

Проверки: полная сборка и lint; 10 тестов интеграции; реальный браузер локально и после публикации (1440/1366/375/320 для главной, 1440/375 для меню, афиши и галереи). Проверены табы, фотографии, отсутствие горизонтального переполнения, модальное бронирование/Escape/возврат фокуса, набор/вставка/редактирование/валидация телефона. Отправка, отказы API, неопределённый результат и повтор без дублей проверены на локальной имитации API. Снимки и скрипты находятся в игнорируемой `.qa/batch-review` и `.qa/*check.py`.

Статус ReMarked обновлён: при проверке 8 октября UTC / 9 октября по Барнаулу GetToken и GetSlots с доменом manufakturabar.ru успешно ответили. После публикации непосредственно в браузере основного домена загрузились реальные интервалы, capacity 1–8; JavaScript-ошибок нет. Ранее неопубликованная интеграция теперь вошла в production вместе с CSP. Реальная CreateReserve в этой итерации не выполнялась; сквозное подтверждение заявки в CRM требует отдельной контрольной брони с данными пользователя.


## Финальные косметические правки — 8 октября 2026

- Настольная афиша: увеличены дата, время и день недели; индикатор содержит семь закруглённых полосок с выделением фактического дня события. Мобильная компоновка и данные событий сохранены.
- Форма показывает 29 интервалов с 17:00 до 00:00 с шагом 15 минут. Полночь относится к следующей календарной дате; выбирать можно только интервалы, подтверждённые текущей доступностью ReMarked.
- Кнопка «8+» открывает отдельное окно о предварительном согласовании с кликабельным номером +7 (996) 501-87-57. Закрытие окна сохраняет заполненную форму и возвращает фокус на кнопку.
- Для названий блюд на главной и в меню подключён предоставленный TT Interphases Pro Condensed DemiBold: 14/16 px, межбуквенный интервал −3%. Начертание сверено с контурами SVG; веб-шрифт и приложенная лицензия находятся в `src/assets/fonts`.

Полная сборка (клиент, SSR, prerender), lint и `git diff --check` прошли. В реальном браузере проверены афиша на 320/375/768/1440 px, форма и окно «8+» на 320/375/1440 px, подписи блюд на мобильном и настольном экранах, меню и отсутствие горизонтального переполнения. Проверки времени, полуночи, недоступных интервалов, Escape и возврата фокуса использовали локальную имитацию API. Реальные заявки не отправлялись; модуль интеграции и настройки CRM не менялись.

Этот выпуск предназначен для существующего Cloudflare Pages `manufakturabar`, production-ветка `main`, основной домен https://manufakturabar.ru/. Публикуется только готовый `dist`; локальные данные доступа и проверки из `.qa` в GitHub и сборку не включаются.


## Исправление выбора времени — 9 октября 2026 (Барнаул)

Причина неактивных кнопок: в `GetSlots` передавалась длительность визита 10 800 секунд, поэтому ответ содержал начала только через три часа. Теперь сайт запрашивает отрезки по 900 секунд и для каждого времени проверяет непрерывную доступность одного стола или одной комбинации столов на все 180 минут. Отсутствующие, занятые и неполные интервалы не предлагаются; перед отправкой доступность повторно проверяется. Длительность в `CreateReserve` остаётся 180 минут, полночь относится к следующей календарной дате. Настройки CRM не меняются.

Убрана подпись «Время местное, Барнаул». Добавлены регрессионные проверки шага 15 минут, непрерывной доступности стола, комбинаций столов, занятых интервалов и перехода через полночь/конец года. Тесты запускаются на Node 22: `npm run test:booking`.
