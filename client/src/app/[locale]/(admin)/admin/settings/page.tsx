"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save, Upload, Globe, Mail, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const t = useTranslations("admin.settings");
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: t("tabs.general"), icon: Globe },
    { id: "email", label: t("tabs.email"), icon: Mail },
    { id: "security", label: t("tabs.security"), icon: Shield },
    { id: "database", label: t("tabs.database"), icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("general.title")}</CardTitle>
              <CardDescription>
                Manage your applications basic settings and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">{t("general.siteName")} *</Label>
                  <Input
                    id="siteName"
                    defaultValue="Cube Store"
                    placeholder="Enter site name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">
                    {t("general.siteDescription")}
                  </Label>
                  <Input
                    id="siteDescription"
                    defaultValue="Your one-stop shop for everything"
                    placeholder="Enter site description"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("general.siteLogo")}</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline">{t("general.uploadLogo")}</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Application Settings</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for orders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("email.title")}</CardTitle>
              <CardDescription>
                Configure email settings for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">{t("email.smtpHost")} *</Label>
                  <Input id="smtpHost" placeholder="smtp.example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">{t("email.smtpPort")} *</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    defaultValue="587"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("email.username")} *</Label>
                  <Input id="username" placeholder="your-email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("email.password")} *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Templates</h4>

                <div className="space-y-2">
                  <Label htmlFor="welcomeEmail">Welcome Email Subject</Label>
                  <Input
                    id="welcomeEmail"
                    defaultValue="Welcome to Cube Store!"
                    placeholder="Enter welcome email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderEmail">Order Confirmation Subject</Label>
                  <Input
                    id="orderEmail"
                    defaultValue="Your Order Confirmation - #{orderNumber}"
                    placeholder="Enter order confirmation subject"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security settings and authentication options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Authentication</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for admin accounts
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Policy</h4>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Password Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      defaultValue="8"
                      min="6"
                      max="32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      defaultValue="5"
                      min="3"
                      max="10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain special characters
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>
                Manage database backup and maintenance settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Backup Settings</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable daily automatic backups
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupRetention">
                    Backup Retention (days)
                  </Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    defaultValue="30"
                    min="7"
                    max="365"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Maintenance</h4>

                <div className="flex gap-3">
                  <Button variant="outline">Run Database Cleanup</Button>
                  <Button variant="outline">Optimize Tables</Button>
                  <Button variant="outline">Create Backup Now</Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="text-sm font-medium mb-2">Database Status</h5>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Size:</span>
                      <span>2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span>2024-08-04 03:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          {t("actions.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
