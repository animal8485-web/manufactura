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
