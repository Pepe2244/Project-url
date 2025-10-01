import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Globe, Code, Calendar } from "lucide-react"; 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, 
  FormMessage, 
  FormDescription, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast"; 
import UrlResult from "@/components/url-result"; 

const formSchema = z.object({
  
  originalUrl: z.string().url("Por favor, insira uma URL válida (deve incluir http:// ou https://)"), 
  
  code: z.string()
    .regex(/^[a-zA-Z0-9]{5,10}$/, "O Código deve ter 5-10 caracteres alfanuméricos")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShortenedUrlResult {
  original_url: string;
  short_url: string;
  code: string;
  created_at: string;
}

export default function UrlShortenerForm() {
  const [result, setResult] = useState<ShortenedUrlResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: "",
      code: "",
      expiresAt: "30d",
    },
  });

  const shortenMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        originalUrl: data.originalUrl,
        code: data.code || undefined,
        expiresAt: data.expiresAt || "30d",
      };
      const res = await apiRequest("POST", "/api/shorturl", payload);
      return res.json();
    },
    onSuccess: (data: ShortenedUrlResult) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/shorturl"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Sucesso!",
        description: "URL encurtada com sucesso",
      });
    },
    onError: (error: Error) => {
      
      toast({
        title: "Erro",
        description: error.message || "Falha ao encurtar a URL",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    shortenMutation.mutate(data);
  };

  return (
    <>
      <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  
                  <FormLabel>Insira sua URL longa</FormLabel> 
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="text-muted-foreground" size={18} />
                      </div>
                      <Input
                        data-testid="input-long-url"
 
                        placeholder="https://exemplo.com/url/muito/longa/que/precisa/ser/encurtada"
                        className="pl-12"
                        {...field}
                      />
                    </div>
                  </FormControl>
              
                  <FormDescription>
                    A URL deve começar com http:// ou https://
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
 
                    <FormLabel>Código personalizado (opcional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Code className="text-muted-foreground" size={18} />
                        </div>
                        <Input
                          data-testid="input-custom-code"

                          placeholder="meulink"
                          className="pl-12 font-mono"
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormDescription>5-10 caracteres alfanuméricos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    
                    <FormLabel>Expiração</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-expiration">
                        
                          <SelectValue placeholder="Selecione a expiração" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        
                        <SelectItem value="never">Nunca expira</SelectItem>
                        <SelectItem value="1h">1 hora</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="1y">1 ano</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              data-testid="button-shorten"
              type="submit"
              className="w-full"
              disabled={shortenMutation.isPending}
            >
             
              {shortenMutation.isPending ? "Encurtando..." : "Encurtar URL"}
            </Button>
          </form>
        </Form>

        {result && <UrlResult result={result} />}
      </div>
    </>
  );
}
