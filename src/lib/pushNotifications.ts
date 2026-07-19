import { supabase } from "@/lib/supabaseClient";
import { supabaseUrl } from "@/lib/supabaseConfig";

const functionUrl = `${supabaseUrl}/functions/v1/push-notifications`;

export type PushCapability = {
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  subscribed: boolean;
};

const urlBase64ToUint8Array = (value: string) => {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
};

const requireSession = async () => {
  if (!supabase) throw new Error("Supabase nao configurado.");
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Sessao expirada. Entre novamente.");
  return data.session.access_token;
};

const callPushApi = async (payload: Record<string, unknown>) => {
  const token = await requireSession();
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Falha no servico de notificacoes.");
  return result;
};

export const getPushCapability = async (): Promise<PushCapability> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return { supported: false, permission: "unsupported", subscribed: false };
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return { supported: true, permission: Notification.permission, subscribed: Boolean(subscription) };
};

export const enablePushNotifications = async (clinicId: string) => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permissao de notificacao nao concedida.");

  const configResponse = await fetch(functionUrl);
  const config = await configResponse.json();
  if (!configResponse.ok || !config.publicKey) throw new Error(config.error || "Chave publica Web Push indisponivel.");

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey),
    });
  }
  const serialized = subscription.toJSON();
  await callPushApi({
    action: "subscribe",
    clinicId,
    subscription: serialized,
    userAgent: navigator.userAgent,
    deviceLabel: `${navigator.platform || "Dispositivo"} - ${navigator.language}`,
  });
  return subscription;
};

export const disablePushNotifications = async (clinicId: string) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await callPushApi({ action: "unsubscribe", clinicId, endpoint: subscription.endpoint });
  await subscription.unsubscribe();
};

export const sendTestPush = async (clinicId: string) => callPushApi({
  action: "test",
  clinicId,
  title: "Lifeum Flow conectado",
  message: "Notificacao de teste entregue com o app fechado ou a tela bloqueada.",
  url: "/alertas",
  tag: "lifeum-flow-test",
});

export const notifyClinic = async (
  clinicId: string,
  notification: { title: string; message: string; url?: string; tag?: string },
) => callPushApi({ action: "notify-clinic", clinicId, ...notification });
