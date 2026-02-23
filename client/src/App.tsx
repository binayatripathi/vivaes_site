import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import { ServicesListPage, ServiceDetailPage } from "@/pages/services";
import QuotePage from "@/pages/quote";
import BookingPage from "@/pages/booking";
import AboutPage from "@/pages/about";
import PaymentSuccessPage from "@/pages/payment-success";
import PaymentCancelPage from "@/pages/payment-cancel";
import { FloatingChatButton } from "@/components/quote-chatbot";
import { VapiProvider } from "@/components/vapi-call-button";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={ServicesListPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/quote" component={QuotePage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/payment/success" component={PaymentSuccessPage} />
      <Route path="/payment/cancel" component={PaymentCancelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <VapiProvider>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <FloatingChatButton />
            <Toaster />
          </VapiProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
