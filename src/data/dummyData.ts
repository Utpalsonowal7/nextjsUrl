import { KpiData } from "@/types";

export const defaultKpis: KpiData[] = [
     {
          id: 1,
          title: "Today's Clicks",
          value: 0,
          change: "0%",
          trend: "",
          period: "vs yesterday",
     },
     {
          id: 2,
          title: "Links Created",
          value: 0,
          change: "0%",
          trend: "",
          period: "vs yesterday",
     },
     {
          id: 3,
          title: "Unique Visitors",
          value: 0,
          change: "0%",
          trend: "",
          period: "vs yesterday",
     },
     {
          id: 4,
          title: "Countries Reached",
          value: 0,
          change: "0%",
          trend: "",
          period: "vs yesterday",
     },
];

 export const dummyDomains = [
     {
          id: 1,
          domain: "go.utpx.in",
          verified: true,
          createdAt: "Aug 28, 2026",
     },
     {
          id: 2,
          domain: "links.mybrand.com",
          verified: true,
          createdAt: "Aug 26, 2026",
     },
     {
          id: 3,
          domain: "s.mycompany.io",
          verified: false,
          createdAt: "Aug 24, 2026",
     },
     {
          id: 4,
          domain: "go.utpal.dev",
          verified: true,
          createdAt: "Aug 20, 2026",
     },
     {
          id: 5,
          domain: "links.startup.app",
          verified: false,
          createdAt: "Aug 18, 2026",
     },
];