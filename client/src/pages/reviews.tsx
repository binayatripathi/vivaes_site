import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PageMeta } from "@/components/page-meta";
import { Star, ExternalLink, Upload, X, CheckCircle, ArrowLeft } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import type { Review } from "@shared/schema";

const submitReviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  rating: z.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Please write at least 10 characters"),
  photos: z.array(z.string()).optional().default([]),
});

type SubmitReviewForm = z.infer<typeof submitReviewSchema>;

const sourceLabels: Record<string, string> = {
  all: "All",
  google: "Google",
  angie: "Angie's List",
  homedepot: "Home Depot Pro",
  native: "Our Site",
};

const sourceTabs = ["all", "google", "angie", "homedepot", "native"] as const;

function PlatformLogo({ source }: { source: string }) {
  if (source === "google") {
    return <SiGoogle className="h-5 w-5 text-[#4285F4]" />;
  }
  if (source === "angie") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#FF6B35] text-[10px] font-bold text-white">A</span>
    );
  }
  if (source === "homedepot") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#F96302] text-[10px] font-bold text-white">HD</span>
    );
  }
  return null;
}

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${
            i <= (interactive ? hover || rating : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          } ${interactive ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(i)}
          data-testid={interactive ? `star-rating-${i}` : undefined}
        />
      ))}
    </div>
  );
}

function NativeReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full" data-testid={`card-review-native-${review.id}`}>
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold" data-testid={`text-review-name-${review.id}`}>{review.name}</p>
            <StarRating rating={review.rating || 5} />
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">Our Site</Badge>
        </div>
        {review.comment && (
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground" data-testid={`text-review-comment-${review.id}`}>
            "{review.comment}"
          </p>
        )}
        {review.photos && review.photos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {review.photos.slice(0, 4).map((photo, i) => (
              <a key={i} href={photo} target="_blank" rel="noreferrer">
                <img src={photo} alt="Review photo" className="h-16 w-16 rounded object-cover" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExternalReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full" data-testid={`card-review-external-${review.id}`}>
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlatformLogo source={review.source} />
            <span className="text-sm font-medium capitalize">{sourceLabels[review.source] || review.source}</span>
          </div>
          {review.externalLink && (
            <a
              href={review.externalLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
              data-testid={`link-review-external-${review.id}`}
            >
              View original <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {review.screenshotUrl && (
          <a href={review.externalLink || review.screenshotUrl} target="_blank" rel="noreferrer">
            <img
              src={review.screenshotUrl}
              alt={`${sourceLabels[review.source]} review screenshot`}
              className="w-full rounded border object-cover"
            />
          </a>
        )}
        <p className="text-sm text-muted-foreground" data-testid={`text-review-platform-name-${review.id}`}>{review.name}</p>
      </CardContent>
    </Card>
  );
}

function LeaveReviewForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SubmitReviewForm>({
    resolver: zodResolver(submitReviewSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rating: 0,
      comment: "",
      photos: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitReviewForm) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, photos: uploadedPhotos }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to submit", description: err.message, variant: "destructive" });
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append("photos", f));
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (data.urls) {
        setUploadedPhotos(prev => [...prev, ...data.urls]);
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (url: string) => {
    setUploadedPhotos(prev => prev.filter(p => p !== url));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center" data-testid="text-review-submitted">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h3 className="text-xl font-bold">Review Submitted!</h3>
        <p className="max-w-md text-muted-foreground">
          Thank you for your review. We've sent a verification link to your email address. Please click the link in that email to confirm your review — it will then be reviewed by our team before appearing publicly.
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); form.reset(); setUploadedPhotos([]); }}>
          Submit Another Review
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => submitMutation.mutate(d))} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" data-testid="input-review-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" data-testid="input-review-email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(510) 555-0100" data-testid="input-review-phone" {...field} />
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
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div>
                      <StarRating
                        rating={field.value}
                        interactive
                        onRate={(r) => field.onChange(r)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with Viva Electric & Solar..."
                      className="min-h-[120px]"
                      data-testid="textarea-review-comment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Photos (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {uploadedPhotos.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="Uploaded" className="h-16 w-16 rounded border object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(url)}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                      data-testid={`button-remove-photo-${i}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex h-16 w-16 items-center justify-center rounded border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  data-testid="button-add-photo"
                >
                  {uploading ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                data-testid="input-review-photos"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitMutation.isPending}
              data-testid="button-submit-review"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              After submitting, you'll receive a verification email. Your review will appear publicly once verified and approved.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", activeTab],
    queryFn: async () => {
      const url = activeTab === "all" ? "/api/reviews" : `/api/reviews?source=${activeTab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  return (
    <>
      <PageMeta
        title="Customer Reviews | Viva Electric & Solar"
        description="Read verified customer reviews for Viva Electric & Solar — trusted electricians serving the Bay Area and Central Valley. Leave your own review."
        canonical="https://vivaes.net/reviews"
      />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-10"
          >
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mb-4" data-testid="link-back-home">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-reviews-title">
                Customer Reviews
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real experiences from homeowners and businesses we've served across the Bay Area and Central Valley.
              </p>
            </div>

            <div className="flex flex-wrap gap-2" data-testid="tabs-reviews-filter">
              {sourceTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                  data-testid={`tab-reviews-${tab}`}
                >
                  {sourceLabels[tab]}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : !reviews || reviews.length === 0 ? (
              <div className="rounded-lg border bg-card py-16 text-center" data-testid="text-no-reviews">
                <p className="text-muted-foreground">No reviews yet in this category.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) =>
                  review.source === "native" ? (
                    <NativeReviewCard key={review.id} review={review} />
                  ) : (
                    <ExternalReviewCard key={review.id} review={review} />
                  )
                )}
              </div>
            )}

            <div className="border-t pt-12">
              <div className="mx-auto max-w-2xl">
                <h2 className="mb-6 text-center text-2xl font-bold" data-testid="text-leave-review-title">
                  Leave a Review
                </h2>
                <LeaveReviewForm />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
