function CardSkeleton() {
     return (
          <div className="flex flex-col gap-3 border border-navB py-4 px-2 md:px-7 rounded-xl">
               <div className="h-4 w-30 rounded shimmer" />

               <div className="h-7 w-16 rounded shimmer" />

               <div className="h-4 w-30 rounded shimmer" />
          </div>
     );
}

export default CardSkeleton;
