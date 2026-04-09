import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Lead, Appointment, CallLog } from "@shared/schema";
import {
  Users,
  CalendarDays,
  UserPlus,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  PhoneCall,
  FileText,
  Send,
  LogOut,
  Loader2,
  LinkIcon,
} from "lucide-react";

function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

function clearAdminToken() {
  localStorage.removeItem("admin_token");
}

async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
  }
  return res;
}

async function adminApiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (data) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
  }
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

interface AdminStats {
  totalLeads: number;
  newLeadsToday: number;
  pendingAppointments: number;
  completedJobs: number;
  totalCalls: number;
}

const leadStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  quoted: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  booked: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const appointmentStatusColors: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const leadStatuses = ["new", "contacted", "quoted", "booked", "completed", "lost"];
const appointmentStatuses = ["pending", "confirmed", "completed", "cancelled"];

function formatDate(dateStr: string | Date | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string | Date | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatsBar({ stats, isLoading }: { stats?: AdminStats; isLoading: boolean }) {
  const items = [
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: Users, color: "text-primary" },
    { label: "New Today", value: stats?.newLeadsToday ?? 0, icon: UserPlus, color: "text-blue-500" },
    { label: "Pending Appts", value: stats?.pendingAppointments ?? 0, icon: CalendarDays, color: "text-orange-500" },
    { label: "Completed", value: stats?.completedJobs ?? 0, icon: CheckCircle, color: "text-green-500" },
    { label: "Voice Calls", value: stats?.totalCalls ?? 0, icon: PhoneCall, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <p className="text-2xl font-bold" data-testid={`text-stat-value-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item.value}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LeadStatusSelect({ lead }: { lead: Lead }) {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await adminApiRequest("PATCH", `/api/admin/leads/${lead.leadId}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  return (
    <Select
      value={lead.status}
      onValueChange={(val) => mutation.mutate(val)}
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className="w-[130px]"
        data-testid={`select-lead-status-${lead.id}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {leadStatuses.map((s) => (
          <SelectItem key={s} value={s} data-testid={`option-lead-status-${s}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AppointmentStatusSelect({ appointment }: { appointment: Appointment }) {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await adminApiRequest("PATCH", `/api/admin/appointments/${appointment.bookingId}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  return (
    <Select
      value={appointment.status}
      onValueChange={(val) => mutation.mutate(val)}
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className="w-[130px]"
        data-testid={`select-appt-status-${appointment.id}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {appointmentStatuses.map((s) => (
          <SelectItem key={s} value={s} data-testid={`option-appt-status-${s}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function LeadDetailDialog({ lead, open, onOpenChange }: { lead: Lead | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="dialog-lead-detail">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Lead Details
            <Badge className={`no-default-hover-elevate no-default-active-elevate ${leadStatusColors[lead.status] || ""}`}>
              {lead.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium" data-testid="text-lead-detail-name">{lead.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lead ID</p>
              <p className="font-mono text-sm" data-testid="text-lead-detail-id">{lead.leadId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span data-testid="text-lead-detail-phone">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span data-testid="text-lead-detail-email">{lead.email}</span>
              </div>
            )}
          </div>

          {(lead.address || lead.city || lead.zip) && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span data-testid="text-lead-detail-address">
                {[lead.address, lead.city, lead.zip].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Service Type</p>
              <p data-testid="text-lead-detail-service">{lead.serviceType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Source</p>
              <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate" data-testid="text-lead-detail-source">{lead.source}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {lead.propertyType && (
              <div>
                <p className="text-xs text-muted-foreground">Property</p>
                <p>{lead.propertyType}</p>
              </div>
            )}
            {lead.urgency && (
              <div>
                <p className="text-xs text-muted-foreground">Urgency</p>
                <p>{lead.urgency}</p>
              </div>
            )}
            {lead.projectSize && (
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p>{lead.projectSize}</p>
              </div>
            )}
          </div>

          {lead.details && (
            <div>
              <p className="text-xs text-muted-foreground">Details</p>
              <p className="text-sm" data-testid="text-lead-detail-details">{lead.details}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Created {formatDateTime(lead.createdAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeadsTab() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const queryKey = statusFilter === "all"
    ? ["/api/admin/leads"]
    : ["/api/admin/leads", `?status=${statusFilter}`];

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey,
    queryFn: async () => {
      const url = statusFilter === "all"
        ? "/api/admin/leads"
        : `/api/admin/leads?status=${statusFilter}`;
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-lead-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {leadStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !leads || leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground" data-testid="text-no-leads">No leads found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-leads">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Date</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground md:table-cell">Phone</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground lg:table-cell">Email</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Service</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground sm:table-cell">Urgency</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground sm:table-cell">Source</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b hover-elevate cursor-pointer"
                  onClick={() => handleRowClick(lead)}
                  data-testid={`row-lead-${lead.id}`}
                >
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                  <td className="py-3 pr-4 font-medium">{lead.name}</td>
                  <td className="hidden py-3 pr-4 md:table-cell">{lead.phone}</td>
                  <td className="hidden py-3 pr-4 lg:table-cell">{lead.email || "—"}</td>
                  <td className="py-3 pr-4">{lead.serviceType}</td>
                  <td className="hidden py-3 pr-4 sm:table-cell">{lead.urgency || "—"}</td>
                  <td className="hidden py-3 pr-4 sm:table-cell">
                    <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate text-xs">
                      {lead.source}
                    </Badge>
                  </td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <LeadStatusSelect lead={lead} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadDetailDialog lead={selectedLead} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}

function AppointmentsTab() {
  const [statusFilter, setStatusFilter] = useState("all");

  const queryKey = statusFilter === "all"
    ? ["/api/admin/appointments"]
    : ["/api/admin/appointments", `?status=${statusFilter}`];

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey,
    queryFn: async () => {
      const url = statusFilter === "all"
        ? "/api/admin/appointments"
        : `/api/admin/appointments?status=${statusFilter}`;
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-appt-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {appointmentStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !appointments || appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground" data-testid="text-no-appointments">No appointments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-appointments">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Date</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground md:table-cell">Phone</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Service</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Preferred Date</th>
                <th className="hidden pb-3 pr-4 font-medium text-muted-foreground sm:table-cell">Time</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="border-b"
                  data-testid={`row-appointment-${appt.id}`}
                >
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(appt.createdAt)}</td>
                  <td className="py-3 pr-4 font-medium">{appt.name}</td>
                  <td className="hidden py-3 pr-4 md:table-cell">{appt.phone}</td>
                  <td className="py-3 pr-4">{appt.serviceType}</td>
                  <td className="py-3 pr-4">{appt.preferredDate}</td>
                  <td className="hidden py-3 pr-4 sm:table-cell">{appt.preferredTime}</td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <AppointmentStatusSelect appointment={appt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CallLogsTab() {
  const { data: logs, isLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/admin/call-logs"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/call-logs");
      if (!res.ok) throw new Error("Failed to fetch call logs");
      return res.json();
    },
  });

  function formatDuration(seconds: number | null) {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  function getTranscriptPreview(transcript: string | null) {
    if (!transcript) return null;
    try {
      const messages = JSON.parse(transcript);
      if (Array.isArray(messages)) {
        return messages
          .filter((m: any) => m.role && m.message)
          .map((m: any) => `${m.role === "assistant" ? "Agent" : "Caller"}: ${m.message}`)
          .join("\n");
      }
    } catch {}
    return transcript.slice(0, 500);
  }

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !logs || logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PhoneCall className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground" data-testid="text-no-call-logs">No call logs yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Call logs will appear here after voice calls are completed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const preview = getTranscriptPreview(log.transcript);
            const isExpanded = expandedId === log.id;
            return (
              <Card key={log.id} data-testid={`card-call-log-${log.id}`}>
                <CardContent className="p-4">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    data-testid={`button-expand-call-${log.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${log.status === "completed" ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"}`}>
                        <PhoneCall className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {log.callerPhone || "Web Call"}
                          <Badge className={`ml-2 no-default-hover-elevate no-default-active-elevate ${log.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
                            {log.status}
                          </Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(log.createdAt)} · {formatDuration(log.duration)}
                          {log.cost ? ` · $${log.cost}` : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {log.summary && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Summary</p>
                          <p className="text-sm" data-testid={`text-call-summary-${log.id}`}>{log.summary}</p>
                        </div>
                      )}
                      {log.endedReason && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Ended Reason</p>
                          <p className="text-sm">{log.endedReason}</p>
                        </div>
                      )}
                      {preview && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Transcript</p>
                          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs" data-testid={`text-call-transcript-${log.id}`}>
                            {preview}
                          </pre>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Call ID: {log.callId}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InvoicesTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    reference: "",
    description: "",
    amount: "",
    stripePaymentUrl: "",
  });

  const generateLinkMutation = useMutation({
    mutationFn: async () => {
      const amountNum = parseFloat(form.amount);
      if (isNaN(amountNum) || amountNum <= 0) throw new Error("Please enter a valid invoice amount before generating a payment link.");
      if (!form.reference.trim()) throw new Error("Please enter an invoice reference before generating a payment link.");
      const res = await adminApiRequest("POST", "/api/admin/generate-payment-link", {
        amount: amountNum,
        reference: form.reference.trim(),
      });
      const data = await res.json();
      return data as { url: string };
    },
    onSuccess: (data) => {
      setForm(prev => ({ ...prev, stripePaymentUrl: data.url }));
      toast({ title: "Payment link generated!", description: "The Stripe payment link has been auto-filled below." });
    },
    onError: (err: any) => {
      toast({ title: "Failed to generate link", description: err.message || "Please try again.", variant: "destructive" });
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const amountNum = parseFloat(form.amount);
      if (isNaN(amountNum) || amountNum <= 0) throw new Error("Please enter a valid amount");
      await adminApiRequest("POST", "/api/admin/send-invoice", {
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        clientAddress: form.clientAddress,
        reference: form.reference,
        description: form.description,
        amount: amountNum,
        stripePaymentUrl: form.stripePaymentUrl || undefined,
      });
    },
    onSuccess: () => {
      toast({ title: "Invoice sent!", description: "The invoice email has been delivered to the client and the team." });
      setForm({ clientName: "", clientEmail: "", clientPhone: "", clientAddress: "", reference: "", description: "", amount: "", stripePaymentUrl: "" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to send invoice", description: err.message || "Please try again.", variant: "destructive" });
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName || !form.clientEmail || !form.clientPhone || !form.clientAddress || !form.reference || !form.amount) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Send Deposit Invoice</h2>
              <p className="text-sm text-muted-foreground">Fill in the client details and click Send Invoice to email a deposit invoice with Zelle payment instructions and an optional online payment button.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-invoice">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="e.g. Gregg A. Erickson"
                  data-testid="input-client-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail">Client Email <span className="text-red-500">*</span></Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={form.clientEmail}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  data-testid="input-client-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="clientPhone">Client Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  value={form.clientPhone}
                  onChange={handleChange}
                  placeholder="(510) 555-0100"
                  data-testid="input-client-phone"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount">Deposit Amount ($) <span className="text-red-500">*</span></Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="350.00"
                  data-testid="input-invoice-amount"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clientAddress">Client Address <span className="text-red-500">*</span></Label>
              <Input
                id="clientAddress"
                name="clientAddress"
                value={form.clientAddress}
                onChange={handleChange}
                placeholder="123 Main St, Oakland, CA 94601"
                data-testid="input-client-address"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reference">Invoice Reference <span className="text-red-500">*</span></Label>
              <Input
                id="reference"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="e.g. EV Meter Installation Proposal (Phase 1 - Permitting & Submittals)"
                data-testid="input-invoice-reference"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Additional details or notes for the client..."
                rows={3}
                data-testid="textarea-invoice-description"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stripePaymentUrl">Online Payment Link (Stripe) <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <div className="flex gap-2">
                <Input
                  id="stripePaymentUrl"
                  name="stripePaymentUrl"
                  type="url"
                  value={form.stripePaymentUrl}
                  onChange={handleChange}
                  placeholder="https://buy.stripe.com/..."
                  data-testid="input-stripe-payment-url"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateLinkMutation.mutate()}
                  disabled={generateLinkMutation.isPending}
                  data-testid="button-generate-payment-link"
                >
                  {generateLinkMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Fill in amount and reference, then click Generate to auto-create a Stripe payment link.</p>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Zelle Payment Info Included</p>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">The invoice will include Zelle payment options: +1 (510) 706-8246 · +1 (510) 710-5745 · roberto@vivaes.net, plus a showcase of Viva's services.</p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
              data-testid="button-send-invoice"
            >
              {mutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invoice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const token = getAdminToken();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!token,
  });

  if (!token) {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage leads and appointments</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>

      <div className="mb-8">
        <StatsBar stats={stats} isLoading={statsLoading} />
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList data-testid="tabs-admin">
          <TabsTrigger value="leads" data-testid="tab-leads">
            <Users className="mr-2 h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="appointments" data-testid="tab-appointments">
            <CalendarDays className="mr-2 h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="call-logs" data-testid="tab-call-logs">
            <PhoneCall className="mr-2 h-4 w-4" />
            Call Logs
          </TabsTrigger>
          <TabsTrigger value="invoices" data-testid="tab-invoices">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadsTab />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>

        <TabsContent value="call-logs">
          <CallLogsTab />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
