import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
});

type SubscriptionRow = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth_key: string;
};

const safePath = (value: unknown) => {
  const path = typeof value === "string" ? value : "/alertas";
  return path.startsWith("/") && !path.startsWith("//") ? path.slice(0, 500) : "/alertas";
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@drgabrielmalta.com";

  if (request.method === "GET") {
    return vapidPublicKey
      ? json({ publicKey: vapidPublicKey })
      : json({ error: "Web Push ainda nao foi configurado no servidor." }, 503);
  }

  if (!vapidPublicKey || !vapidPrivateKey) return json({ error: "VAPID nao configurado." }, 503);

  const authorization = request.headers.get("Authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Sessao obrigatoria." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "Sessao invalida." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON invalido." }, 400);
  }

  const action = String(body.action || "");
  const clinicId = String(body.clinicId || "");
  if (!clinicId) return json({ error: "Clinica obrigatoria." }, 400);

  const { data: membership } = await admin
    .from("clinic_members")
    .select("role")
    .eq("clinic_id", clinicId)
    .eq("user_id", authData.user.id)
    .eq("active", true)
    .maybeSingle();
  if (!membership) return json({ error: "Acesso negado para esta clinica." }, 403);

  if (action === "subscribe") {
    const subscription = body.subscription as Record<string, unknown> | undefined;
    const keys = subscription?.keys as Record<string, unknown> | undefined;
    const endpoint = String(subscription?.endpoint || "");
    const p256dh = String(keys?.p256dh || "");
    const authKey = String(keys?.auth || "");
    if (!endpoint.startsWith("https://") || !p256dh || !authKey) {
      return json({ error: "Inscricao Web Push invalida." }, 400);
    }

    const { error } = await admin.from("push_subscriptions").upsert({
      endpoint: endpoint.slice(0, 2048),
      p256dh: p256dh.slice(0, 512),
      auth_key: authKey.slice(0, 256),
      clinic_id: clinicId,
      user_id: authData.user.id,
      user_agent: String(body.userAgent || "").slice(0, 500) || null,
      device_label: String(body.deviceLabel || "").slice(0, 120) || null,
      active: true,
      last_seen_at: new Date().toISOString(),
      last_error: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "endpoint" });
    return error ? json({ error: error.message }, 500) : json({ subscribed: true });
  }

  if (action === "unsubscribe") {
    const endpoint = String(body.endpoint || "");
    const { error } = await admin.from("push_subscriptions").delete()
      .eq("endpoint", endpoint).eq("user_id", authData.user.id);
    return error ? json({ error: error.message }, 500) : json({ subscribed: false });
  }

  let subscriptionQuery = admin.from("push_subscriptions")
    .select("id, endpoint, p256dh, auth_key")
    .eq("active", true);

  if (action === "test") {
    subscriptionQuery = subscriptionQuery.eq("user_id", authData.user.id).eq("clinic_id", clinicId);
  } else if (action === "notify-clinic") {
    subscriptionQuery = subscriptionQuery.eq("clinic_id", clinicId);
  } else {
    return json({ error: "Acao desconhecida." }, 400);
  }

  const { data: subscriptions, error: queryError } = await subscriptionQuery;
  if (queryError) return json({ error: queryError.message }, 500);

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  const payload = JSON.stringify({
    title: String(body.title || (action === "test" ? "Notificacoes ativadas" : "Lifeum Flow")).slice(0, 100),
    body: String(body.message || (action === "test" ? "Este aparelho recebera os alertas mesmo com o app fechado." : "Ha uma nova atualizacao na clinica.")).slice(0, 240),
    url: safePath(body.url),
    tag: String(body.tag || "lifeum-flow").slice(0, 100),
  });

  let sent = 0;
  let failed = 0;
  await Promise.all((subscriptions as SubscriptionRow[] || []).map(async (subscription) => {
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth_key },
      }, payload, { TTL: 3600, urgency: "high" });
      sent += 1;
      await admin.from("push_subscriptions").update({
        last_delivery_at: new Date().toISOString(), last_error: null, updated_at: new Date().toISOString(),
      }).eq("id", subscription.id);
    } catch (error) {
      failed += 1;
      const statusCode = Number((error as { statusCode?: number }).statusCode || 0);
      await admin.from("push_subscriptions").update({
        active: ![404, 410].includes(statusCode),
        last_error: String((error as Error).message || error).slice(0, 500),
        updated_at: new Date().toISOString(),
      }).eq("id", subscription.id);
    }
  }));

  return json({ sent, failed, total: (subscriptions || []).length });
});
