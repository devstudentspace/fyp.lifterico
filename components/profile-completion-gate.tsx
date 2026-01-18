import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface ProfileCompletionGateProps {
  percentage: number;
}

export function ProfileCompletionGate({ percentage }: ProfileCompletionGateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto p-4">
      <Card className="w-full border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full w-fit mb-4">
            <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-500">
            Profile Incomplete ({percentage}%)
          </CardTitle>
          <CardDescription className="text-yellow-700/80 dark:text-yellow-400/80 text-base max-w-md mx-auto">
            To ensure the security and reliability of the Lifterico platform, you must complete at least 70% of your profile before accessing the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-yellow-800 dark:text-yellow-500">
              <span>Current Completion</span>
              <span>{percentage}% / 70% Required</span>
            </div>
            <Progress value={percentage} className="h-3 bg-yellow-200 dark:bg-yellow-900/40" indicatorClassName="bg-yellow-600 dark:bg-yellow-500" />
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white border-none shadow-lg">
            <Link href="/dashboard/settings">
              Complete My Profile <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
