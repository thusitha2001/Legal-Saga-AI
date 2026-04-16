import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type QuestionInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useQuestions(documentId: number) {
  return useQuery({
    queryKey: [api.questions.list.path, documentId],
    queryFn: async () => {
      const url = buildUrl(api.questions.list.path, { id: documentId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return api.questions.list.responses[200].parse(await res.json());
    },
    enabled: !!documentId && !isNaN(documentId),
  });
}

export function useAskQuestion(documentId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: QuestionInput) => {
      const url = buildUrl(api.questions.ask.path, { id: documentId });
      const res = await fetch(url, {
        method: api.questions.ask.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          const error = api.questions.ask.responses[404].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to ask question");
      }
      
      return api.questions.ask.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.questions.list.path, documentId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit question",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
