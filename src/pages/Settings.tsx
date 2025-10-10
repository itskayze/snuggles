import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings as SettingsIcon, User, CreditCard, Moon, Sun, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { authStore } from "@/stores/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentTier, setCurrentTier] = useState<'free' | 'monthly' | 'annual'>('free');

  useEffect(() => {
    const state = authStore.getState();
    if (!state.isAuthenticated) {
      navigate("/auth");
      return;
    }
    setUserName(state.user?.name || "");

    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, [navigate]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast.success(`${newMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      authStore.logout();
      toast.success("Account deleted");
      navigate("/");
    }
  };

  const membershipPlans = [
    {
      tier: 'free' as const,
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      features: [
        'Sleep & Cry Analyzer',
        'Emergency Guide',
        'Basic content access',
        'Limited insights',
      ],
    },
    {
      tier: 'monthly' as const,
      name: 'Monthly Plan',
      price: '$9.99',
      period: 'per month',
      features: [
        'All Free features',
        'Growth Tracker',
        'Nutrition Planner',
        'Parent Wellness tools',
        'Expert Content Hub',
        'Smart Insights',
        'SnugBot AI Assistant',
        'Priority support',
      ],
      popular: true,
    },
    {
      tier: 'annual' as const,
      name: 'Annual Plan',
      price: '$99.99',
      period: 'per year',
      features: [
        'All Monthly features',
        'Save 17% compared to monthly',
        'Advanced analytics',
        'Custom themes',
        'Early access to new features',
        'Premium support',
      ],
      bestValue: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={authStore.getState().user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  <Button onClick={handleUpdateProfile}>
                    Save Changes
                  </Button>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4">Security</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    Enable Two-Factor Authentication
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Security features available in production
                  </p>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-soft border-2 border-destructive/20 bg-destructive/5">
                <h3 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This action cannot be undone
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6">
              <Card className="p-6 gradient-card shadow-soft border-2 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Current Plan
                    </h3>
                    <p className="text-muted-foreground capitalize">{currentTier} Tier</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {currentTier === 'free' ? 'Free' : currentTier === 'monthly' ? '$9.99/mo' : '$99.99/yr'}
                  </Badge>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {membershipPlans.map((plan) => (
                  <Card
                    key={plan.tier}
                    className={`p-6 gradient-card shadow-soft border-2 relative ${
                      plan.popular ? 'border-primary shadow-medium' : ''
                    } ${plan.bestValue ? 'border-secondary shadow-medium' : ''}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    {plan.bestValue && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
                        Best Value
                      </Badge>
                    )}
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                      <div className="mb-2">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground"> {plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={currentTier === plan.tier ? 'outline' : 'default'}
                      disabled={currentTier === plan.tier}
                      onClick={() => {
                        setCurrentTier(plan.tier);
                        toast.success(`Switched to ${plan.name}`);
                      }}
                    >
                      {currentTier === plan.tier ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </Card>
                ))}
              </div>

              <Card className="p-6 gradient-card shadow-soft border-2">
                <p className="text-sm text-muted-foreground text-center">
                  All plans include a 7-day free trial. Cancel anytime, no questions asked.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">
                          {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Insights</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive daily personalized insights
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Milestone Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about developmental milestones
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Wellness Check-ins</Label>
                      <p className="text-xs text-muted-foreground">
                        Reminders to check in on your wellness
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-xs text-muted-foreground">
                        Share anonymized data for research
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your privacy is our priority. We never sell your personal data.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
