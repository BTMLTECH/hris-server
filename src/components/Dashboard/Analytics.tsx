import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  AreaChart,
  Area,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Award,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import { IAnalytics } from "@/types/user";
import { useAppSelector } from "@/store/hooks";

const Analytics: React.FC = () => {
  const { analytics } = useAppSelector((state) => state.profile);
  // Destructure the data from the analytics prop
  const salaryByRoleData = analytics?.salaryDistributionByRole || [];
  const leaveTypesData = analytics?.leaveTypesData || [];
  const hiringTrendsData = analytics?.hiringTrends || [];
  const attendanceData = analytics?.attendanceData || [];
  const salaryByDeptData = analytics?.salaryDistributionByDept || [];

  // Chart configurations for tooltips
  const chartConfig = {
    employees: { label: "Employees", color: "#3B82F6" },
    hires: { label: "New Hires", color: "#10B981" },
    terminations: { label: "Terminations", color: "#EF4444" },
    attendance: { label: "Attendance %", color: "#8B5CF6" },
    avgSalary: { label: "Average Salary", color: "#F59E0B" },
    used: { label: "Used Leave", color: "#3B82F6" },
    total: { label: "Total Allocated", color: "#E5E7EB" },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Detailed insights and key metrics for your organization.
        </p>
      </div>

      {/* Key Metrics - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Employee Growth
            </CardTitle>
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">
              {analytics?.keyMetrics?.employeeGrowth?.value || "0"}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.keyMetrics?.employeeGrowth?.trend ||
                "vs last quarter"}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Avg. Salary
            </CardTitle>
            <span className="text-green-600 text-sm lg:text-base flex items-center">
              ₦
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">
              ₦
              {analytics?.keyMetrics?.avgSalary?.value?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.keyMetrics?.avgSalary?.trend || "0"}
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-3 w-3 lg:h-4 lg:w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">
              {analytics?.dashboardCards?.totalEmployees?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.dashboardCards?.totalEmployees?.trend ||
                "based on current data"}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Leave Utilization
            </CardTitle>
            <Activity className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">
              {analytics?.keyMetrics?.leaveUtilization?.value || "0"}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.keyMetrics?.leaveUtilization?.trend ||
                "of allocated leave"}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Appraisals Due
            </CardTitle>
            <Award className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">
              {analytics?.dashboardCards?.appraisalsDue?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.dashboardCards?.appraisalsDue?.trend ||
                "last 30 days"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Responsive grid with 1 or 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hiring & Termination Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hiring & Termination Trends
            </CardTitle>
            <CardDescription className="text-sm">
              New hires vs. employee terminations over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {hiringTrendsData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={hiringTrendsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="hires"
                      fill="#10B981"
                      name="New Hires"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="terminations"
                      fill="#EF4444"
                      name="Terminations"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="hires"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No hiring data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monthly Attendance
            </CardTitle>
            <CardDescription className="text-sm">
              Average attendance percentage over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {attendanceData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis domain={[90, 100]} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      name="Attendance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No attendance data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Average Salary by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Average Salary by Department
            </CardTitle>
            <CardDescription className="text-sm">
              Compare average salaries across departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {salaryByDeptData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryByDeptData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="avgSalary"
                      fill="#F59E0B"
                      name="Avg Salary"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No salary data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Role Distribution
            </CardTitle>
            <CardDescription className="text-sm">
              Employee count by role.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {salaryByRoleData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryByRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, count }) => `${role}: ${count}`}
                      outerRadius={120}
                      dataKey="count"
                    >
                      {salaryByRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No role data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave Types Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Types Distribution
            </CardTitle>
            <CardDescription className="text-sm">
              Leave usage patterns across different types
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {leaveTypesData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={leaveTypesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="total"
                      fill="#E5E7EB"
                      name="Total Allocated"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="used"
                      fill="#3B82F6"
                      name="Used"
                      radius={[4, 4, 0, 0]}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No leave data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">
              Department Distribution
            </CardTitle>
            <CardDescription className="text-sm">
              Employee count by department
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {salaryByDeptData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryByDeptData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ department, employees }) =>
                        `${department}: ${employees}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {salaryByDeptData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${Math.random() * 360}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No department data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
