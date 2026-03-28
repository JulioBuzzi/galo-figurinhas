/**
 * Formata uma data ISO para "há X minutos/horas/dias".
 */
export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString);
  const now  = new Date();
  const diffMs  = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1)   return 'agora mesmo';
  if (diffMin < 60)  return `há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)    return `há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1)   return 'ontem';
  if (diffD < 30)    return `há ${diffD} dias`;
  const diffM = Math.floor(diffD / 30);
  return diffM === 1 ? 'há 1 mês' : `há ${diffM} meses`;
}

/** Agrupa um array por uma chave string */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
