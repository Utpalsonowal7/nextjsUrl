// "use client";

// import React, { useState } from "react";
// import ExcelJS from "exceljs";
// import { FiDownload } from "react-icons/fi";
// import { OverallAnalytics } from "@/types";

// interface DownloadExcelProps {
//      analytics: OverallAnalytics;
//      range: "7" | "30" | "0";
// }

// const COLORS = {
//      primary: "C41E3A",
//      dark: "252525",
//      text: "404040",
//      muted: "777777",
//      light: "F7F7F7",
//      border: "E5E5E5",
//      white: "FFFFFF",
//      green: "16A34A",
// };

// const rangeLabel = (range: "7" | "30" | "0") => {
//      if (range === "7") return "Last 7 Days";
//      if (range === "30") return "Last 30 Days";
//      return "All Time";
// };

// const formatNumber = (value: number | undefined | null) =>
//      new Intl.NumberFormat("en-IN").format(value ?? 0);

// const addTitle = (
//      sheet: ExcelJS.Worksheet,
//      title: string,
//      subtitle?: string,
// ) => {
//      sheet.mergeCells("A1:H2");

//      const cell = sheet.getCell("A1");
//      cell.value = title;
//      cell.font = {
//           size: 22,
//           bold: true,
//           color: { argb: COLORS.white },
//      };
//      cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: COLORS.primary },
//      };
//      cell.alignment = {
//           vertical: "middle",
//           horizontal: "left",
//      };

//      if (subtitle) {
//           sheet.mergeCells("A3:H3");
//           const sub = sheet.getCell("A3");
//           sub.value = subtitle;
//           sub.font = {
//                size: 10,
//                color: { argb: COLORS.muted },
//           };
//      }
// };

// const styleHeader = (row: ExcelJS.Row) => {
//      row.eachCell((cell) => {
//           cell.font = {
//                bold: true,
//                color: { argb: COLORS.white },
//           };

//           cell.fill = {
//                type: "pattern",
//                pattern: "solid",
//                fgColor: { argb: COLORS.dark },
//           };

//           cell.alignment = {
//                vertical: "middle",
//                horizontal: "left",
//           };

//           cell.border = {
//                bottom: {
//                     style: "thin",
//                     color: { argb: COLORS.border },
//                },
//           };
//      });

//      row.height = 25;
// };

// const styleBody = (sheet: ExcelJS.Worksheet) => {
//      sheet.eachRow((row, rowNumber) => {
//           if (rowNumber <= 3) return;

//           row.eachCell((cell) => {
//                cell.border = {
//                     bottom: {
//                          style: "hair",
//                          color: { argb: COLORS.border },
//                     },
//                };

//                cell.alignment = {
//                     vertical: "middle",
//                };
//           });
//      });
// };

// const setWidths = (
//      sheet: ExcelJS.Worksheet,
//      widths: Record<string, number>,
// ) => {
//      Object.entries(widths).forEach(([column, width]) => {
//           sheet.getColumn(column).width = width;
//      });
// };

// const addTableSheet = (
//      workbook: ExcelJS.Workbook,
//      name: string,
//      title: string,
//      headers: string[],
//      rows: (string | number)[][],
// ) => {
//      const sheet = workbook.addWorksheet(name);

//      addTitle(sheet, title, "UTPX Analytics Report");

//      const headerRow = sheet.addRow(headers);
//      styleHeader(headerRow);

//      rows.forEach((row) => {
//           sheet.addRow(row);
//      });

//      sheet.freezePanes = {
//           rows: 4,
//      };

//      sheet.autoFilter = {
//           from: {
//                row: 4,
//                column: 1,
//           },
//           to: {
//                row: 4,
//                column: headers.length,
//           },
//      };

//      styleBody(sheet);

//      return sheet;
// };

// export default function DownloadExcel({
//      analytics,
//      range,
// }: DownloadExcelProps) {
//      const [downloading, setDownloading] = useState(false);

//      const handleDownload = async () => {
//           if (!analytics || downloading) return;

//           try {
//                setDownloading(true);

//                const workbook = new ExcelJS.Workbook();

//                workbook.creator = "UTPX";
//                workbook.lastModifiedBy = "UTPX";
//                workbook.created = new Date();
//                workbook.modified = new Date();
//                workbook.properties.date1904 = false;

//                const clickTrend = analytics.clickTrend ?? [];
//                const cities = analytics.cities ?? [];
//                const referrers = analytics.referrers ?? [];
//                const devices = analytics.devices ?? [];
//                const operatingSystems = analytics.os ?? [];
//                const browsers = analytics.browsers ?? [];
//                const countries = analytics.countriesData ?? [];
//                const topLinks = analytics.topLinks ?? [];

//                // --------------------------------------------------
//                // DASHBOARD
//                // --------------------------------------------------

//                const dashboard = workbook.addWorksheet("Dashboard");

//                addTitle(
//                     dashboard,
//                     "UTPX Analytics Dashboard",
//                     `${rangeLabel(range)} • Generated ${new Date().toLocaleDateString(
//                          "en-IN",
//                     )}`,
//                );

//                setWidths(dashboard, {
//                     A: 4,
//                     B: 24,
//                     C: 18,
//                     D: 4,
//                     E: 24,
//                     F: 18,
//                     G: 4,
//                     H: 28,
//                });

//                // KPI cards

//                const kpis = [
//                     ["Total Links", analytics.totalLinks ?? 0],
//                     ["Total Clicks", analytics.totalClicks ?? 0],
//                     ["Unique Visitors", analytics.uniqueVisitors ?? 0],
//                     ["Countries Reached", analytics.countriesReached ?? 0],
//                     [
//                          "Avg. Daily Clicks",
//                          Math.round(analytics.avgDailyClicks ?? 0),
//                     ],
//                     [
//                          "Top Day Clicks",
//                          clickTrend.length
//                               ? Math.max(
//                                      ...clickTrend.map((x) => x.clicks ?? 0),
//                                 )
//                               : 0,
//                     ],
//                ];

//                const positions = [
//                     ["B5", "B6"],
//                     ["E5", "E6"],
//                     ["B9", "B10"],
//                     ["E9", "E10"],
//                     ["B13", "B14"],
//                     ["E13", "E14"],
//                ];

//                kpis.forEach(([label, value], index) => {
//                     const [labelCell, valueCell] = positions[index];

//                     dashboard.mergeCells(`${labelCell}:${labelCell}`);
//                     dashboard.mergeCells(`${valueCell}:${valueCell}`);

//                     const labelRef = dashboard.getCell(labelCell);
//                     const valueRef = dashboard.getCell(valueCell);

//                     labelRef.value = label;
//                     valueRef.value = value;

//                     labelRef.font = {
//                          size: 10,
//                          bold: true,
//                          color: { argb: COLORS.muted },
//                     };

//                     valueRef.font = {
//                          size: 20,
//                          bold: true,
//                          color: { argb: COLORS.primary },
//                     };

//                     labelRef.alignment = {
//                          horizontal: "left",
//                     };

//                     valueRef.alignment = {
//                          horizontal: "left",
//                     };
//                });

//                // --------------------------------------------------
//                // HIGHLIGHTS
//                // --------------------------------------------------

//                dashboard.mergeCells("H5:H6");
//                dashboard.getCell("H5").value = "KEY HIGHLIGHTS";
//                dashboard.getCell("H5").font = {
//                     bold: true,
//                     color: { argb: COLORS.white },
//                };
//                dashboard.getCell("H5").fill = {
//                     type: "pattern",
//                     pattern: "solid",
//                     fgColor: { argb: COLORS.dark },
//                };
//                dashboard.getCell("H5").alignment = {
//                     vertical: "middle",
//                };

//                const topDay = clickTrend.length
//                     ? clickTrend.reduce((max, item) =>
//                            (item.clicks ?? 0) > (max.clicks ?? 0) ? item : max,
//                       )
//                     : null;

//                const topLink = topLinks[0];

//                const topCity = cities.length
//                     ? cities.reduce((max, item) =>
//                            (item.value ?? 0) > (max.value ?? 0) ? item : max,
//                       )
//                     : null;

//                const highlightRows = [
//                     ["Top Day", topDay?.name ?? "N/A", topDay?.clicks ?? 0],
//                     [
//                          "Top Link",
//                          topLink?.shortLink ?? "N/A",
//                          topLink?.clicks ?? 0,
//                     ],
//                     [
//                          "Top Location",
//                          topCity?.name ?? "N/A",
//                          topCity?.value ?? 0,
//                     ],
//                ];

//                dashboard.getCell("H8").value = "Metric";
//                dashboard.getCell("I8").value = "Value";
//                dashboard.getCell("J8").value = "Clicks";

//                ["H8", "I8", "J8"].forEach((ref) => {
//                     const cell = dashboard.getCell(ref);

//                     cell.font = {
//                          bold: true,
//                          color: { argb: COLORS.white },
//                     };

//                     cell.fill = {
//                          type: "pattern",
//                          pattern: "solid",
//                          fgColor: { argb: COLORS.primary },
//                     };
//                });

//                highlightRows.forEach((item) => {
//                     dashboard.addRow([]);

//                     const row = dashboard.lastRow!;

//                     row.getCell(8).value = item[0];
//                     row.getCell(9).value = item[1];
//                     row.getCell(10).value = item[2];

//                     row.getCell(10).numFmt = "#,##0";
//                });

//                // --------------------------------------------------
//                // CLICK TREND PREVIEW
//                // --------------------------------------------------

//                dashboard.mergeCells("B17:J17");

//                dashboard.getCell("B17").value = "ENGAGEMENT TREND";
//                dashboard.getCell("B17").font = {
//                     bold: true,
//                     size: 13,
//                     color: { argb: COLORS.dark },
//                };

//                dashboard.addRow(["Date", "Clicks"]);

//                const trendHeader = dashboard.lastRow!;
//                styleHeader(trendHeader);

//                clickTrend.forEach((item) => {
//                     dashboard.addRow([item.name ?? "", item.clicks ?? 0]);
//                });

//                // --------------------------------------------------
//                // TRAFFIC OVERVIEW
//                // --------------------------------------------------

//                dashboard.addRow([]);
//                dashboard.addRow([]);

//                dashboard.mergeCells("B28:J28");

//                dashboard.getCell("B28").value = "TRAFFIC SOURCES";
//                dashboard.getCell("B28").font = {
//                     bold: true,
//                     size: 13,
//                     color: { argb: COLORS.dark },
//                };

//                dashboard.addRow(["Source", "Clicks"]);

//                styleHeader(dashboard.lastRow!);

//                referrers.slice(0, 10).forEach((item) => {
//                     dashboard.addRow([
//                          item.source ?? "Direct",
//                          item.clicks ?? 0,
//                     ]);
//                });

//                dashboard.freezePanes = {
//                     rows: 4,
//                };

//                // --------------------------------------------------
//                // CLICK TREND SHEET
//                // --------------------------------------------------

//                const trendSheet = addTableSheet(
//                     workbook,
//                     "Click Trend",
//                     "Click Trend",
//                     ["Date", "Clicks"],
//                     clickTrend.map((item) => [
//                          item.name ?? "",
//                          item.clicks ?? 0,
//                     ]),
//                );

//                trendSheet.getColumn("B").numFmt = "#,##0";

//                // --------------------------------------------------
//                // CITIES
//                // --------------------------------------------------

//                const totalCityClicks = cities.reduce(
//                     (sum, item) => sum + (item.value ?? 0),
//                     0,
//                );

//                const citySheet = addTableSheet(
//                     workbook,
//                     "Cities",
//                     "Engagements by City",
//                     ["City", "Clicks", "Share"],
//                     cities.map((item) => [
//                          item.name ?? "Unknown",
//                          item.value ?? 0,
//                          totalCityClicks
//                               ? Number(
//                                      (
//                                           ((item.value ?? 0) /
//                                                totalCityClicks) *
//                                           100
//                                      ).toFixed(1),
//                                 )
//                               : 0,
//                     ]),
//                );

//                citySheet.getColumn("B").numFmt = "#,##0";
//                citySheet.getColumn("C").numFmt = '0.0"%"';

//                // --------------------------------------------------
//                // REFERRERS
//                // --------------------------------------------------

//                const referrerSheet = addTableSheet(
//                     workbook,
//                     "Referrers",
//                     "Traffic Sources",
//                     ["Source", "Clicks"],
//                     referrers.map((item) => [
//                          item.source ?? "Direct",
//                          item.clicks ?? 0,
//                     ]),
//                );

//                referrerSheet.getColumn("B").numFmt = "#,##0";

//                // --------------------------------------------------
//                // DEVICES
//                // --------------------------------------------------

//                const deviceTotal = devices.reduce(
//                     (sum, item) => sum + (item.value ?? 0),
//                     0,
//                );

//                const deviceSheet = addTableSheet(
//                     workbook,
//                     "Devices",
//                     "Device Breakdown",
//                     ["Device", "Clicks", "Share"],
//                     devices.map((item) => [
//                          item.name ?? "Unknown",
//                          item.value ?? 0,
//                          deviceTotal
//                               ? Number(
//                                      (
//                                           ((item.value ?? 0) / deviceTotal) *
//                                           100
//                                      ).toFixed(1),
//                                 )
//                               : 0,
//                     ]),
//                );

//                deviceSheet.getColumn("B").numFmt = "#,##0";
//                deviceSheet.getColumn("C").numFmt = '0.0"%"';

//                // --------------------------------------------------
//                // OS
//                // --------------------------------------------------

//                const osTotal = operatingSystems.reduce(
//                     (sum, item) => sum + (item.value ?? 0),
//                     0,
//                );

//                const osSheet = addTableSheet(
//                     workbook,
//                     "OS",
//                     "Operating System Breakdown",
//                     ["Operating System", "Clicks", "Share"],
//                     operatingSystems.map((item) => [
//                          item.name ?? "Unknown",
//                          item.value ?? 0,
//                          osTotal
//                               ? Number(
//                                      (
//                                           ((item.value ?? 0) / osTotal) *
//                                           100
//                                      ).toFixed(1),
//                                 )
//                               : 0,
//                     ]),
//                );

//                osSheet.getColumn("B").numFmt = "#,##0";
//                osSheet.getColumn("C").numFmt = '0.0"%"';

//                // --------------------------------------------------
//                // BROWSERS
//                // --------------------------------------------------

//                const browserTotal = browsers.reduce(
//                     (sum, item) => sum + (item.value ?? 0),
//                     0,
//                );

//                const browserSheet = addTableSheet(
//                     workbook,
//                     "Browsers",
//                     "Browser Breakdown",
//                     ["Browser", "Clicks", "Share"],
//                     browsers.map((item) => [
//                          item.name ?? "Unknown",
//                          item.value ?? 0,
//                          browserTotal
//                               ? Number(
//                                      (
//                                           ((item.value ?? 0) / browserTotal) *
//                                           100
//                                      ).toFixed(1),
//                                 )
//                               : 0,
//                     ]),
//                );

//                browserSheet.getColumn("B").numFmt = "#,##0";
//                browserSheet.getColumn("C").numFmt = '0.0"%"';

//                // --------------------------------------------------
//                // COUNTRIES
//                // --------------------------------------------------

//                const countryTotal = countries.reduce(
//                     (sum, item) => sum + (item.value ?? 0),
//                     0,
//                );

//                const countrySheet = addTableSheet(
//                     workbook,
//                     "Countries",
//                     "Engagements by Country",
//                     ["Country", "Clicks", "Share"],
//                     countries.map((item) => [
//                          item.name ?? "Unknown",
//                          item.value ?? 0,
//                          countryTotal
//                               ? Number(
//                                      (
//                                           ((item.value ?? 0) / countryTotal) *
//                                           100
//                                      ).toFixed(1),
//                                 )
//                               : 0,
//                     ]),
//                );

//                countrySheet.getColumn("B").numFmt = "#,##0";
//                countrySheet.getColumn("C").numFmt = '0.0"%"';

//                // --------------------------------------------------
//                // TOP LINKS
//                // --------------------------------------------------

//                const topLinksSheet = addTableSheet(
//                     workbook,
//                     "Top Links",
//                     "Top Performing Links",
//                     ["Short Link", "Clicks"],
//                     topLinks.map((item) => [
//                          item.shortLink ?? "",
//                          item.clicks ?? 0,
//                     ]),
//                );

//                topLinksSheet.getColumn("B").numFmt = "#,##0";

//                // Add hyperlinks
//                const shortDomain =
//                     process.env.NEXT_PUBLIC_SHORT_URL?.replace(
//                          /^https?:\/\//,
//                          "",
//                     ) ?? "";

//                topLinks.forEach((item, index) => {
//                     const row = index + 5;
//                     const shortLink = item.shortLink ?? "";

//                     if (shortDomain && shortLink) {
//                          const url = `https://${shortDomain}${shortLink}`;

//                          const cell = topLinksSheet.getCell(`A${row}`);

//                          cell.value = {
//                               text: url,
//                               hyperlink: url,
//                          };

//                          cell.font = {
//                               color: { argb: "0563C1" },
//                               underline: true,
//                          };
//                     }
//                });

//                // --------------------------------------------------
//                // GLOBAL STYLING
//                // --------------------------------------------------

//                workbook.worksheets.forEach((sheet) => {
//                     sheet.views = [
//                          {
//                               showGridLines: false,
//                          },
//                     ];

//                     sheet.eachRow((row) => {
//                          row.eachCell((cell) => {
//                               cell.font = cell.font ?? {
//                                    name: "Aptos",
//                                    size: 10,
//                               };

//                               cell.alignment = {
//                                    vertical: "middle",
//                                    ...cell.alignment,
//                               };
//                          });
//                     });
//                });

//                // --------------------------------------------------
//                // DOWNLOAD
//                // --------------------------------------------------

//                const buffer = await workbook.xlsx.writeBuffer();

//                const blob = new Blob([buffer], {
//                     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                });

//                const url = URL.createObjectURL(blob);

//                const link = document.createElement("a");
//                link.href = url;
//                link.download = `UTPX-Analytics-${rangeLabel(range)
//                     .replace(/\s+/g, "-")
//                     .toLowerCase()}.xlsx`;

//                document.body.appendChild(link);
//                link.click();
//                document.body.removeChild(link);

//                URL.revokeObjectURL(url);
//           } catch (error) {
//                console.error("Failed to generate Excel report:", error);
//           } finally {
//                setDownloading(false);
//           }
//      };

//      return (
//           <button
//                type="button"
//                onClick={handleDownload}
//                disabled={downloading}
//                className="bg-[#c41e3a] text-white font-medium py-2 px-2.5 rounded flex gap-1 items-center disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//                <FiDownload className="font-bold w-4 h-5" />

//                <span>{downloading ? "Generating..." : "Download Excel"}</span>
//           </button>
//      );
// }
