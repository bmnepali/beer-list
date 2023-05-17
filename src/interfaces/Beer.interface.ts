export default interface Beer {
  name: string;
  image_url?: string;
  description: string;
  ingredients: null | string | Record<string, any>;
}

export interface IMyBeer extends Beer {
  id: string;
  genere: string;
}

export interface IAllBeer extends Beer{
  id: number;
  tagline: string;
}

export interface IMyBeers {
  records: IMyBeer[];
  totalCount: number;
}
