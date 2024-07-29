import React from "react";
import { getUserStatistics, getWeeklyStatistics } from "@/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BarChart2, Zap, Calendar } from "lucide-react";

export const CompactUserStatistics = async ({
  className = "",
}: {
  className?: string;
}) => {
  const todayStats = await getUserStatistics();
  const weeklyStats = await getWeeklyStatistics();

  const totalCardsReviewed =
    weeklyStats?.reduce((sum, day) => sum + day.cardsReviewed, 0) || 0;
  const averageCardsPerDay = Math.round(totalCardsReviewed / 7);

  const totalTimeStudied =
    weeklyStats?.reduce((sum, day) => sum + day.timeStudied, 0) || 0;
  const averageTimePerDay = Math.round(totalTimeStudied / 7 / 60); // Convert to minutes

  return (
    <Card className={`w-full bg-white shadow-sm ${className}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Tu progreso</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<BarChart2 className="w-4 h-4 text-blue-500" />}
            label="Tarjetas repasadas"
            value={todayStats?.cardsReviewed || 0}
          />
          <StatItem
            icon={<Clock className="w-4 h-4 text-green-500" />}
            label="Tiempo estudiado"
            value={`${Math.round((todayStats?.timeStudied || 0) / 60)} min`}
          />
          <StatItem
            icon={<Zap className="w-4 h-4 text-yellow-500" />}
            label="Racha actual"
            value={`${todayStats?.streakDays || 0} días`}
          />
          <StatItem
            icon={<Calendar className="w-4 h-4 text-purple-500" />}
            label="Promedio semanal"
            value={`${averageCardsPerDay} tarjetas`}
            subValue={`${averageTimePerDay} min/día`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StatItem = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
}) => (
  <div className="flex items-center space-x-2">
    {icon}
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </div>
  </div>
);
