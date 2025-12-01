'use client';

import { useState, useCallback } from 'react';
// import { useTranslations } from 'next-intl';
import { Upload, X, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { QRPreview } from './qr-preview';
import { isValidUrl } from '@/lib/qr-generator';
import type { QRCodeOptions, QRFormat } from '@/types';

export function QRGenerator() {
  // const t = useTranslations('qr.generator');

  const [dataUrl, setDataUrl] = useState('');
  const [format, setFormat] = useState<QRFormat>('png');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDynamic, setIsDynamic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrOptions, setQrOptions] = useState<QRCodeOptions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file size must be less than 2MB');
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleGenerate = useCallback(() => {
    let input = dataUrl.trim();
    if (!input) {
      setError('Please enter a URL or text');
      return;
    }

    // Auto-prepend https:// if it looks like a domain but missing protocol
    const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (domainRegex.test(input) && !input.startsWith('http://') && !input.startsWith('https://')) {
      input = `https://${input}`;
      setDataUrl(input); // Update input field to show corrected URL
    }

    // Basic validation - if it's not a URL, we treat it as text (which is valid for QR)
    // But if the user intends a URL, we want to ensure it's valid
    if (input.startsWith('http://') || input.startsWith('https://')) {
      if (!isValidUrl(input)) {
        setError('Please enter a valid URL');
        return;
      }
    }

    setError(null);
    setIsGenerating(true);

    // If Dynamic is enabled, generate a mock short URL
    let finalData = input;
    if (isDynamic) {
      // In a real app, we would call an API to create the short link here
      // For now, we'll use a mock short code 'abc' which redirects to example.com
      // or just append a random string to simulate a unique code
      const mockShortCode = 'abc'; // Fixed for demo purposes to match route.ts
      finalData = `${window.location.origin}/r/${mockShortCode}`;
    }

    const options: QRCodeOptions = {
      data: finalData,
      format,
      foregroundColor,
      backgroundColor,
      logo: logo || null,
      width: 512,
      height: 512,
    };

    setQrOptions(options);
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  }, [dataUrl, format, foregroundColor, backgroundColor, logo, isDynamic]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* Form Section */}
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create QR Code</CardTitle>
            <CardDescription>
              Customize your QR code with colors, logo, and format options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                URL or Text
              </Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={dataUrl}
                onChange={(e) => setDataUrl(e.target.value)}
                className="h-11"
              />
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </div>

            {/* Format and Dynamic */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm font-medium">
                  Export Format
                </Label>
                <Select value={format} onValueChange={(value) => setFormat(value as QRFormat)}>
                  <SelectTrigger id="format" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG Image</SelectItem>
                    <SelectItem value="svg">SVG Vector</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Dynamic QR Code</Label>
                <div className="flex h-11 items-center gap-2 rounded-md border px-3">
                  <Switch
                    id="dynamic"
                    checked={isDynamic}
                    onCheckedChange={setIsDynamic}
                  />
                  <Label htmlFor="dynamic" className="text-sm cursor-pointer flex-1">
                    Enable dynamic updates
                  </Label>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Color Scheme</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fg" className="text-xs text-muted-foreground">
                    Foreground Color
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Input
                        id="fg"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="h-11 w-16 cursor-pointer p-1"
                      />
                    </div>
                    <Input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="h-11 flex-1 font-mono text-sm uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg" className="text-xs text-muted-foreground">
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Input
                        id="bg"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-11 w-16 cursor-pointer p-1"
                      />
                    </div>
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-11 flex-1 font-mono text-sm uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Logo (Optional)</Label>
              {!logoPreview ? (
                <>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo"
                    className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload logo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 2MB
                    </span>
                  </Label>
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                    <img src={logoPreview} alt="Logo" className="h-10 w-10 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{logo?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {logo?.size ? `${(logo.size / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveLogo}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              className="w-full h-11"
              size="lg"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {qrOptions ? 'Regenerate QR Code' : 'Generate QR Code'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <QRPreview
          options={qrOptions}
          isGenerating={isGenerating}
          onDownload={() => { }}
        />
      </div>
    </div>
  );
}
