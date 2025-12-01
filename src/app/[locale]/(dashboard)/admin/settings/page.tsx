'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState({
        siteName: 'QRLoom',
        supportEmail: 'support@qrloom.com',
        maintenanceMode: false,
        allowRegistrations: true,
        maxFreeQRCodes: 10,
    });

    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'System configuration updated successfully (Mock)',
        });
    };

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure global application settings
                </p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Configuration</CardTitle>
                        <CardDescription>
                            Basic settings for the application
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) =>
                                    setSettings({ ...settings, siteName: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input
                                id="supportEmail"
                                value={settings.supportEmail}
                                onChange={(e) =>
                                    setSettings({ ...settings, supportEmail: e.target.value })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Control */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Control</CardTitle>
                        <CardDescription>
                            Manage system availability and access
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Disable access for non-admin users
                                </p>
                            </div>
                            <Switch
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, maintenanceMode: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Allow Registrations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable new user signups
                                </p>
                            </div>
                            <Switch
                                checked={settings.allowRegistrations}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, allowRegistrations: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Limits</CardTitle>
                        <CardDescription>
                            Configure default limits for users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="maxFreeQRCodes">Max Free QR Codes</Label>
                            <Input
                                id="maxFreeQRCodes"
                                type="number"
                                value={settings.maxFreeQRCodes}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        maxFreeQRCodes: parseInt(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} size="lg">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
