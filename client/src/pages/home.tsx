import { Link2 } from "lucide-react";
import UrlShortenerForm from "@/components/url-shortener-form";
import StatsOverview from "@/components/stats-overview";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import ApiDocsSection from "@/components/api-docs-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Link2 className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold text-foreground">ShortURL</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Painel</a>
            <a href="#analytics" className="text-muted-foreground hover:text-primary transition-colors">Análise</a>
            <a href="#api" className="text-muted-foreground hover:text-primary transition-colors">Docs da API</a>
          </div>

          <div className="flex items-center space-x-3">
            <button className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/90 transition-colors">
              Login
            </button>
          </div>
        </nav>
      </header>

      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Encurte Suas URLs
              <span className="text-primary"> Instantaneamente</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crie links curtos e memoráveis com análise avançada. Rastreie cliques, analise o tráfego e gerencie todas as suas URLs em um só lugar.
            </p>
          </div>

          <UrlShortenerForm />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Velocidade Incrível</h3>
              <p className="text-sm text-muted-foreground">Gere URLs curtas em milissegundos com nosso algoritmo otimizado</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-accent text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Análise Avançada</h3>
              <p className="text-sm text-muted-foreground">Rastreie cada clique com carimbos de data/hora e estatísticas detalhadas</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary text-xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Seguro e Confiável</h3>
              <p className="text-sm text-muted-foreground">Validação de URL e verificações de segurança em cada envio</p>
            </div>
          </div>
        </div>
      </section>

      <StatsOverview />

      <div id="analytics">
        <AnalyticsDashboard />
      </div>

      <div id="api">
        <ApiDocsSection />
      </div>

    </div>
  );
}
