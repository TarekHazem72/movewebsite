import { Link, useLocation } from "wouter";
import { useListArticles, useGetMe, useDeleteArticle, getListArticlesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Edit, Star, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyArticles() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false } });

  // Redirect if not poster
  if (!isUserLoading && (!user || user.role !== "poster")) {
    setLocation("/login");
    return null;
  }

  const { data: articlesData, isLoading: isArticlesLoading } = useListArticles();

  const deleteArticleMutation = useDeleteArticle({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
        toast({ title: "Review deleted" });
      },
      onError: (error: any) => {
        toast({ title: "Failed to delete", description: error.error, variant: "destructive" });
      }
    }
  });

  const handleDelete = (id: number) => {
    deleteArticleMutation.mutate({ id });
  };

  if (isUserLoading) return <div className="text-center py-12">Loading...</div>;

  const myArticles = articlesData?.articles.filter(a => a.authorId === user?.id) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground font-sans">Manage your published articles.</p>
        </div>
        <Link href="/new-article">
          <Button className="font-sans">Write New</Button>
        </Link>
      </div>

      {isArticlesLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : myArticles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30">
          <p className="text-muted-foreground font-sans mb-4">You haven't published any reviews yet.</p>
          <Link href="/new-article">
            <Button variant="outline">Start Writing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 font-sans">
          {myArticles.map(article => (
            <div key={article.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card border border-border rounded-lg gap-4">
              <div className="space-y-1">
                <Link href={`/article/${article.id}`} className="text-xl font-bold font-serif hover:text-primary transition-colors line-clamp-1 block">
                  {article.title}
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Movie: {article.movieTitle}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span>{article.rating}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{article.commentCount}</span>
                  </div>
                  <span>•</span>
                  <span>{format(new Date(article.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <Link href={`/article/${article.id}`}>
                  <Button variant="secondary" size="sm">View</Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" data-testid="button-delete-article">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your review for "{article.movieTitle}" and all its comments. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(article.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
