import { useParams, Link } from "wouter";
import { 
  useGetArticle, 
  useListComments, 
  useCreateComment,
  useGetMe,
  getListCommentsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  
  const { data: user } = useGetMe({ query: { retry: false } });
  
  const { data: article, isLoading: isLoadingArticle } = useGetArticle(articleId, {
    query: { enabled: !!articleId, queryKey: [`/api/articles/${articleId}`] }
  });
  
  const { data: commentsData, isLoading: isLoadingComments } = useListComments(articleId, {
    query: { enabled: !!articleId, queryKey: getListCommentsQueryKey(articleId) }
  });

  const createComment = useCreateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(articleId) });
        queryClient.invalidateQueries({ queryKey: [`/api/articles/${articleId}`] });
        form.reset();
      }
    }
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    createComment.mutate({
      id: articleId,
      data: values
    });
  }

  if (isLoadingArticle) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <Skeleton className="h-10 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!article) return <div className="text-center py-12">Article not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-sans mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <header className="space-y-6">
        <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground">
          <span className="font-medium text-foreground">{article.authorUsername}</span>
          <span>•</span>
          <span>{format(new Date(article.createdAt), "MMMM d, yyyy")}</span>
        </div>

        <h1 className="text-5xl font-bold leading-tight">{article.title}</h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border/50 bg-card/50 rounded-lg">
          <div className="font-sans">
            <span className="text-muted-foreground">Review of </span>
            <span className="font-bold text-lg">{article.movieTitle}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
            <Star className="w-5 h-5 fill-primary" />
            <span className="font-bold text-xl">{article.rating}</span>
            <span className="text-sm opacity-70">/10</span>
          </div>
        </div>
      </header>

      <article className="prose prose-invert prose-lg max-w-none font-serif prose-p:leading-relaxed prose-headings:font-serif">
        {article.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </article>

      <hr className="border-border" />

      <section className="space-y-8">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <MessageSquare className="w-6 h-6" />
          <h2>Comments ({article.commentCount})</h2>
        </div>

        {user ? (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-medium mb-4">Leave a comment</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="What did you think of this review?" 
                          className="min-h-[100px] resize-y font-sans" 
                          data-testid="textarea-comment"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createComment.isPending}
                    data-testid="button-submit-comment"
                  >
                    {createComment.isPending ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="bg-card/50 p-6 rounded-lg border border-border/50 text-center font-sans">
            <p className="text-muted-foreground mb-4">Log in to join the conversation.</p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6 mt-8" data-testid="comment-list">
          {isLoadingComments ? (
            [1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)
          ) : commentsData?.comments.length === 0 ? (
            <p className="text-muted-foreground font-sans italic text-center py-8">No comments yet. Be the first!</p>
          ) : (
            commentsData?.comments.map((comment) => (
              <div key={comment.id} className="p-4 border border-border/50 rounded-lg bg-card/30" data-testid={`comment-item-${comment.id}`}>
                <div className="flex justify-between items-center mb-2 font-sans text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{comment.authorUsername}</span>
                  <span>{format(new Date(comment.createdAt), "MMM d, yyyy")}</span>
                </div>
                <p className="font-sans whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
