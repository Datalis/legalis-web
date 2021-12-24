export class Params {
  text: string | null = null;
  state: string | null = null;
  organism: string | null = null;
  year: number | null = null;
  year_gte: number | null = null;
  year_lte: number | null = null;
  keyword: string | null = null;
  tematica: string | null = null;
  search_field: 'name' | 'text' | 'summary' | 'keywords' | 'tags' | null = null;
  type: string | null = null;
  page: number = 1;
  page_size: number = 10;
  ordering: string | null = null;
  normtype: string | null = null;
  name: string | null = null;
  directory: string | null = null;
  id: string | null = null;

  constructor() {}

  static fromObject(params: any) {
    let _params = new Params();
    Object.assign(_params, {
      ...params,
      year: params.year ? +params.year : null,
      year_gte: params.year_gte ? +params.year_gte : null,
      year_lte: params.year_lte ? +params.year_lte : null,
      page: params.page ? +params.page : null,
      page_size: params.page_size ? +params.page_size : null,
    });
    return _params;
  }

  toObject(): any {
    return Object.assign({}, this);
  }
}
