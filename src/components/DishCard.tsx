import type { Dish } from '../types/content';

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="card dish-card">
      {dish.image && <img src={dish.image} alt="" />}
      <div className="card__body">
        <h3>{dish.name}</h3>
        {dish.description && <p>{dish.description}</p>}
        {dish.price && <span>{dish.price}</span>}
      </div>
    </article>
  );
}
