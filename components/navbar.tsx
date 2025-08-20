"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Bell, Settings, LogOut, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleSignIn = async () => {
    if (!username.trim()) {
      alert("Please enter your HIVE username");
      return;
    }

    await login(username.trim());
    setIsLoginDialogOpen(false);
    setUsername("");
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="TheBuzzApp"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="font-bold text-lg">TheBuzzApp</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Dialog
              open={isLoginDialogOpen}
              onOpenChange={setIsLoginDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Sign In with Hive"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign In with HIVE Keychain</DialogTitle>
                  <DialogDescription>
                    Enter your HIVE username to authenticate with Keychain.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your HIVE username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  />
                  <Button
                    onClick={handleSignIn}
                    disabled={isLoading || !username.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create
              </Button>

              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://images.hive.blog/u/${user?.username}/avatar`}
                        alt={user?.username}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username?.charAt(0)?.toUpperCase() || "H"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-muted-foreground">
                      @{user?.username}
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
