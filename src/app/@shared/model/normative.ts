export class Normative {
  public id?: number;
  public slug?: string;
  public tags?: string;
  public directories?: string;
  public name?: string;
  public summary?: string;
  public number?: number;
  public normtype?: string;
  public organism?: string;
  public year?: number;
  public state?: string;
  public keywords?: string[];
  public startpage?: number;
  public endpage?: number;
  public text?: string;
  public similarity?: string;
  public read_count?: number;
  public gazette?: string;
  public derogatedby?: {
    id?: number;
    slug?: string;
    name?: string;
  };
  public modifiedby?: {
    id?: number;
    slug?: string;
    name?: string;
  }[];
  public modifiedto?: string[];
  public derogateto?: {
    id?: number;
    slug?: string;
    name?: string;
  }[];
}
