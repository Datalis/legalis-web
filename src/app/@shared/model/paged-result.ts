export class PagedResult<T> {
  public count: number = 0;
  public next?: string;
  public previus?: string;
  public results: T[] = [];
}
