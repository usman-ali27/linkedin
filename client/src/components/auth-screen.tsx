import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = SignInPayload & {
  fullName: string;
};

type AuthScreenProps = {
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
  onSignIn: (payload: SignInPayload) => Promise<boolean>;
  onSignUp: (payload: SignUpPayload) => Promise<boolean>;
  authError?: string;
  isLoading?: boolean;
};

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
});

type AuthFormValues = z.infer<typeof signUpSchema>;

function AuthScreen({ authMode, setAuthMode, onSignIn, onSignUp, authError, isLoading }: AuthScreenProps) {
  const resolver = useMemo(
    () => (authMode === "signin" ? (zodResolver(signInSchema) as any) : zodResolver(signUpSchema)),
    [authMode],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver,
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<AuthFormValues> = async (values) => {
    if (authMode === "signin") {
      await onSignIn({ email: values.email, password: values.password });
      return;
    }

    await onSignUp(values);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-55" />
      <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="absolute right-[-8%] top-24 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="animate-fadeUp">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-soft backdrop-blur">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Network Pro</span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Build your next
              <span className="block bg-gradient-to-r from-sky-600 via-cyan-600 to-slate-900 bg-clip-text text-transparent">
                professional network
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A LinkedIn-inspired experience with premium authentication, a curated feed, profile storytelling, and post interactions designed for modern professionals.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["74k+", "monthly impressions"],
                ["12 min", "average dwell time"],
                ["91%", "profile completion"],
              ].map(([value, label]) => (
                <Card key={label} className="border-white/70 bg-white/80">
                  <CardContent className="p-5">
                    <div className="text-2xl font-black text-slate-900">{value}</div>
                    <p className="mt-1 text-sm text-slate-500">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {["Feed", "Profile", "Messaging", "Recruiting"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="animate-fadeUp">
            <Card className="overflow-hidden border-white/70 bg-white/85 shadow-glow backdrop-blur-2xl">
              <CardContent className="p-0">
                <div className="border-b border-border/80 bg-gradient-to-r from-slate-950 to-slate-700 px-8 py-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-black">
                      NP
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.32em] text-white/60">
                        Secure access
                      </div>
                      <h2 className="mt-1 text-2xl font-bold">Sign in to continue</h2>
                    </div>
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
                    Quickly access your professional feed, profile analytics, and relationship graph from one polished workspace.
                  </p>
                </div>

                <div className="px-8 py-8">
                  <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")}> 
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                      <TabsTrigger value="signin">Sign in</TabsTrigger>
                      <TabsTrigger value="signup">Create account</TabsTrigger>
                    </TabsList>

                    {authError ? (
                      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {authError}
                      </div>
                    ) : null}

                    <TabsContent value="signin">
                      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                          <Input
                            placeholder="Work email"
                            type="email"
                            {...register("email")}
                          />
                          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
                        </div>
                        <div>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...register("password")}
                          />
                          {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-border" />
                            Remember me
                          </label>
                          <button type="button" className="font-semibold text-primary hover:underline">
                            Forgot password?
                          </button>
                        </div>
                        <Button className="h-12 w-full text-base" type="submit" disabled={isLoading}>
                          Continue to dashboard
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                          <Input placeholder="Full name" {...register("fullName")} />
                          {errors.fullName ? <p className="mt-2 text-sm text-rose-600">{errors.fullName.message}</p> : null}
                        </div>
                        <div>
                          <Input placeholder="Work email" type="email" {...register("email")} />
                          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
                        </div>
                        <div>
                          <Input placeholder="Create password" type="password" {...register("password")} />
                          {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}
                        </div>
                        <Button className="h-12 w-full text-base" type="submit" disabled={isLoading}>
                          Create professional profile
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
                    {[
                      "Verified profiles",
                      "Premium feed ranking",
                      "Privacy-first design",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export { AuthScreen };
