import { useQuery } from "@tanstack/react-query";

interface Stats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  avgClickRate: string;
}

export default function StatsOverview() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div data-testid="text-total-urls" className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats?.totalUrls ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">URLs Encurtadas</p>
          </div>
          <div className="text-center">
            <div data-testid="text-total-clicks" className="text-3xl md:text-4xl font-bold text-accent mb-2">
              {stats?.totalClicks ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">Total de Cliques</p>
          </div>
          <div className="text-center">
            <div data-testid="text-active-urls" className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              {stats?.activeUrls ?? 0}
            </div>
            <p className="text-sm text-muted-foreground">URLs Ativas</p>
          </div>
          <div className="text-center">
            <div data-testid="text-avg-click-rate" className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {stats?.avgClickRate ?? "0.0"}
            </div>
            <p className="text-sm text-muted-foreground">Taxa Média de Cliques</p>
          </div>
        </div>
      </div>
    </section>
  );
}

