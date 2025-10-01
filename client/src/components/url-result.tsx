import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UrlResultProps {
  result: {
    original_url: string;
    short_url: string;
    code: string;
    created_at: string;
  };
}

export default function UrlResult({ result }: UrlResultProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "URL copiada para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  return (
    <div data-testid="result-container" className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-2">Sua URL encurtada:</p>
          <div className="flex items-center gap-2 p-3 bg-card rounded-md border border-border">
            <CheckCircle2 className="text-accent flex-shrink-0" size={20} />
            <code
              data-testid="text-short-url"
              className="font-mono text-primary flex-1 truncate"
            >
              {result.short_url}
            </code>
            <Button
              data-testid="button-copy"
              size="sm"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-1" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Criada em: {new Date(result.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

