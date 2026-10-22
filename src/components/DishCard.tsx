import type { Dish } from '../types/content';

export function DishCard({ dish }: { dish: Dish }) {
  return <article className="card dish-card">
    <div className="dish-card__image">
      {dish.image && <img src={dish.image} alt={dish.name} width="480" height="480" loading="lazy" decoding="async" />}
      {dish.price && <span className="dish-card__price" aria-label={`Цена ${dish.price} рублей`}>{dish.price}</span>}
    </div>
    <div className="card__body">
      <h3>{dish.name}</h3>
      {(dish.portion || dish.description) && <p>{dish.portion || dish.description}</p>}
    </div>
  </article>;
}
