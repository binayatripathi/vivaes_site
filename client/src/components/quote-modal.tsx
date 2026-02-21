import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuoteChatbot } from "@/components/quote-chatbot";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedService?: string;
}

export function QuoteModal({ open, onOpenChange, preselectedService }: QuoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-lg">
        <VisuallyHidden.Root>
          <DialogTitle>Get Your Instant Quote</DialogTitle>
          <DialogDescription>
            Chat with our quote assistant to get a personalized estimate.
          </DialogDescription>
        </VisuallyHidden.Root>
        <QuoteChatbot preselectedService={preselectedService} />
      </DialogContent>
    </Dialog>
  );
}
