import React from "react";

function TopCard({
     label,
     name,
     data,
}: {
          label: string | undefined;
     name: string | undefined;
     data: number | undefined;
}) {
     return (
          <div className="flex flex-col gap-6 bg-dashBg border border-navB py-4 px-2 md:px-7 rounded-xl">
               <div className="text-muted font-medium text-sm">{label}</div>
               <div>
                    <h4 className="text-muted font-bold text-xl">{name}</h4>
               </div>
               <div className="flex gap-2 items-center">
                    <div className="font-bold text-xl">{data}</div>
                    <div className="text-muted font-medium text-xs">engagements</div>
               </div>
          </div>
     );
}

export default TopCard;
