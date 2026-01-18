import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Clock } from "lucide-react";

interface VerificationGateProps {
  status: 'unverified' | 'pending' | 'rejected' | 'verified';
}

export function VerificationGate({ status }: VerificationGateProps) {
  if (status === 'verified') return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto p-4">
      <Card className="w-full border-orange-500/50 bg-orange-50 dark:bg-orange-950/10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full w-fit mb-4">
            {status === 'pending' ? (
              <Clock className="h-10 w-10 text-orange-600 dark:text-orange-500" />
            ) : (
              <ShieldAlert className="h-10 w-10 text-orange-600 dark:text-orange-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-orange-800 dark:text-orange-500">
            {status === 'pending' ? 'Verification In Progress' : 'Account Not Verified'}
          </CardTitle>
          <CardDescription className="text-orange-700/80 dark:text-orange-400/80 text-base max-w-md mx-auto">
            {status === 'pending' 
              ? "Your documents have been submitted and are currently under review by our admin team. You will be notified once approved."
              : "To ensure platform safety, your business must be verified before you can access these features. Please upload your registration documents."
            }
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center pb-8">
          {status !== 'pending' && (
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg">
              <Link href="/dashboard/settings">
                Upload Documents <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
