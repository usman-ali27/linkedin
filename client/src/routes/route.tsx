import { useEffect, useMemo } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "@/lib/api";
import { AuthScreen } from "@/components/auth-screen";
import { AppShell } from "@/components/app-shell";
import { Feed } from "@/components/feed";
import { ProfileView } from "@/components/profile";
import {
  useAppStore,
  type AuthPayload,
  type SignUpPayload,
} from "@/store/use-app-store";

function PagePlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-950">{title}</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">{subtitle}</p>
    </section>
  );
}

function getErrorMessage(error: unknown) {
  const response = (error as any)?.response;
  return (
    (response?.data?.message as string) ??
    (error as any)?.message ??
    "Unable to connect to the authentication service."
  );
}

export function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authenticated,
    authMode,
    authError,
    isLoading,
    user,
    setAuthenticated,
    setAuthMode,
    setAuthError,
    setIsLoading,
    setUser,
    clearSession,
    resetFeed,
    loadFeedPage,
    createPost,
    toggleLike,
    addComment,
  } = useAppStore();

  const activePath = useMemo(
    () => location.pathname || "/feed",
    [location.pathname],
  );

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await api.get("/auth/me");
        if (isMounted) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
          setAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem("user");
          setUser(null);
          setAuthenticated(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [setAuthenticated, setUser]);

  const handleSignIn = async (payload: AuthPayload) => {
    setIsLoading(true);
    setAuthError(undefined);

    try {
      const response = await api.post("/auth/login", payload);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setAuthenticated(true);
      navigate("/feed", { replace: true });
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (payload: SignUpPayload) => {
    setIsLoading(true);
    setAuthError(undefined);

    try {
      const response = await api.post("/auth/register", payload);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setAuthenticated(true);
      navigate("/feed", { replace: true });
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    await createPost(content, user);
  };

  useEffect(() => {
    if (authenticated) {
      void loadFeedPage();
    }
  }, [authenticated, loadFeedPage]);

  const handleToggleLike = async (postId: number) => {
    await toggleLike(postId);
  };

  const handleAddComment = (postId: number) => {
    void addComment(postId, user);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout failures and clear the client state anyway.
    }

    localStorage.removeItem("user");
    clearSession();
    setAuthenticated(false);
    setUser(null);
    resetFeed();
    navigate("/auth");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={authenticated ? "/feed" : "/auth"} replace />}
      />
      <Route
        path="/auth"
        element={
          authenticated ? (
            <Navigate to="/feed" replace />
          ) : (
            <AuthScreen
              authMode={authMode}
              setAuthMode={setAuthMode}
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              authError={authError}
              isLoading={isLoading}
            />
          )
        }
      />
      <Route
        path="/feed"
        element={
          authenticated ? (
            <AppShell
              activePath={activePath}
              user={user}
              onLogout={handleLogout}
            >
              <Feed />
            </AppShell>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          authenticated ? (
            <AppShell activePath={activePath} user={user}>
              <ProfileView user={user} />
            </AppShell>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/jobs"
        element={
          authenticated ? (
            <AppShell activePath={activePath}>
              <PagePlaceholder
                title="Jobs"
                subtitle="Browse career opportunities and company openings."
              />
            </AppShell>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/messages"
        element={
          authenticated ? (
            <AppShell activePath={activePath}>
              <PagePlaceholder
                title="Messaging"
                subtitle="View your conversations and notes."
              />
            </AppShell>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/notifications"
        element={
          authenticated ? (
            <AppShell activePath={activePath}>
              <PagePlaceholder
                title="Notifications"
                subtitle="See your alerts, mentions, and updates."
              />
            </AppShell>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={authenticated ? "/feed" : "/auth"} replace />}
      />
    </Routes>
  );
}
