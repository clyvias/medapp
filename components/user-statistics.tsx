import React from "react";
import { getUserStatistics, getWeeklyStatistics } from "@/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const UserStatistics = async () => {
  const todayStats = await getUserStatistics();
  const weeklyStats = await getWeeklyStatistics();

  const totalCardsReviewed =
    weeklyStats?.reduce((sum, day) => sum + day.cardsReviewed, 0) || 0;
  const averageCardsPerDay = totalCardsReviewed / 7;

  const totalTimeStudied =
    weeklyStats?.reduce((sum, day) => sum + day.timeStudied, 0) || 0;
  const averageTimePerDay = totalTimeStudied / 7 / 60; // Convert to minutes

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cards Reviewed Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayStats?.cardsReviewed || 0}
          </div>
          <Progress
            value={
              ((todayStats?.cardsReviewed || 0) / averageCardsPerDay) * 100
            }
            className="mt-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Time Studied Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((todayStats?.timeStudied || 0) / 60)} min
          </div>
          <Progress
            value={
              ((todayStats?.timeStudied || 0) / 60 / averageTimePerDay) * 100
            }
            className="mt-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayStats?.streakDays || 0} days
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(averageCardsPerDay)} cards/day
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(averageTimePerDay)} min/day
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
