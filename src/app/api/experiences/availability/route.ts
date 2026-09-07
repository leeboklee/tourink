import { NextResponse } from "next/server";
import { z } from "zod";
import { getExperienceProvider } from "@/lib/experiences";
import { canBookExperiences } from "@/lib/feature-flags";

const schema = z.object({
  experienceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  participants: z.coerce.number().int().min(1).max(12).default(2)
});

export async function GET(req: Request) {
  if (!canBookExperiences()) {
    return NextResponse.json(
      { error: "Experience booking is not available — partner provider keys required" },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const parsed = schema.safeParse({
    experienceId: url.searchParams.get("experienceId"),
    date: url.searchParams.get("date"),
    participants: url.searchParams.get("participants") ?? 2
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const provider = getExperienceProvider();
  const result = await provider.getAvailability({
    experienceId: parsed.data.experienceId,
    date: parsed.data.date,
    participants: parsed.data.participants
  });

  return NextResponse.json({
    ...result,
    providerDisplayName: provider.displayName,
    providerConfigured: provider.isConfigured()
  });
}
