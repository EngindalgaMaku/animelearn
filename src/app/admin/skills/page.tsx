import { prisma } from "@/lib/prisma";
// Temporary any-cast to avoid IDE type staleness after new Prisma models (safe to remove after IDE refresh)
const p: any = prisma;

function difficultyLabel(d: number | null | undefined) {
  const n = d ?? 1;
  if (n <= 1) return "Beginner";
  if (n === 2) return "Intermediate";
  return "Advanced";
}

function percent(n: number) {
  return `${Math.round(Math.max(0, Math.min(100, n)))}%`;
}

type SkillRow = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  difficulty: number | null;
  isActive: boolean;
  activities: { id: string }[];
  userMastery: { mastery: number | null }[];
};

export default async function AdminSkillsPage() {
  // Server component: fetch skills, activity mappings, and mastery aggregates
  const skills = (await p.skill.findMany({
    orderBy: [{ category: "asc" }, { difficulty: "asc" }, { name: "asc" }],
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      category: true,
      difficulty: true,
      isActive: true,
      activities: { select: { id: true } }, // ActivitySkill relation
      userMastery: { select: { mastery: true } }, // UserSkillMastery relation
    },
  })) as SkillRow[];

  const totals = {
    skills: skills.length,
    mappings: skills.reduce((s, sk) => s + (sk.activities?.length ?? 0), 0),
    masteryUsers: skills.reduce(
      (s, sk) => s + (sk.userMastery?.length ?? 0),
      0
    ),
    avgMasteryAll:
      skills.length > 0
        ? (() => {
            let sum = 0;
            let count = 0;
            for (const sk of skills) {
              for (const m of sk.userMastery ?? []) {
                sum += m.mastery ?? 0;
                count += 1;
              }
            }
            return count > 0 ? sum / count : 0;
          })()
        : 0,
  };

  return (
    <div className="space-y-6 p-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Skills & Mastery</h1>
        <div className="text-sm text-slate-900">
          Total Skills: <b>{totals.skills}</b> • Activity Mappings:{" "}
          <b>{totals.mappings}</b> • Mastery Users: <b>{totals.masteryUsers}</b>{" "}
          • Avg Mastery (global): <b>{percent(totals.avgMasteryAll)}</b>
        </div>
      </div>

      <div className="overflow-hidden rounded border">
        <div className="grid grid-cols-12 border-b bg-white text-xs font-semibold text-slate-900">
          <div className="col-span-2 p-3">Skill</div>
          <div className="col-span-3 p-3">Key</div>
          <div className="col-span-2 p-3">Category</div>
          <div className="col-span-1 p-3">Difficulty</div>
          <div className="col-span-1 p-3 text-right">Activities</div>
          <div className="col-span-1 p-3 text-right">Users</div>
          <div className="col-span-2 p-3 text-right">Avg Mastery</div>
        </div>

        {skills.length === 0 ? (
          <div className="p-6 text-slate-900">No skills found.</div>
        ) : (
          <div className="divide-y">
            {(skills as SkillRow[]).map((sk: SkillRow) => {
              const activitiesCount = sk.activities?.length ?? 0;
              const usersCount = sk.userMastery?.length ?? 0;
              const avg =
                usersCount > 0
                  ? sk.userMastery.reduce<number>(
                      (s: number, m: { mastery: number | null }) =>
                        s + (m.mastery ?? 0),
                      0
                    ) / usersCount
                  : 0;

              return (
                <div key={sk.id} className="grid grid-cols-12 text-sm">
                  <div className="col-span-2 p-3">
                    <div className="font-medium">{sk.name}</div>
                    <div className="truncate text-xs text-slate-900">
                      {sk.description || "-"}
                    </div>
                    {!sk.isActive && (
                      <div className="mt-1 inline-block rounded border border-slate-300 px-2 py-0.5 text-[10px] text-slate-900">
                        inactive
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 p-3">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs">
                      {sk.key}
                    </code>
                  </div>
                  <div className="col-span-2 p-3">{sk.category || "-"}</div>
                  <div className="col-span-1 p-3">
                    <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-900">
                      {difficultyLabel(sk.difficulty)}
                    </span>
                  </div>
                  <div className="col-span-1 p-3 text-right">
                    {activitiesCount}
                  </div>
                  <div className="col-span-1 p-3 text-right">{usersCount}</div>
                  <div className="col-span-2 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded bg-gray-200">
                        <div
                          className={`h-2 rounded ${
                            avg >= 80
                              ? "bg-green-500"
                              : avg >= 50
                                ? "bg-indigo-500"
                                : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.max(0, Math.min(100, avg))}%`,
                          }}
                        />
                      </div>
                      <div className="w-14 text-right text-xs text-slate-900">
                        {percent(avg)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-900">
        Note: Activity mappings are populated by the seeder. You can refine
        mappings and add more skills as needed. Mastery values update when
        activities are completed via the adaptive API.
      </div>
    </div>
  );
}
