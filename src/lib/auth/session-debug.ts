type SessionLike = {
  session?: {
    id?: string | null;
    userId?: string | null;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
    expiresAt?: string | Date | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  } | null;
};

function formatDate(value?: string | Date | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("tr-TR");
}

function formatRemainingTime(expiresAt?: string | Date | null) {
  if (!expiresAt) return "-";

  const now = Date.now();
  const expireTime = new Date(expiresAt).getTime();

  if (Number.isNaN(expireTime)) return "-";

  const diffSeconds = Math.max(0, Math.floor((expireTime - now) / 1000));

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}g`);
  if (hours > 0) parts.push(`${hours}sa`);
  if (minutes > 0) parts.push(`${minutes}dk`);
  parts.push(`${seconds}sn`);

  return parts.join(" ");
}

export function logSessionInfo(label: string, sessionData: SessionLike | null | undefined) {
  const now = new Date();

  if (!sessionData?.session) {
    console.log(`
[AUTH][${label}]
Çekilme zamanı   : ${now.toLocaleString("tr-TR")}
Durum            : Session bulunamadı
    `.trim());

    return;
  }

  const s = sessionData.session;

  console.log(`
[AUTH][${label}]
Çekilme zamanı   : ${now.toLocaleString("tr-TR")}
Oluşturulma      : ${formatDate(s.createdAt)}
Son güncellenme  : ${formatDate(s.updatedAt)}
Bitiş zamanı     : ${formatDate(s.expiresAt)}
Kalan süre       : ${formatRemainingTime(s.expiresAt)}
Session ID       : ${s.id ?? "-"}
User ID          : ${s.userId ?? "-"}
IP Address       : ${s.ipAddress ?? "-"}
User Agent       : ${s.userAgent ?? "-"}
  `.trim());
}