export class SearchResult {
  status?: string;
  results?: {
    hits: SearchResultItem[];
    offset: number;
    limit: number;
    nbHits: number;
    exhaustiveNbHits: boolean;
    processingTimeMs: number;
    query: string;
  };
}

export class SearchResultItem {
  id?: string;
  name?: string;
  summary?: string;
  number?: number;
  normtype?: string;
  organism?: string;
  year?: number;
  state?: string;
  keywords?: string[];
  tags?: any[];
  directories?: any[];
  gazette_name?: string;
  gazette_file?: string;
  gazette_type?: string;
  gazette_date?: string;
  gazette_number?: number;
  startpage?: number;
  endpage?: number;
  text?: string;
}
