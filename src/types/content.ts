export interface Dish {
  id: string;
  name: string;
  description?: string;
  ingredients?: string;
  portion?: string;
  price?: string;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date?: string;
  description?: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}
