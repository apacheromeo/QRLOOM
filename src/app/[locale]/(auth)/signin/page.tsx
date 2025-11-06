import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/signin-form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  const t = await getTranslations('auth.signIn');

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <OAuthButtons />
        </CardContent>
      </Card>
    </div>
  );
}
