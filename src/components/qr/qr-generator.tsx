'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const t = useTranslations('qr.generator');

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 2MB)
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
    // Validate URL
    if (!dataUrl.trim()) {
      setError('Please enter a URL or text');
      return;
    }

    if (!isValidUrl(dataUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setError(null);
    setIsGenerating(true);

    // Create QR options
    const options: QRCodeOptions = {
      data: dataUrl,
      format,
      foregroundColor,
      backgroundColor,
      logo: logo || null,
      width: 512,
      height: 512,
    };

    setQrOptions(options);

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  }, [dataUrl, format, foregroundColor, backgroundColor, logo]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL or Text</Label>
            <Input
              id="url"
              type="text"
              placeholder={t('urlPlaceholder')}
              value={dataUrl}
              onChange={(e) => setDataUrl(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">{t('format')}</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as QRFormat)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <Label>{t('colors')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foreground" className="text-sm">
                  {t('foreground')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background" className="text-sm">
                  {t('background')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>{t('logo')}</Label>
            {!logoPreview ? (
              <div className="flex items-center gap-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="logo"
                  className="flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {t('uploadLogo')}
                </Label>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-10 w-10 object-contain"
                />
                <span className="flex-1 text-sm truncate">{logo?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Dynamic QR Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="dynamic">{t('dynamic')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('dynamicHelp')}
              </p>
            </div>
            <Switch
              id="dynamic"
              checked={isDynamic}
              onCheckedChange={setIsDynamic}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            className="w-full"
            size="lg"
            disabled={isGenerating}
          >
            {qrOptions ? t('regenerate') : t('generate')}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <QRPreview
        options={qrOptions}
        isGenerating={isGenerating}
        onDownload={() => {
          // Handle download tracking here if needed
        }}
      />
    </div>
  );
}
