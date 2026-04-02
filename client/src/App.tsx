import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import ResidentialPage from "@/pages/residential";
import CommercialPage from "@/pages/commercial";
import { ServicesListPage, ServiceDetailPage } from "@/pages/services";
import QuotePage from "@/pages/quote";
import BookingPage from "@/pages/booking";
import AboutPage from "@/pages/about";
import SolarStoragePage from "@/pages/solar-storage";
import PaymentSuccessPage from "@/pages/payment-success";
import PaymentCancelPage from "@/pages/payment-cancel";
import { FloatingChatButton } from "@/components/quote-chatbot";
import { VapiProvider } from "@/components/vapi-call-button";
import ElectrificationPage from "@/pages/electrification";
import AdminPage from "@/pages/admin";
import InsuranceCompliancePage from "@/pages/insurance-compliance";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/residential" component={ResidentialPage} />
      <Route path="/commercial" component={CommercialPage} />
      <Route path="/services" component={ServicesListPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/quote" component={QuotePage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/electrification" component={ElectrificationPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/solar-storage" component={SolarStoragePage} />
      <Route path="/payment/success" component={PaymentSuccessPage} />
      <Route path="/payment/cancel" component={PaymentCancelPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/insurance-compliance" component={InsuranceCompliancePage} />
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
