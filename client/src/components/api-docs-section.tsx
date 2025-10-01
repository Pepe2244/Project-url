import { BookOpen, ExternalLink } from "lucide-react";

export default function ApiDocsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">Documentação da API RESTful</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Integre nosso serviço de encurtamento de URL em seus aplicativos com nossa API REST simples
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Endpoint Criar URL Curta */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Criar URL Curta</h3>
                <p className="text-sm text-muted-foreground">Gera uma URL encurtada a partir de uma URL longa</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-accent text-accent-foreground">
                POST
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <code className="text-sm font-mono text-foreground">POST /api/shorturl</code>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Corpo da Requisição:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
{`{
  "originalUrl": "https://example.com/long-url",
  "code": "mylink", // optional
  "expiresAt": "30d" // optional
}`}
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Resposta:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
{`{
  "original_url": "https://example.com/long-url",
  "short_url": "https://short.url/abc123",
  "code": "abc123",
  "created_at": "2024-01-15T14:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoint Redirecionar */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Redirecionar para a URL Original</h3>
                <p className="text-sm text-muted-foreground">Acesse a URL curta para redirecionar e rastrear cliques</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-primary text-primary-foreground">
                GET
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <code className="text-sm font-mono text-foreground">GET /{`{shortCode}`}</code>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Parâmetros de Rota:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                  shortCode: string (5-10 caracteres alfanuméricos)
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Resposta:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
{`HTTP/1.1 302 Found
Location: https://example.com/long-url

// A contagem de cliques é incrementada automaticamente`}
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoint Obter Estatísticas */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Obter Estatísticas da URL</h3>
                <p className="text-sm text-muted-foreground">Recupera a análise de cliques para uma URL curta</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-primary text-primary-foreground">
                GET
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <code className="text-sm font-mono text-foreground">GET /api/shorturl/{`{shortCode}`}/stats</code>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Resposta:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
{`{
  "code": "abc123",
  "originalUrl": "https://example.com/long-url",
  "totalClicks": 234,
  "createdAt": "2024-01-15T14:30:00Z",
  "recentClicks": [
    {"timestamp": "2024-01-15T16:45:22Z"},
    {"timestamp": "2024-01-15T16:23:10Z"}
  ]
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoint Excluir URL */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Excluir URL Curta</h3>
                <p className="text-sm text-muted-foreground">Remove uma URL encurtada do sistema</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-destructive text-destructive-foreground">
                DELETE
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <code className="text-sm font-mono text-foreground">DELETE /api/shorturl/{`{shortCode}`}</code>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Parâmetros de Rota:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                  shortCode: string (5-10 caracteres alfanuméricos)
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2 uppercase">Resposta:</p>
                <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
{`HTTP/1.1 200 OK
{
  "message": "URL deleted successfully",
  "code": "abc123"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-xl shadow-md border border-border p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Documentação Completa da API</h3>
              <p className="text-muted-foreground mb-4">
                Acesse a documentação completa da API com exemplos detalhados, códigos de erro, informações de limite de taxa (rate limiting) e guias de autenticação.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <ExternalLink className="mr-2" size={16} />
                Ver Documentação Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
