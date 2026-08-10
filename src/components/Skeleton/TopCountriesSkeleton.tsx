function TopCountriesSkeleton() {
     return (
          <div className="flex flex-col gap-6 bg-dashBg border border-navB rounded-xl p-6 w-full md:w-80">
               <div className="h-4 w-28 rounded shimmer" />

               <div className="flex items-center gap-8">
                    <div className="relative h-32 w-32 shrink-0">
                         <div className="h-32 w-32 rounded-full shimmer" />
                         <div className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-dashBg" />
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                         {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                   key={i}
                                   className="flex items-center justify-between gap-2"
                              >
                                   <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full shimmer" />
                                        <div className="h-3 w-8 rounded shimmer" />
                                   </div>
                                   <div className="h-3 w-8 rounded shimmer" />
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
}

export default TopCountriesSkeleton;
