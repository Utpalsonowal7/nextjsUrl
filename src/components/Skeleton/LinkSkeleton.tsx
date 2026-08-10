function LinkRowSkeleton() {
     return (
          <div className="flex items-center justify-between gap-4 bg-dashBg border border-navB rounded-xl p-5">
               <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-lg shimmer shrink-0" />

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                         <div className="h-4 w-3/5 rounded shimmer" />
                         <div className="h-3.5 w-24 rounded shimmer" />
                         <div className="h-3 w-48 rounded shimmer" />
                    </div>
               </div>

               <div className="flex items-center gap-4 shrink-0">
                    <div className="h-4 w-4 rounded shimmer" />
                    <div className="h-4 w-4 rounded shimmer" />
                    <div className="h-4 w-4 rounded shimmer" />
                    <div className="h-4 w-4 rounded shimmer" />
               </div>
          </div>
     );
}

function LinksListSkeleton({ count = 4 }: { count?: number }) {
     return (
          <div className="flex flex-col gap-4">
               {Array.from({ length: count }).map((_, i) => (
                    <LinkRowSkeleton key={i} />
               ))}
          </div>
     );
}

export { LinkRowSkeleton, LinksListSkeleton };
