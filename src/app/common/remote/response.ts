export interface Response<T> {
    code: number;
    data: T;
    message: string;
    timestamp: Date;
  }
  
  export class AnyResponse implements Response<any> {
    constructor(
      public code: number,
      public data: any,
      public message: string,
      private timestampStr: string
    ) { }
  
    public get timestamp(): Date {
      return new Date(this.timestampStr);
    }
  }
  