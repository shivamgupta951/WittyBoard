import { db, projects, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { MAX_WORKSPACES } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (user) {
    const userData = await db
      .select()
      .from(users)
      //@ts-ignore
      .where(eq(user.primaryEmailAddress?.emailAddress, users.email));

    if (userData?.length > 0) {
      const projectCount = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.userEmail, userData[0].email));
      const remainingCredits = Math.max(
        0,
        MAX_WORKSPACES - Number(projectCount[0]?.count ?? 0),
      );
      const result = await db
        .update(users)
        .set({ credits: remainingCredits })
        .where(eq(users.email, userData[0].email))
        .returning();

      return NextResponse.json(result[0]);
    } else {
      const result = await db
        .insert(users)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          credits: MAX_WORKSPACES,
        })
        .returning();

        return NextResponse.json(result[0]);
    }
  }

  return NextResponse.json({message: "User Not Found!"},{status:404});
}
