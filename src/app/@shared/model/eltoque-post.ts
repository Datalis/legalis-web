export interface ElToqueMedia {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ElToqueAuthor {
  fullName?: string;
  slug?: string;
  username?: string;
}

export interface ElToqueCategory {
  documentId: string;
  title?: string;
  slug?: string;
}

/**
 * Post de api.eltoque.com (Strapi 5). Los `documentId` conservan el ObjectId
 * hexadecimal de la base Mongo anterior, así que los enlaces viejos siguen valiendo.
 */
export interface ElToquePost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  publish_date?: string | null;
  feature_image?: ElToqueMedia | null;
  feature_image_alt?: string | null;
  categories?: ElToqueCategory[];
  /** `postAuthors` (firmas) y, si no hay, `authors` (usuarios del panel). */
  authors?: ElToqueAuthor[];
  postAuthors?: ElToqueAuthor[];
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: { page?: number; pageSize?: number; start?: number; limit?: number; pageCount?: number; total: number };
  };
}
