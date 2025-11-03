import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  BookOpen, 
  Building2,
  TrendingUp,
  Eye,
  MessageSquare,
  DollarSign,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalPlaces: number;
  totalPosts: number;
  totalMarketplaceItems: number;
  totalCampaigns: number;
  totalNGOs: number;
  totalEducationModules: number;
  aiInteractions: number;
  weeklyGrowth: {
    users: number;
    places: number;
    posts: number;
    interactions: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        totalUsers: 15847,
        totalPlaces: 2341,
        totalPosts: 8562,
        totalMarketplaceItems: 1234,
        totalCampaigns: 67,
        totalNGOs: 89,
        totalEducationModules: 156,
        aiInteractions: 45623,
        weeklyGrowth: {
          users: 12.5,
          places: 8.3,
          posts: 15.7,
          interactions: 23.1
        },
        topCategories: [
          { name: 'Hospitals', count: 487, percentage: 20.8 },
          { name: 'Restaurants', count: 356, percentage: 15.2 },
          { name: 'Schools', count: 298, percentage: 12.7 },
          { name: 'Parks', count: 245, percentage: 10.5 },
          { name: 'Shopping', count: 198, percentage: 8.5 }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'place_added',
            description: 'New accessible hospital added to directory',
            timestamp: '2 minutes ago',
            user: 'Dr. Sarah Johnson'
          },
          {
            id: '2',
            type: 'campaign_funded',
            description: 'Playground accessibility campaign reached 80% funding',
            timestamp: '15 minutes ago'
          },
          {
            id: '3',
            type: 'ai_interaction',
            description: 'AI assisted with location finding for wheelchair user',
            timestamp: '28 minutes ago'
          },
          {
            id: '4',
            type: 'post_created',
            description: 'Community member shared accessibility review',
            timestamp: '45 minutes ago',
            user: 'Alex Rodriguez'
          },
          {
            id: '5',
            type: 'ngo_registered',
            description: 'New NGO "Access For All" joined the platform',
            timestamp: '1 hour ago'
          }
        ]
      };
      
      setAnalytics(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
          <Button onClick={fetchAnalytics}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">InclusiveHub Analytics</h1>
              <p className="text-muted-foreground mt-2">
                Real-time insights into platform usage and accessibility impact
              </p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.weeklyGrowth.users}%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accessible Places</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPlaces.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.weeklyGrowth.places}%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.aiInteractions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.weeklyGrowth.interactions}%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">{analytics.totalCampaigns - 12}</span> new this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Modules
              </CardTitle>
              <CardDescription>
                Distribution of content across different platform areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Places Directory</span>
                </div>
                <span className="font-semibold">{analytics.totalPlaces}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community Posts</span>
                </div>
                <span className="font-semibold">{analytics.totalPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Marketplace Items</span>
                </div>
                <span className="font-semibold">{analytics.totalMarketplaceItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">NGO Partners</span>
                </div>
                <span className="font-semibold">{analytics.totalNGOs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-500" />
                  <span className="text-sm">Education Modules</span>
                </div>
                <span className="font-semibold">{analytics.totalEducationModules}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Place Categories
              </CardTitle>
              <CardDescription>
                Most popular types of accessible locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topCategories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.count}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Platform Activity
            </CardTitle>
            <CardDescription>
              Latest actions and updates across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'place_added' && <MapPin className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'campaign_funded' && <DollarSign className="h-4 w-4 text-green-500" />}
                    {activity.type === 'ai_interaction' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'post_created' && <Eye className="h-4 w-4 text-orange-500" />}
                    {activity.type === 'ngo_registered' && <Building2 className="h-4 w-4 text-teal-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      {activity.user && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <Badge variant="secondary" className="text-xs">{activity.user}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Impact Metrics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Gemini AI Impact
              </CardTitle>
              <CardDescription>
                How AI is improving accessibility experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.aiInteractions.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total AI Interactions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    94%
                  </div>
                  <p className="text-sm text-muted-foreground">User Satisfaction Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    2.3s
                  </div>
                  <p className="text-sm text-muted-foreground">Average Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}