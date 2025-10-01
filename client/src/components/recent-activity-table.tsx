import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, BarChart3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UrlData {
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function RecentActivityTable() {
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: urls = [], isLoading } = useQuery<UrlData[]>({
    queryKey: ["/api/shorturl"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      await apiRequest("DELETE", `/api/shorturl/${code}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shorturl"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Sucesso",
        description: "URL excluída com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir URL",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "URL copiada para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  const viewStats = (code: string) => {
    // Navigate to stats view - for now just show toast
    toast({
      title: "Visualizar Estatísticas",
      description: `Abrindo estatísticas para ${code}...`,
    });
  };

  return (
    <>
      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Atividade Recente de Cliques</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  URL Curta
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider hidden lg:table-cell">
                  URL Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Cliques
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Criada em
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : urls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma URL ainda. Crie sua primeira URL encurtada acima!
                  </td>
                </tr>
              ) : (
                urls.slice(0, 10).map((url) => (
                  <tr
                    key={url.code}
                    data-testid={`row-url-${url.code}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm font-medium text-primary">
                          {url.code}
                        </code>
                        <button
                          data-testid={`button-copy-${url.code}`}
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span data-testid={`text-clicks-row-${url.code}`} className="text-sm font-semibold text-foreground">
                        {url.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          data-testid={`button-stats-${url.code}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => viewStats(url.code)}
                          className="text-primary hover:text-primary/80"
                        >
                          <BarChart3 size={16} className="mr-1" />
                          Estatísticas
                        </Button>
                        <Button
                          data-testid={`button-delete-${url.code}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteCode(url.code)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {urls.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">1-{Math.min(10, urls.length)}</span> de{" "}
              <span className="font-medium text-foreground">{urls.length}</span> resultados
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={urls.length <= 10}>
                Próxima
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteCode !== null} onOpenChange={() => setDeleteCode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá excluir permanentemente a URL encurtada <code className="font-mono text-primary">{deleteCode}</code>.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteCode) {
                  deleteMutation.mutate(deleteCode);
                  setDeleteCode(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
