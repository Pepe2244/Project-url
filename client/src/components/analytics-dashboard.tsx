import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import RecentActivityTable from "@/components/recent-activity-table";

interface UrlData {
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function AnalyticsDashboard() {
  const { data: urls = [], isLoading } = useQuery<UrlData[]>({
    queryKey: ["/api/shorturl"],
  });

  const topUrls = [...urls]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Painel de Análise de Cliques</h2>
          <p className="text-muted-foreground">Monitore o desempenho e rastreie o engajamento de todas as suas URLs encurtadas</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">URLs com Melhor Desempenho</h3>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                Ver Todas
                <ArrowRight className="inline ml-1" size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-muted/30 rounded-lg h-24" />
                ))}
              </div>
            ) : topUrls.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma URL criada ainda. Comece encurtando sua primeira URL!
              </div>
            ) : (
              <div className="space-y-4">
                {topUrls.map((url) => (
                  <div
                    key={url.code}
                    data-testid={`card-top-url-${url.code}`}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="font-mono text-sm font-semibold text-primary">
                          {url.code}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {url.originalUrl}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Criada em {new Date(url.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div data-testid={`text-clicks-${url.code}`} className="text-2xl font-bold text-foreground">
                        {url.clicks}
                      </div>
                      <p className="text-xs text-muted-foreground">cliques</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Estatísticas Rápidas</h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total de URLs</span>
                  <span data-testid="text-quick-total-urls" className="text-lg font-bold text-foreground">
                    {urls.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total de Cliques</span>
                  <span data-testid="text-quick-total-clicks" className="text-lg font-bold text-foreground">
                    {urls.reduce((sum, url) => sum + url.clicks, 0)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">URLs Ativas</span>
                  <span data-testid="text-quick-active-urls" className="text-lg font-bold text-foreground">
                    {urls.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RecentActivityTable />
      </div>
    </section>
  );
}

