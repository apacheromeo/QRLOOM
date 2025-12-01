import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, QrCode, TrendingUp, Activity } from 'lucide-react';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
    // Mock System Stats
    const stats = [
        {
            title: 'Total Users',
            value: '1,234',
            change: '+12% from last month',
            icon: Users,
        },
        {
            title: 'Total QR Codes',
            value: '5,678',
            change: '+23% from last month',
            icon: QrCode,
        },
        {
            title: 'Active Subscriptions',
            value: '892',
            change: '+5% from last month',
            icon: TrendingUp,
        },
        {
            title: 'System Health',
            value: '99.9%',
            change: 'All systems operational',
            icon: Activity,
        },
    ];

    // Mock Analytics Data
    const mockAnalytics = {
        dailyScans: [
            { date: 'Mon', count: 1200 },
            { date: 'Tue', count: 1800 },
            { date: 'Wed', count: 1500 },
            { date: 'Thu', count: 2500 },
            { date: 'Fri', count: 3200 },
            { date: 'Sat', count: 4500 },
            { date: 'Sun', count: 2000 },
        ],
        deviceType: [
            { name: 'Mobile', value: 8500 },
            { name: 'Desktop', value: 1000 },
            { name: 'Tablet', value: 500 },
        ],
        locations: [
            { name: 'USA', value: 4500 },
            { name: 'UK', value: 2000 },
            { name: 'Germany', value: 1500 },
            { name: 'France', value: 1000 },
            { name: 'Other', value: 1000 },
        ],
    };

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    System overview and statistics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* System Analytics */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">System Analytics</h2>
                <AnalyticsCharts data={mockAnalytics} />
            </div>
        </div>
    );
}
