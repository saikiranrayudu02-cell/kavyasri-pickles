import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs p-0 w-full animate-fade-in">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-none" />
      
      {/* Body Content */}
      <div className="p-2.5 sm:p-5 flex flex-col gap-2 sm:gap-3">
        {/* Category & Heat */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4.5 w-full" />
          <Skeleton className="h-4.5 w-2/3" />
        </div>

        {/* Rating */}
        <Skeleton className="h-3 w-28" />

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-9 rounded-xl w-full" />
            <Skeleton className="h-9 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
