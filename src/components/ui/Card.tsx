function Card({
     name,
     data,
}: {
     name: string | undefined;
     data: number | undefined;
}) {
     return (
          <div className="flex flex-col gap-3 bg-dashBg border border-navB py-4 px-2 md:px-7 rounded-xl">
               <div>
                    <h4 className="text-muted font-medium text-sm">{name}</h4>
               </div>
               <div className="font-bold">{data}</div>
          </div>
     );
}

export default Card;
