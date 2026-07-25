export interface CurrentUser {
     id: number;
     name?: string;
     email: string;
     avataer: string;
}


export interface link{
     link: {
          id?: number;
          desc?: string;
          shortLink?: string;
          longUrl: string;
          tags?: string[];
          createdAt?: Date
     },
     image: string;
}

