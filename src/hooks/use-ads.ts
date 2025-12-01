import { useAuthStore } from '@/stores/auth-store';

export function useAds() {
    const { profile, loading } = useAuthStore();

    // Show ads if:
    // 1. Loading is finished AND
    // 2. Profile is null (not logged in) OR
    // 3. Profile plan is 'free'
    const showAds = !loading && (!profile || profile.plan === 'free');

    return { showAds };
}
