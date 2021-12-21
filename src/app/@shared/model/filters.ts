export class Filters {
  q: string | null = null;
  state: string | null = null;
  organism: string | null = null;
  year: number | null = null;
  year_gte: number | null = null;
  year_lte: number | null = null;
  keyword: string | null = null;
  thematic: string | null = null;
  search_field: 'name' | 'text' | 'summary' | 'keywords' | 'tags' = 'text';
  type: string | null = null;

  constructor() {}
}
