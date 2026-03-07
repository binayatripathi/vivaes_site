import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Lead, Appointment } from "@shared/schema";
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
} from "lucide-react";

interface AdminStats {
  totalLeads: number;
  newLeadsToday: number;
  pendingAppointments: number;
  completedJobs: number;
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
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
      await apiRequest("PATCH", `/api/admin/leads/${lead.id}/status`, { status: newStatus });
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
      await apiRequest("PATCH", `/api/admin/appointments/${appointment.id}/status`, { status: newStatus });
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
      const res = await fetch(url, { credentials: "include" });
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
      const res = await fetch(url, { credentials: "include" });
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

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage leads and appointments</p>
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
        </TabsList>

        <TabsContent value="leads">
          <LeadsTab />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
