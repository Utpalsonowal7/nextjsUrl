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

export interface KpiData {
     id: number;
     title: string;
     value: number;
     change: string;
     trend: "up" | "down" | "";
     period: string;
}

export interface ChartData {
     name: string;
     clicks: number;
}

export interface PiData {
     name: string;
     value: number;
     fill: string;
}

export interface CardData {
     name: string;
     value: number;
}

export interface TopLink {
     linkId: number;
     clicks: number;
     shortCode: string;
     shortUrl: string;
     longUrl: string;
}

export interface TopLinkCard extends TopLink {
     logo: string;
}

export interface DashboardData {
     kpiData: KpiData[];
     clisksByHour: ChartData[];
     topCountries: PiData[];
     topLinks: TopLink[];
     topCities: CardData[];
}

export interface userLinks {
     id: number;
     shortcode: string;
     title: string;
     shortUrl: string;
     longUrl: string;
     tags: string[];
}

export interface LinkProps {
     link: userLinks;
     image: string;
}

// export interface  {}

// export interface Analytics {
//      totalClicks: number;
//      uniqueVisitors: number;
//      avgDailyClicks: number;
//      countries: number;

//      clickTrend?: {
//           name: string;
//           clicks: number;
//      }[];

//      countriesData?: {
//           name: string;
//           value: number;
//           fill?: string;
//      }[];

//      devices?: {
//           name: string;
//           value: number;
//           fill?: string;
//      }[];

//      browsers?: {
//           name: string;
//           value: number;
//           fill?: string;
//      }[];

//      referrers?: {
//           source: string;
//           clicks: number;
//      }[];

//      cities?: {
//           name: string;
//           value: number;
//      }[];

//      os?: {
//           name: string;
//           value: number;
//      }[];

//      recentClicks?: {
//           time: string;
//           country: string;
//           city: string;
//           browser: string;
//           device: string;
//           referrer: string;
//      }[];
// }

// export interface LinkData {
//      id: number;
//      shortcode: string;
//      title: string;
//      shortUrl: string;
//      longUrl: string;

//      tags?: string[];
//      createdAt?: string;

//      status?: "Active" | "Paused" | "Expired";
//      lastClicked?: string;
//      expiresAt?: string;
//      passwordProtected?: boolean;

//      analytics?: Analytics;
// }

export interface DetailsProps {
     id: number;
     shortcode: string;
     title: string;
     shortUrl: string;
     longUrl: string;
     status: string;
     createdAt: string;
     lastClicked: string | null;
     expiresAt: string;
     passwordProtected: boolean;
     tags: string[];

     analytics: {
          totalClicks: number;
          uniqueVisitors: number;
          avgDailyClicks: number;
          countries: number;

          clickTrend: {
               name: string;
               clicks: number;
          }[];

          countriesData: {
               name: string;
               value: number;
               fill?: string;
          }[];

          devices: {
               name: string;
               value: number;
               fill?: string;
          }[];

          cities: {
               name: string;
               value: number;
               fill?: string;
          }[];

          os: {
               name: string;
               value: number;
               fill?: string;
          }[];

          browsers: {
               name: string;
               value: number;
               fill?: string;
          }[];

          referrers: {
               source: string;
               clicks: number;
          }[];

          recentClicks: {
               timestamp: string;
               country: string | null;
               city: string | null;
               browser: string | null;
               device: string | null;
               referrer: string | null;
          }[];
     };
}

export interface OverallAnalytics {
     totalLinks: number;
     activeLinks: number;
     pausedLinks: number;
     expiredLinks: number;

     totalClicks: number;
     uniqueVisitors: number;
     avgDailyClicks: number;
     countriesReached: number;

     clickTrend: {
          name: string;
          clicks: number;
     }[];

     countriesData: {
          name: string;
          value: number;
     }[];

     devices: {
          name: string;
          value: number;
     }[];

     cities: {
          name: string;
          value: number;
     }[];

     os: {
          name: string;
          value: number;
     }[];

     browsers: {
          name: string;
          value: number;
     }[];

     referrers: {
          source: string;
          clicks: number;
     }[];

     topLinks: {
          id: number;
          desc: string | null;
          shortLink: string;
          clicks: number;
     }[];

     recentClicks: {
          timestamp: string;
          country: string;
          city: string;
          browser: string;
          device: string;
          referrer: string;
     }[];
}

export interface OverallAnalyticsResponse {
     analytcs: OverallAnalytics;
}
