function ClicksTrendSkeleton() {
     return (
          <div className="flex flex-col gap-6 bg-dashBg border border-navB rounded-xl p-6 flex-1">
               <div className="h-4 w-40 rounded shimmer" />

               <div className="flex gap-4">
                    <div className="flex flex-col justify-between py-1">
                         <div className="h-3 w-8 rounded shimmer" />
                         <div className="h-3 w-8 rounded shimmer" />
                         <div className="h-3 w-8 rounded shimmer" />
                         <div className="h-3 w-8 rounded shimmer" />
                         <div className="h-3 w-6 rounded shimmer" />
                    </div>

                    <div className="flex-1 h-48 rounded-lg shimmer" />
               </div>

               <div className="flex justify-between pl-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                         <div key={i} className="h-3 w-8 rounded shimmer" />
                    ))}
               </div>
          </div>
     );
}

export default ClicksTrendSkeleton;
