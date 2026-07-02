import { Award, BriefcaseBusiness, MapPin, PencilLine, Plus, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { profileHighlights, userProfile } from "@/data/mock";

type ProfileViewProps = {
  user?: { fullName?: string; email?: string; role?: string } | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

function ProfileView({ user }: ProfileViewProps) {
  const displayName = user?.fullName?.trim() || userProfile.name;
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : userProfile.role;
  const initials = getInitials(displayName);

  return (
    <>
      <aside className="space-y-6">
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-slate-950 via-slate-800 to-sky-700" />
          <CardContent className="-mt-12 p-6">
            <div className="flex items-end justify-between gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-soft">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="rounded-full">
                <PencilLine className="h-4 w-4" />
                Edit profile
              </Button>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl font-black text-slate-950">{displayName}</h2>
              <p className="mt-1 text-sm font-semibold text-sky-700">{roleLabel}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {userProfile.location}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">{userProfile.about}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {userProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="text-sm font-semibold text-slate-500">Profile insights</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {profileHighlights.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
                <span className="font-black text-slate-950">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">Profile overview</div>
                <div className="text-2xl font-black text-slate-950">Career snapshot</div>
              </div>
              <Button variant="outline" className="rounded-full">
                <Plus className="h-4 w-4" />
                Add section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              ["Featured", "Case studies and product launches"],
              ["Open to", "Advisory, mentoring, and speaking"],
              ["Availability", "Reply within 24 hours"],
            ].map(([title, value]) => (
              <div key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-500">{title}</div>
                <div className="mt-2 text-base font-bold text-slate-950">{value}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">Experience</div>
                <div className="text-2xl font-black text-slate-950">What I have built</div>
              </div>
              <Button variant="outline" className="rounded-full">
                <BriefcaseBusiness className="h-4 w-4" />
                Add experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {userProfile.experience.map((item, index) => (
              <div key={item.title}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    {index === 0 ? <Rocket className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                      <Badge variant="secondary">{item.period}</Badge>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-sky-700">{item.company}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </div>
                </div>
                {index !== userProfile.experience.length - 1 ? <Separator className="mt-5 h-px w-full" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-500">Highlights</div>
            <div className="text-2xl font-black text-slate-950">Trusted by teams</div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              ["Thoughtful leadership", "Mentored 20+ product designers and PMs."],
              ["System design", "Built reusable workflows across design, PM, and engineering."],
              ["Speaking", "Presented product craft stories at three industry events."],
              ["Impact", "Improved activation by 31% across two launch cycles."],
            ].map(([title, value]) => (
              <div key={title} className="rounded-3xl bg-gradient-to-br from-slate-50 to-white p-5">
                <div className="text-base font-bold text-slate-950">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-500">Open to work</div>
            <div className="text-lg font-black text-slate-950">Recruiting visibility</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Let recruiters see your profile status, preferred roles, and current focus areas without compromising privacy.
            </div>
            <Button className="w-full rounded-full">Update preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-500">About</div>
            <div className="text-lg font-black text-slate-950">Professional summary</div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>{userProfile.about}</p>
            <p>
              Available for product strategy, mentoring, and workshops focused on clarity, scale, and impact.
            </p>
          </CardContent>
        </Card>
      </aside>
    </>
  );
}

export { ProfileView };
