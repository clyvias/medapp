import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactUserStatistics } from "@/components/compact-user-statistics";

const QuestsPage = async () => {
  const userProgressData = getUserProgress();

  const [userProgress] = await Promise.all([userProgressData]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/quests.svg" alt="quests" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Misiones y Estadísticas
          </h1>
          <CompactUserStatistics className="mb-6" />
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Misiones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {quests.map((quest) => {
                  const progress = (userProgress.points / quest.value) * 100;

                  return (
                    <li key={quest.title} className="flex items-center gap-x-4">
                      <Image
                        src="/points.svg"
                        alt="puntos"
                        width={40}
                        height={40}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{quest.title}</p>
                        <Progress value={progress} className="h-2 mt-2" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
