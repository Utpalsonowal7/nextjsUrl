"use client";

export type QRDataModules = {
     color: string;
     style: string;
};

export type QRFinderPattern = {
     color: string;
     style: string;
};

export type QRImageSettings = {
     src: string;
     width: number;
     height: number;
     excavate?: boolean;
     opacity?: number;
} | null;

export type QROptions = {
     background: string;
     dataModules: QRDataModules;
     finderOuter: QRFinderPattern;
     finderInner: QRFinderPattern;
     image: QRImageSettings;
};

type Props = {
     options: QROptions;
     onChange: (options: QROptions) => void;
};

// Relative luminance (WCAG-style) so we can tell if the data-module color
// is lighter than the background — i.e. an inverted QR code that many
// camera scanners struggle to lock onto.
function getLuminance(hex: string): number {
     const clean = hex.replace("#", "");

     const r = parseInt(clean.substring(0, 2), 16) / 255;
     const g = parseInt(clean.substring(2, 4), 16) / 255;
     const b = parseInt(clean.substring(4, 6), 16) / 255;

     const toLinear = (c: number) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

     return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hexA: string, hexB: string): number {
     const lumA = getLuminance(hexA);
     const lumB = getLuminance(hexB);

     const lighter = Math.max(lumA, lumB);
     const darker = Math.min(lumA, lumB);

     return (lighter + 0.05) / (darker + 0.05);
}

export default function QRCustomization({ options, onChange }: Props) {
     const updateOption = <K extends keyof QROptions>(
          key: K,
          value: QROptions[K],
     ) => {
          onChange({
               ...options,
               [key]: value,
          });
     };

     const updateNestedOption = <
          T extends "dataModules" | "finderOuter" | "finderInner",
     >(
          section: T,
          key: keyof QROptions[T],
          value: string,
     ) => {
          onChange({
               ...options,
               [section]: {
                    ...options[section],
                    [key]: value,
               },
          });
     };

     // Inverted (light modules on dark background) is the main real-world
     // scan-breaker, so we check polarity first, then fall back to a plain
     // contrast check for low-contrast same-polarity combos.
     const dataLum = getLuminance(options.dataModules.color);
     const bgLum = getLuminance(options.background);
     const isInverted = dataLum > bgLum;
     const contrast = getContrastRatio(
          options.dataModules.color,
          options.background,
     );
     const lowContrast = !isInverted && contrast < 3;
     const showScanWarning = isInverted || lowContrast;

     return (
          <div className="w-full space-y-8">
               {/* BRANDING */}

               <div>
                    <h2 className="text-lg font-extrabold text-dashText">
                         Customize design
                    </h2>

                    <p className="text-sm text-muted mt-1">
                         Make your QR Code stand out and match your brand
                    </p>
               </div>

               {/* QR COLOR */}

               <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted">
                         QR color
                    </label>

                    <div className="flex items-center gap-3 border border-cardBorder rounded-xl px-3 py-2.5 bg-cardBg">
                         <label className="relative w-9 h-9 rounded-lg overflow-hidden border border-cardBorder cursor-pointer shrink-0">
                              <input
                                   type="color"
                                   value={options.dataModules.color}
                                   onChange={(e) =>
                                        updateNestedOption(
                                             "dataModules",
                                             "color",
                                             e.target.value,
                                        )
                                   }
                                   className="absolute -top-1 -left-1 w-12 h-12 cursor-pointer"
                              />
                         </label>

                         <span className="text-sm font-semibold text-dashText uppercase">
                              {options.dataModules.color}
                         </span>
                    </div>
               </div>

               {/* BACKGROUND */}

               <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted">
                         Background
                    </label>

                    <div className="flex items-center gap-3 border border-cardBorder rounded-xl px-3 py-2.5 bg-cardBg">
                         <label className="relative w-9 h-9 rounded-lg overflow-hidden border border-cardBorder cursor-pointer shrink-0">
                              <input
                                   type="color"
                                   value={options.background}
                                   onChange={(e) =>
                                        updateOption(
                                             "background",
                                             e.target.value,
                                        )
                                   }
                                   className="absolute -top-1 -left-1 w-12 h-12 cursor-pointer"
                              />
                         </label>

                         <span className="text-sm font-semibold text-dashText uppercase">
                              {options.background}
                         </span>
                    </div>
               </div>

               {/* SCAN RISK WARNING */}

               {showScanWarning && (
                    <div className="flex items-start gap-2.5 border border-amber-500/30 bg-amber-500/10 rounded-xl px-3 py-3">
                         <span className="text-amber-500 text-base leading-none mt-0.5">
                              ⚠
                         </span>
                         <div className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                              <p className="font-bold">
                                   {isInverted
                                        ? "This color combo may not scan"
                                        : "Low contrast may cause scan issues"}
                              </p>
                              <p className="mt-0.5">
                                   {isInverted
                                        ? "Your QR color is lighter than the background. Most phone cameras expect dark modules on a light background and may fail to detect it. It'll still work on scanners that support inverted codes, just not all of them."
                                        : "The QR color and background are close in brightness. Increase the contrast between them for a more reliable scan."}
                              </p>
                         </div>
                    </div>
               )}

               {/* PATTERN */}

               <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted">
                         Pattern
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                         {[
                              "square",
                              "circle",
                              "rounded",
                              "diamond",
                              "heart",
                              "star",
                              "leaf",
                         ].map((style) => (
                              <button
                                   key={style}
                                   type="button"
                                   onClick={() =>
                                        updateNestedOption(
                                             "dataModules",
                                             "style",
                                             style,
                                        )
                                   }
                                   className={`h-11 rounded-xl border text-xs font-semibold capitalize transition-colors ${
                                        options.dataModules.style === style
                                             ? "border-short bg-short/10 text-short"
                                             : "border-cardBorder text-dashText hover:border-muted"
                                   }`}
                              >
                                   {style}
                              </button>
                         ))}
                    </div>
               </div>

               {/* EYES */}

               <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted">
                         Eyes
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                         {["square", "rounded", "circle", "leaf"].map(
                              (style) => (
                                   <button
                                        key={style}
                                        type="button"
                                        onClick={() =>
                                             updateNestedOption(
                                                  "finderOuter",
                                                  "style",
                                                  style,
                                             )
                                        }
                                        className={`h-11 rounded-xl border text-xs font-semibold capitalize transition-colors ${
                                             options.finderOuter.style === style
                                                  ? "border-short bg-short/10 text-short"
                                                  : "border-cardBorder text-dashText hover:border-muted"
                                        }`}
                                   >
                                        {style}
                                   </button>
                              ),
                         )}
                    </div>
               </div>

               {/* LOGO */}

               <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted">
                         Logo
                    </label>

                    <div className="border border-dashed border-cardBorder rounded-xl p-4 bg-dashBg">
                         <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                   const file = e.target.files?.[0];

                                   if (!file) return;

                                   const src = URL.createObjectURL(file);

                                   updateOption("image", {
                                        src,
                                        width: 50,
                                        height: 50,
                                        excavate: true,
                                        opacity: 1,
                                   });
                              }}
                              className="w-full text-sm text-dashText file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-short file:text-white file:text-xs file:font-bold file:cursor-pointer cursor-pointer"
                         />

                         {options.image && (
                              <div className="flex items-center justify-between mt-3 bg-cardBg border border-cardBorder rounded-lg p-2">
                                   <div className="flex items-center gap-2">
                                        <img
                                             src={options.image.src}
                                             alt="QR logo"
                                             className="w-9 h-9 object-contain border border-cardBorder rounded bg-background"
                                        />
                                        <span className="text-xs text-muted font-medium">
                                             Logo added
                                        </span>
                                   </div>

                                   <button
                                        type="button"
                                        onClick={() =>
                                             updateOption("image", null)
                                        }
                                        className="text-xs font-bold text-short hover:underline"
                                   >
                                        Remove
                                   </button>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}
