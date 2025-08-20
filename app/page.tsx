import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 pt-8">
      <main className="flex flex-col gap-[32px] items-center max-w-4xl mx-auto">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="TheBuzzApp logo"
            width={180}
            height={38}
            priority
            className="mx-auto mb-8"
          />
          <h1 className="text-7xl font-bold mb-4">TheBuzzApp</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Frontend UI for HIVE Blockchain
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
