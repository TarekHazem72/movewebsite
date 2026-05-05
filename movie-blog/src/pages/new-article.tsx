import { useEffect } from "wouter";
import { useLocation, Link } from "wouter";
import { useGetMe, useCreateArticle } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title is too long"),
  movieTitle: z.string().min(1, "Movie title is required").max(200, "Movie title is too long"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),
  content: z.string().min(20, "Review must be at least 20 characters long"),
});

export default function NewArticle() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false } });

  // Redirect if not poster
  if (!isUserLoading && (!user || user.role !== "poster")) {
    setLocation("/login");
    return null;
  }
  
  const createArticleMutation = useCreateArticle({
    mutation: {
      onSuccess: (article) => {
        queryClient.invalidateQueries({ queryKey: [`/api/articles`] });
        toast({ title: "Review published!", description: "Your article is now live." });
        setLocation(`/article/${article.id}`);
      },
      onError: (error: any) => {
        toast({ 
          title: "Failed to publish", 
          description: error.error || "An error occurred.", 
          variant: "destructive" 
        });
      }
    }
  });

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: "", movieTitle: "", rating: 5, content: "" },
  });

  function onSubmit(values: z.infer<typeof articleSchema>) {
    createArticleMutation.mutate({ data: values });
  }

  if (isUserLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-sans">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Write a Review</h1>
        <p className="text-muted-foreground font-sans">Share your thoughts on a film.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="bg-card border border-border p-6 rounded-lg space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Headline</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. A Masterpiece of Modern Cinema" 
                      className="text-lg font-serif" 
                      data-testid="input-title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <FormField
                control={form.control}
                name="movieTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. The Godfather" data-testid="input-movie-title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} data-testid="input-rating" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Review Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your review here..." 
                    className="min-h-[400px] resize-y font-serif text-lg leading-relaxed p-6" 
                    data-testid="textarea-content"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end font-sans">
            <Button 
              type="submit" 
              size="lg"
              className="gap-2"
              disabled={createArticleMutation.isPending}
              data-testid="button-submit-article"
            >
              <Send className="w-4 h-4" />
              {createArticleMutation.isPending ? "Publishing..." : "Publish Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
