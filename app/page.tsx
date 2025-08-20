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

      {/* Footer */}
      <footer className="border-t bg-header mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-header-foreground">
            <p>&copy; 2024 EmprendimientosCR. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
