import { NextResponse } from "next/server";
import {
  dbListCommunity,
  dbListExperiences,
  dbListForumThreads,
  dbListHotels,
  dbListMeetups,
  dbListNightlife,
  dbListRoutes
} from "@/lib/catalog";

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type") ?? "all";

  if (type === "hotels") return NextResponse.json({ hotels: await dbListHotels() });
  if (type === "experiences") return NextResponse.json({ experiences: await dbListExperiences() });
  if (type === "routes") return NextResponse.json({ routes: await dbListRoutes() });
  if (type === "nightlife") return NextResponse.json({ nightlife: await dbListNightlife() });
  if (type === "hangouts") return NextResponse.json({ hangouts: await dbListMeetups() });
  if (type === "community") return NextResponse.json({ community: await dbListCommunity() });
  if (type === "forum") return NextResponse.json({ threads: await dbListForumThreads() });

  return NextResponse.json({
    hotels: await dbListHotels(),
    experiences: await dbListExperiences(),
    routes: await dbListRoutes(),
    nightlife: await dbListNightlife(),
    hangouts: await dbListMeetups(),
    community: await dbListCommunity(),
    forum: await dbListForumThreads()
  });
}
