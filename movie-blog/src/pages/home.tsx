import { Link } from "wouter";
import { useListArticles } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { MessageSquare, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: articles, isLoading } = useListArticles();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Latest Reviews</h1>
          <p className="text-muted-foreground">Read what our critics are saying.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : articles?.articles.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <div className="grid gap-6" data-testid="article-list">
          {articles?.articles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <Card className="hover-elevate cursor-pointer transition-all border-border/50 hover:border-primary/50 group" data-testid={`article-card-${article.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1 font-sans text-sm">
                        Review of <span className="font-semibold text-foreground">{article.movieTitle}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                      <Star className="w-4 h-4 fill-primary" />
                      <span className="font-bold">{article.rating}</span>
                      <span className="text-xs opacity-70">/10</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-muted-foreground font-sans">
                    {article.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground font-sans pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{article.authorUsername}</span>
                    <span>•</span>
                    <span>{format(new Date(article.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{article.commentCount} {article.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
