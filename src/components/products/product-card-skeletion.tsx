import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <Skeleton className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-1/4 h-4 rounded-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="flex-grow h-4 rounded-full bg-gray-300" />
        <Skeleton className="flex-grow h-4 rounded-full bg-gray-300" />
        <Skeleton className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Skeleton className="flex-grow h-10 bg-gray-300" />
      </CardFooter>
    </Card>
  );
}
