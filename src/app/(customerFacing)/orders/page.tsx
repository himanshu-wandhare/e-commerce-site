"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOrderHistory } from "@/actions/orders";

import { useFormStatus, useFormState } from "react-dom";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});
  return (
    <form action={action} className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will email your order history and download
            links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SendButton />}
        </CardFooter>
      </Card>
    </form>
  );
}

function SendButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full text-lg" type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}
