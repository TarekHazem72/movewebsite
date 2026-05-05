import { Link } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Film } from "lucide-react";

export function Navbar() {
  const { data: user, isError } = useGetMe({ query: { retry: false } });
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(getGetMeQueryKey(), null);
      }
    });
  };

  const isLoggedIn = user && !isError;

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:text-primary/80 transition-colors" data-testid="nav-home">
          <Film className="w-6 h-6" />
          <span>The Projection Room</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {user.role === "poster" && (
                <>
                  <Link href="/new-article" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-new-article">Write Review</Link>
                  <Link href="/my-articles" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-my-articles">My Reviews</Link>
                </>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
                <span className="text-sm text-muted-foreground" data-testid="text-username">
                  {user.username}
                </span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded uppercase tracking-wider">
                  {user.role}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout" className="ml-2">
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors px-3 py-2" data-testid="nav-login">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" data-testid="nav-register">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
