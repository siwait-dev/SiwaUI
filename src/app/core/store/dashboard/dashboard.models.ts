export interface RecentActivityItem {
  timestamp: string;
  userEmail: string | null;
  method: string;
  path: string;
  statusCode: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeThisWeek: number;
  auditLast24h: number;
  recentActivity: RecentActivityItem[];
}

export interface LiveNotification {
  email: string;
  time: Date;
}
