import { useAuthStore } from "@/store/auth.store";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";
import { Button } from "@/components/ui";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  // const logout = useAuthStore((s) => s.logout);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="w-full ">
        
        <CardHeader>
          <h1 className="text-xl font-semibold">Info</h1>
        </CardHeader>

        <CardContent className="space-y-2">
          {user ? (
            <>
              <p><span className="text-gray-500">Email:</span> {user.email}</p>
              <p><span className="text-gray-500">Role:</span> {user.role}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>        

      </Card>
    </div>
  );
}