import { Marketplace } from '@/components/marketplace/marketplace';
import { ConfigurationError } from '@/components/configuration-error';

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


    </div>
  );
}
