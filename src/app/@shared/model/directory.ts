export class Directory {
  public id?: number;
  public name?: string;
  public description?: string;
  public children: Directory[] = [];
  public normatives?: number;
}
