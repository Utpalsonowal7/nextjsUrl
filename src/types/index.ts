import { cities } from "@/data/cities";

export interface Tags {
     name?: string;
}

export interface PostLink {
     longUrl: string;
     title?: string;
     tags?: string[];
     customCode?: string;
     pass?: string;
}


export interface ShortLink {
     longUrl: string;
     shortLink: string;
}

// export interface PostLinkresponse {
//      url: string;
// }

export interface CurrentUser {
     id: number;
     name?: string;
     email: string;
     avataer: string;
}

export interface ApiResponse<T> {
     statusCode: number;
     data: T;
     message: string;
     success: boolean;
}

export interface Analytics {
     totalClicks: number;
     uniqueVisitors: number;
     avgDailyClicks: number;
     countries: number;

     clickTrend?: {
          name: string;
          clicks: number;
     }[];

     countriesData?: {
          name: string;
          value: number;
          fill?: string;
     }[];

     devices?: {
          name: string;
          value: number;
          fill?: string;
     }[];

     browsers?: {
          name: string;
          value: number;
          fill?: string;
     }[];

     referrers?: {
          source: string;
          clicks: number;
     }[];

     cities?: {
          name: string;
          value: number;
     }[];

     os?: {
          name: string;
          value: number;
     }[];

     recentClicks?: {
          time: string;
          country: string;
          city: string;
          browser: string;
          device: string;
          referrer: string;
     }[];
}

export interface LinkData {
     id: number;
     desc: string;
     shortLink: string;
     longUrl: string;

     tags?: string[];
     createdAt?: string;

     status?: "Active" | "Paused" | "Expired";
     lastClicked?: string;
     expiresAt?: string;
     passwordProtected?: boolean;

     analytics?: Analytics;
}

export interface LinkProps {
     link: LinkData;
     image: string;
}
