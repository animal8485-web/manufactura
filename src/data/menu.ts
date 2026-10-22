import type { Dish } from '../types/content';
import cocktailPhoto05 from '../assets/menu/dishes/cocktail-05.webp';
import cocktailPhoto07 from '../assets/menu/dishes/cocktail-07.webp';
import cocktailPhoto08 from '../assets/menu/dishes/cocktail-08.webp';
import photo0 from '../assets/menu/dishes/marinated-vegetables.webp';
import photo1 from '../assets/menu/dishes/fries.webp';
import photo2 from '../assets/menu/dishes/corn.webp';
import photo3 from '../assets/menu/dishes/olives.webp';
import photo4 from '../assets/menu/dishes/eggplant.webp';
import photo5 from '../assets/menu/dishes/zucchini.webp';
import photo6 from '../assets/menu/dishes/coppa.webp';
import photo7 from '../assets/menu/dishes/katsu-sando.webp';
import photo8 from '../assets/menu/dishes/roastbeef.webp';
import photo9 from '../assets/menu/dishes/shrimp-carpaccio.webp';
import photo10 from '../assets/menu/dishes/beef-tartare.webp';
import photo11 from '../assets/menu/dishes/caprese.webp';

import photo12 from '../assets/menu/dishes/green-salad.webp';
import photo13 from '../assets/menu/dishes/roastbeef-salad.webp';
import photo14 from '../assets/menu/dishes/warm-shrimp-salad.webp';
import photo15 from '../assets/menu/dishes/tomato-dashi-soup.webp';
import photo16 from '../assets/menu/dishes/pork-ramen.webp';
import photo17 from '../assets/menu/dishes/cheese-ramen.webp';
import photo18 from '../assets/menu/dishes/pork-schnitzel.webp';
import photo19 from '../assets/menu/dishes/chicken-thigh.webp';
import photo20 from '../assets/menu/dishes/shrimp-zucchini.webp';

export interface MenuSection { id: string; title: string; dishes: Dish[] }
export interface MenuGroup { id: string; title: string; sections: MenuSection[] }

// Transcribed from 10 supplied mini-app screenshots. Prices are in RUB.
// Tinctures use the regular 250 ₽ price; the screenshot's Wednesday promotion is unconfirmed.
export const menuGroups: MenuGroup[] = [
  {
    "id": "kitchen",
    "title": "Кухня",
    "sections": [
      {
        "id": "snacks",
        "title": "Закуски",
        "dishes": [
          {
            "id": "marinated-vegetables",
            "name": "Пряные маринованные овощи",
            "ingredients": "томаты, огурцы, цукини, перец",
            "portion": "180 г",
            "price": "290",
            "image": photo0
          },
          {
            "id": "fries",
            "name": "Картофель фри",
            "ingredients": "картофель, фурикакэ, лимонный майо",
            "portion": "180 г",
            "price": "300",
            "image": photo1
          },
          {
            "id": "corn",
            "name": "Кукурузные рёбра",
            "ingredients": "кукуруза, лимонный майо, мисо-горчица, дорблю",
            "portion": "190 г",
            "price": "350",
            "image": photo2
          },
          {
            "id": "olives",
            "name": "Оливки фри",
            "ingredients": "оливки, фриоли, юдзу-мёд",
            "portion": "160 г",
            "price": "390",
            "image": photo3
          },
          {
            "id": "eggplant",
            "name": "Баклажан Katsu Parmigiana",
            "ingredients": "баклажан, пармезан, томатный соус, кунжут, базилик",
            "portion": "210 г",
            "price": "450",
            "image": photo4
          },
          {
            "id": "zucchini",
            "name": "Цукини фритти",
            "ingredients": "цукини, лимонный майо, томаты, лук",
            "portion": "170 г",
            "price": "450",
            "image": photo5
          },
          {
            "id": "coppa",
            "name": "Домашняя коппа",
            "ingredients": "коппа, абрикос, мисо-горчица, дорблю",
            "portion": "110 г",
            "price": "570",
            "image": photo6
          },
          {
            "id": "katsu-sando",
            "name": "Katsu sando со свининой",
            "ingredients": "свинина, романо, огурцы, мисо-горчица",
            "portion": "220 г",
            "price": "640",
            "image": photo7
          },
          {
            "id": "romano-taco",
            "name": "Романо-тако с crispy креветкой",
            "ingredients": "романо, креветка, вафу-бонито",
            "portion": "210 г",
            "price": "700"
          },
          {
            "id": "roastbeef",
            "name": "Ростбиф",
            "ingredients": "ростбиф, бонито-тоннато, каперсы, лимон",
            "portion": "150 г",
            "price": "720",
            "image": photo8
          },
          {
            "id": "shrimp-carpaccio",
            "name": "Карпаччо из креветки",
            "ingredients": "креветка, лимон, кунжутное чили-масло",
            "portion": "110 г",
            "price": "720",
            "image": photo9
          },
          {
            "id": "beef-tartare",
            "name": "Тартар из говядины с мисо-горчицей",
            "ingredients": "говядина, огурцы, каперсы, мисо-горчица",
            "portion": "155 г",
            "price": "720",
            "image": photo10
          }
        ]
      },
      {
        "id": "salads",
        "title": "Салаты",
        "dishes": [
          {
            "id": "green-salad",
            "name": "Большой зелёный салат",
            "ingredients": "романо, айсберг, руккола, огурец, эдамаме, цукини",
            "portion": "290 г",
            "price": "480",
            "image": photo12
          },
          {
            "id": "caprese",
            "name": "Капрезе итамеши",
            "ingredients": "томаты, творожный крем, перец, абрикос, базилик",
            "portion": "220 г",
            "price": "550",
            "image": photo11
          },
          {
            "id": "roastbeef-salad",
            "name": "Салат с ростбифом",
            "ingredients": "ростбиф, томаты, листья, оливки, лимонный соус",
            "portion": "220 г",
            "price": "650",
            "image": photo13
          },
          {
            "id": "warm-shrimp-salad",
            "name": "Салат с тёплой креветкой",
            "ingredients": "креветка, листья, огурцы, томаты, вафу-майо",
            "portion": "220 г",
            "price": "690",
            "image": photo14
          }
        ]
      },
      {
        "id": "soups",
        "title": "Супы",
        "dishes": [
          {
            "id": "tomato-dashi-soup",
            "name": "Томатный суп с даси",
            "ingredients": "томаты, даси, креветочное масло, огурец, базилик, цитрус",
            "portion": "280 г",
            "price": "350",
            "image": photo15
          },
          {
            "id": "pork-ramen",
            "name": "Рамен со свининой тя-шу",
            "ingredients": "куриный бульон, лапша, свинина, яйцо, нори, шою-тара, чили",
            "portion": "600 г",
            "price": "600",
            "image": photo16
          },
          {
            "id": "cheese-ramen",
            "name": "Сырный рамен с креветкой",
            "ingredients": "куриный бульон, сыр, креветка, яйцо, нори, лук",
            "portion": "600 г",
            "price": "800",
            "image": photo17
          }
        ]
      },
      {
        "id": "hot",
        "title": "Горячее",
        "dishes": [
          {
            "id": "pork-schnitzel",
            "name": "Свиной шницель с томат-сливками",
            "ingredients": "свинина, томатно-сливочный соус, эдамаме, томаты",
            "portion": "300 г",
            "price": "700",
            "image": photo18
          },
          {
            "id": "chicken-thigh",
            "name": "Хрустящее куриное бедро",
            "ingredients": "курица, мисо-глазурь, кукуруза, кунжут, лук, фурикакэ",
            "portion": "300 г",
            "price": "800",
            "image": photo19
          },
          {
            "id": "shrimp-zucchini",
            "name": "Креветки с цукини",
            "ingredients": "креветки, цукини, чеснок, лимонно-сливочный соус, перец",
            "portion": "250 г",
            "price": "800",
            "image": photo20
          }
        ]
      },
      {
        "id": "pasta",
        "title": "Паста",
        "dishes": [
          {
            "id": "eggplant-pasta",
            "name": "Паста с баклажаном и сырным кремом",
            "ingredients": "томатный соус, баклажан, сырный крем, лук, базилик",
            "portion": "320 г",
            "price": "500"
          },
          {
            "id": "shrimp-pasta",
            "name": "Паста с креветкой и креветочным маслом",
            "ingredients": "креветка, томатно-сливочный соус, даси, чили, бонито",
            "portion": "330 г",
            "price": "700"
          },
          {
            "id": "roastbeef-pasta",
            "name": "Паста cacio e pepe с ростбифом",
            "ingredients": "сыр, перец, лимонный соус, ростбиф",
            "portion": "320 г",
            "price": "750"
          }
        ]
      },
      {
        "id": "roman-pizza",
        "title": "Римская пицца",
        "dishes": [
          {
            "id": "tomato-pizza",
            "name": "Римская пицца с томатами",
            "ingredients": "моцарелла, томаты, базилик",
            "portion": "350 г",
            "price": "600"
          },
          {
            "id": "roastbeef-pizza",
            "name": "Римская пицца с ростбифом",
            "ingredients": "моцарелла, перец, ростбиф, дорблю",
            "portion": "355 г",
            "price": "800"
          },
          {
            "id": "coppa-pizza",
            "name": "Римская пицца с коппой",
            "ingredients": "моцарелла, томаты, коппа, мизуна, базилик",
            "portion": "360 г",
            "price": "800"
          }
        ]
      },
      {
        "id": "desserts",
        "title": "Десерты",
        "dishes": [
          {
            "id": "yuzu-tiramisu",
            "name": "Юдзу-лимонный тирамису",
            "ingredients": "сливочный десерт, юдзу-лимонный гель, лимонная пудра",
            "portion": "134 г",
            "price": "450"
          },
          {
            "id": "matcha-cheesecake",
            "name": "Баскский чизкейк с матча",
            "ingredients": "чизкейк, матча, малиновый соус, малина",
            "portion": "140 г",
            "price": "500"
          }
        ]
      }
    ]
  },
  {
    "id": "cocktails",
    "title": "Коктейли",
    "sections": [
      {
        "id": "signature",
        "title": "Авторские · все по 600 ₽",
        "dishes": [
          {
            "id": "cocktails-signature-1",
            "name": "Амаретти сауэр",
            "ingredients": "виски · груша · миндаль · вино",
            "portion": "350 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-2",
            "name": "Лост черри",
            "ingredients": "бурбон · вишня · кокос · ваниль",
            "portion": "350 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-3",
            "name": "Окинавский гимлет",
            "ingredients": "джин · ананас · лайм",
            "portion": "150 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-4",
            "name": "Милано клаб",
            "ingredients": "джин · вермут · фернет · малина",
            "portion": "180 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-5",
            "name": "Юдзу маргарита",
            "ingredients": "текила · юдзу · мёд · грейпфрут",
            "portion": "180 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-6",
            "name": "Яблочный хуго",
            "ingredients": "виски · яблоко · мята",
            "portion": "380 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-7",
            "name": "Аки негрони",
            "ingredients": "джин · гранат · малина · биттер",
            "portion": "350 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-8",
            "name": "Умами президенте",
            "ingredients": "ром · абрикос · ройбуш · вермут",
            "portion": "150 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-9",
            "name": "Капри дайкири",
            "ingredients": "ром · арбуз · мята",
            "portion": "150 мл",
            "price": "600"
          },
          {
            "id": "cocktails-signature-10",
            "name": "Ширин хайбол",
            "ingredients": "джин · эвкалипт · алоэ",
            "portion": "380 мл",
            "price": "600"
          }
        ]
      },
      {
        "id": "classic",
        "title": "Классика",
        "dishes": [
          {
            "id": "cocktails-classic-1",
            "name": "Белый русский",
            "ingredients": "водка · кофейный ликёр · сливки",
            "portion": "350 мл",
            "price": "600"
          },
          {
            "id": "cocktails-classic-2",
            "name": "Эспрессо мартини",
            "ingredients": "водка · кофейный ликёр · ваниль · эспрессо",
            "portion": "180 мл",
            "price": "600"
          },
          {
            "id": "cocktails-classic-3",
            "name": "Виски сауэр",
            "ingredients": "виски · сахар · лимон · белок",
            "portion": "350 мл",
            "price": "600"
          },
          {
            "id": "cocktails-classic-4",
            "name": "Дайкири",
            "ingredients": "ром · сахар · лайм",
            "portion": "150 мл",
            "price": "600"
          },
          {
            "id": "cocktails-classic-5",
            "name": "Бэйзил смэш",
            "ingredients": "джин · сахар · лимон · базилик",
            "portion": "350 мл",
            "price": "650"
          },
          {
            "id": "cocktails-classic-6",
            "name": "Маргарита",
            "ingredients": "текила · апельсиновый ликёр · лайм",
            "portion": "180 мл",
            "price": "650"
          },
          {
            "id": "cocktails-classic-7",
            "name": "Порнстар мартини",
            "ingredients": "водка · маракуйя · ваниль · игристое вино",
            "portion": "230 мл",
            "price": "750"
          },
          {
            "id": "cocktails-classic-8",
            "name": "Негрони",
            "ingredients": "джин · кампари · сладкий вермут",
            "portion": "350 мл",
            "price": "750"
          },
          {
            "id": "cocktails-classic-9",
            "name": "Май тай",
            "ingredients": "микс ромов · апельсиновый ликёр · миндаль · цитрусы",
            "portion": "380 мл",
            "price": "750"
          },
          {
            "id": "cocktails-classic-10",
            "name": "Апероль шприц",
            "ingredients": "апероль · игристое · содовая",
            "portion": "350 мл",
            "price": "750"
          }
        ]
      }
    ]
  },
  {
    "id": "infusions",
    "title": "Настойки",
    "sections": [
      {
        "id": "sour",
        "title": "Кислые",
        "dishes": [
          {
            "id": "infusions-sour-1",
            "name": "Бузина-цитрус",
            "ingredients": "джин · цветы и ягоды бузины",
            "price": "250"
          },
          {
            "id": "infusions-sour-2",
            "name": "Гранат-персик",
            "ingredients": "водка · гранатовое вино · персик",
            "price": "250"
          },
          {
            "id": "infusions-sour-3",
            "name": "Алоэ-киви",
            "ingredients": "водка · алоэ · киви · вербена",
            "price": "250"
          },
          {
            "id": "infusions-sour-4",
            "name": "Яблоко-щавель",
            "ingredients": "водка · щавель · яблоко",
            "price": "250"
          },
          {
            "id": "infusions-sour-5",
            "name": "Фейхоа-лайм",
            "ingredients": "водка · фейхоа · кафирский лайм",
            "price": "250"
          }
        ]
      },
      {
        "id": "classic",
        "title": "Классика",
        "dishes": [
          {
            "id": "infusions-classic-1",
            "name": "Вишня",
            "ingredients": "водка · вишня · ликёр мараскино",
            "price": "250"
          },
          {
            "id": "infusions-classic-2",
            "name": "Хреновуха",
            "ingredients": "водка · хрен · чеснок · микс перцев · мёд",
            "price": "250"
          },
          {
            "id": "infusions-classic-3",
            "name": "Томатная",
            "ingredients": "водка · томаты · микс перцев · цукини",
            "price": "250"
          },
          {
            "id": "infusions-classic-4",
            "name": "Лимончелло",
            "ingredients": "водка · лимон · сахар",
            "price": "250"
          },
          {
            "id": "infusions-classic-5",
            "name": "Облепиха",
            "ingredients": "водка · облепиха · мёд",
            "price": "250"
          },
          {
            "id": "infusions-classic-6",
            "name": "Клюква",
            "ingredients": "водка · клюква · сахар",
            "price": "250"
          }
        ]
      },
      {
        "id": "sweet",
        "title": "Сладкие",
        "dishes": [
          {
            "id": "infusions-sweet-1",
            "name": "Персик-личи-конопля",
            "ingredients": "водка · личи · эссенция конопли",
            "price": "250"
          },
          {
            "id": "infusions-sweet-2",
            "name": "Клубника-гречка",
            "ingredients": "водка · гречка · клубника",
            "price": "250"
          },
          {
            "id": "infusions-sweet-3",
            "name": "Банан-куркума",
            "ingredients": "водка · банан · куркума · сливки",
            "price": "250"
          },
          {
            "id": "infusions-sweet-4",
            "name": "Малина-пломбир",
            "ingredients": "водка · пломбир · малина",
            "price": "250"
          }
        ]
      },
      {
        "id": "new-classic",
        "title": "Новая классика",
        "dishes": [
          {
            "id": "infusions-new-classic-1",
            "name": "Кассис",
            "ingredients": "водка · чёрная смородина · лайм",
            "price": "250"
          },
          {
            "id": "infusions-new-classic-2",
            "name": "Порно шот",
            "ingredients": "ванильная водка · маракуйя · виноград",
            "price": "250"
          },
          {
            "id": "infusions-new-classic-3",
            "name": "Джин на малине",
            "ingredients": "джин · вермут · малина",
            "price": "250"
          },
          {
            "id": "infusions-new-classic-4",
            "name": "Черноплодный негрони",
            "ingredients": "джин · кампари · вермут · черноплодка · дуб",
            "price": "250"
          }
        ]
      }
    ]
  },
  {
    "id": "bar",
    "title": "Бар",
    "sections": [
      {
        "id": "whisky",
        "title": "Виски",
        "dishes": [
          {
            "id": "bar-whisky-1",
            "name": "Auchentoshan Classic",
            "price": "550"
          },
          {
            "id": "bar-whisky-2",
            "name": "Mossburn Blended Malt",
            "price": "700"
          },
          {
            "id": "bar-whisky-3",
            "name": "Hatozaki Pure Malt",
            "price": "750"
          },
          {
            "id": "bar-whisky-4",
            "name": "Torabhaig Allt Gleann",
            "price": "1000"
          },
          {
            "id": "bar-whisky-5",
            "name": "Matsui The San-In",
            "price": "1000"
          },
          {
            "id": "bar-whisky-6",
            "name": "Arlett",
            "price": "1000"
          },
          {
            "id": "bar-whisky-7",
            "name": "Talisker 10 Y.O.",
            "price": "1100"
          },
          {
            "id": "bar-whisky-8",
            "name": "Hériose",
            "price": "1100"
          },
          {
            "id": "bar-whisky-9",
            "name": "Laphroaig 10 Y.O.",
            "price": "1400"
          },
          {
            "id": "bar-whisky-10",
            "name": "Macallan 12",
            "price": "1800"
          }
        ]
      },
      {
        "id": "gin",
        "title": "Джин",
        "dishes": [
          {
            "id": "bar-gin-1",
            "name": "Bombay Sapphire",
            "price": "600"
          },
          {
            "id": "bar-gin-2",
            "name": "135° East Hyogo Dry Gin",
            "price": "700"
          },
          {
            "id": "bar-gin-3",
            "name": "Malfy Originale / Rosa",
            "price": "750"
          },
          {
            "id": "bar-gin-4",
            "name": "Roku Japanese Craft",
            "price": "800"
          },
          {
            "id": "bar-gin-5",
            "name": "Mare Capri",
            "price": "1000"
          },
          {
            "id": "bar-gin-6",
            "name": "Nordés Atlantic",
            "price": "1000"
          }
        ]
      },
      {
        "id": "cognac",
        "title": "Коньяк",
        "dishes": [
          {
            "id": "bar-cognac-1",
            "name": "De Fussigny VS",
            "price": "700"
          },
          {
            "id": "bar-cognac-2",
            "name": "Camus VSOP",
            "price": "1100"
          }
        ]
      },
      {
        "id": "rum",
        "title": "Ром",
        "dishes": [
          {
            "id": "bar-rum-1",
            "name": "Barcelo Blanco",
            "price": "400"
          },
          {
            "id": "bar-rum-2",
            "name": "Barcelo Añejo",
            "price": "450"
          },
          {
            "id": "bar-rum-3",
            "name": "Matusalem",
            "price": "700"
          }
        ]
      },
      {
        "id": "vodka",
        "title": "Водка",
        "dishes": [
          {
            "id": "bar-vodka-1",
            "name": "Налибоки",
            "price": "300"
          },
          {
            "id": "bar-vodka-2",
            "name": "Чайковский",
            "price": "350"
          },
          {
            "id": "bar-vodka-3",
            "name": "Мамонт",
            "price": "450"
          }
        ]
      },
      {
        "id": "tequila",
        "title": "Текила",
        "dishes": [
          {
            "id": "bar-tequila-1",
            "name": "Buen Amigo Silver",
            "price": "400"
          },
          {
            "id": "bar-tequila-2",
            "name": "Espolon",
            "price": "600"
          },
          {
            "id": "bar-tequila-3",
            "name": "Corralejo",
            "price": "680"
          },
          {
            "id": "bar-tequila-4",
            "name": "Patrón Silver",
            "price": "1100"
          }
        ]
      },
      {
        "id": "liqueur",
        "title": "Ликёр",
        "dishes": [
          {
            "id": "bar-liqueur-1",
            "name": "Jägermeister",
            "price": "450"
          },
          {
            "id": "bar-liqueur-2",
            "name": "Becherovka",
            "price": "500"
          },
          {
            "id": "bar-liqueur-3",
            "name": "Campari / Aperol",
            "price": "500"
          },
          {
            "id": "bar-liqueur-4",
            "name": "Sarti Rosa",
            "price": "500"
          }
        ]
      },
      {
        "id": "wine",
        "title": "Вино",
        "dishes": [
          {
            "id": "bar-wine-1",
            "name": "Рислинг · белое",
            "price": "500"
          },
          {
            "id": "bar-wine-2",
            "name": "Совиньон блан · белое",
            "price": "550"
          },
          {
            "id": "bar-wine-3",
            "name": "Пино гриджио · белое",
            "price": "600"
          },
          {
            "id": "bar-wine-4",
            "name": "Мерло · красное",
            "price": "500"
          },
          {
            "id": "bar-wine-5",
            "name": "Каберне совиньон · красное",
            "price": "550"
          },
          {
            "id": "bar-wine-6",
            "name": "Зинфандель · красное",
            "price": "550"
          },
          {
            "id": "bar-wine-7",
            "name": "Брют · игристое",
            "price": "500"
          },
          {
            "id": "bar-wine-8",
            "name": "Просекко · игристое",
            "price": "600"
          },
          {
            "id": "bar-wine-9",
            "name": "Кава · игристое",
            "price": "650"
          }
        ]
      },
      {
        "id": "beer",
        "title": "Пиво",
        "dishes": [
          {
            "id": "bar-beer-1",
            "name": "Black Sheep Lager",
            "price": "370"
          },
          {
            "id": "bar-beer-2",
            "name": "Maison Blanche",
            "price": "370"
          },
          {
            "id": "bar-beer-3",
            "name": "Black Sheep Stout",
            "price": "400"
          },
          {
            "id": "bar-beer-4",
            "name": "Bakalar б/а (0,33)",
            "price": "400"
          }
        ]
      },
      {
        "id": "soft-drinks",
        "title": "Без алкоголя",
        "dishes": [
          {
            "id": "bar-soft-drinks-1",
            "name": "Кола 0,33",
            "price": "250"
          },
          {
            "id": "bar-soft-drinks-2",
            "name": "Вода Dausuz газ/без 0,2",
            "price": "300"
          },
          {
            "id": "bar-soft-drinks-3",
            "name": "Сок",
            "price": "300"
          }
        ]
      }
    ]
  }
];

// Cocktail photos are from the existing site; individual names and prices are unconfirmed.
const cocktailShowcase: Dish[] = [cocktailPhoto05, cocktailPhoto07, cocktailPhoto08].map((image, index) => ({
  id: `cocktail-showcase-${index + 1}`,
  name: 'Коктейли',
  description: 'Барная карта',
  image,
}));

export const featuredDishes = [
  ...menuGroups.flatMap((group) => group.sections.flatMap((section) => section.dishes)).filter((dish) => dish.image),
  ...cocktailShowcase,
];
