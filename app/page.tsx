import { Marketplace } from '@/components/marketplace/marketplace';
import { ConfigurationError } from '@/components/configuration-error';
import { GoogleAdsenseBanner } from '@/components/ads/google-adsense-banner';
import { hasEnvVars } from '@/lib/utils';

export default function Home() {
  // Show configuration error if environment variables are missing
  if (!hasEnvVars) {
    return <ConfigurationError />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main>
        <Marketplace />
      </main>

      {/* Google AdSense Banners */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoogleAdsenseBanner 
            adSlot="1217674249" 
            className="h-10 sm:h-12 md:h-14"
          />
          <GoogleAdsenseBanner 
            adSlot="1217674249" 
            className="h-10 sm:h-12 md:h-14"
          />
        </div>
      </div>
    </div>
  );
}
