CREATE TABLE public.user_profiles (
  clerk_user_id text PRIMARY KEY CHECK (length(clerk_user_id) BETWEEN 3 AND 128),
  display_name text CHECK (display_name IS NULL OR length(display_name) <= 120),
  locale text NOT NULL DEFAULT 'en' CHECK (length(locale) BETWEEN 2 AND 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.user_settings (
  clerk_user_id text PRIMARY KEY REFERENCES public.user_profiles(clerk_user_id) ON DELETE CASCADE,
  settings_version integer NOT NULL DEFAULT 1 CHECK (settings_version > 0),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(settings) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL REFERENCES public.user_profiles(clerk_user_id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('twitch', 'youtube', 'tiktok_live', 'kick')),
  provider_subject text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'revoked', 'error')),
  scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  secret_reference text,
  connected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (provider_subject IS NULL OR length(provider_subject) <= 256),
  CHECK (secret_reference IS NULL OR length(secret_reference) <= 512),
  UNIQUE (clerk_user_id, provider, provider_subject)
);
CREATE TABLE public.installations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL REFERENCES public.user_profiles(clerk_user_id) ON DELETE CASCADE,
  client_platform text NOT NULL CHECK (client_platform IN ('pcvr', 'quest')),
  display_name text NOT NULL DEFAULT 'My installation' CHECK (length(display_name) BETWEEN 1 AND 120),
  credential_hash bytea,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paired', 'revoked')),
  paired_at timestamptz,
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (credential_hash IS NULL OR octet_length(credential_hash) = 32)
);
CREATE TABLE public.subscriptions (
  clerk_user_id text PRIMARY KEY REFERENCES public.user_profiles(clerk_user_id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'past_due', 'canceled')),
  billing_provider text CHECK (billing_provider IS NULL OR billing_provider IN ('stripe')),
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (plan <> 'premium' OR billing_provider IS NOT NULL)
);
CREATE TABLE public.billing_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_provider text NOT NULL CHECK (billing_provider IN ('stripe')),
  provider_event_id text NOT NULL CHECK (length(provider_event_id) BETWEEN 1 AND 256),
  event_type text NOT NULL CHECK (length(event_type) BETWEEN 1 AND 256),
  processing_status text NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processing', 'processed', 'retry', 'failed')),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_error_redacted text CHECK (last_error_redacted IS NULL OR length(last_error_redacted) <= 1000),
  UNIQUE (billing_provider, provider_event_id)
);
CREATE TABLE public.event_deduplication (
  provider text NOT NULL CHECK (provider IN ('twitch', 'youtube', 'tiktok_live', 'kick')),
  provider_event_id text NOT NULL CHECK (length(provider_event_id) BETWEEN 1 AND 256),
  received_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  PRIMARY KEY (provider, provider_event_id),
  CHECK (expires_at > received_at)
);
CREATE INDEX platform_connections_owner_status_idx ON public.platform_connections (clerk_user_id, status);
CREATE INDEX installations_owner_status_idx ON public.installations (clerk_user_id, status);
CREATE INDEX billing_webhook_events_status_received_idx ON public.billing_webhook_events (processing_status, received_at);
CREATE INDEX event_deduplication_expiry_idx ON public.event_deduplication (expires_at);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
CREATE POLICY user_profiles_owner_policy ON public.user_profiles USING (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), '')) WITH CHECK (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), ''));
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings FORCE ROW LEVEL SECURITY;
CREATE POLICY user_settings_owner_policy ON public.user_settings USING (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), '')) WITH CHECK (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), ''));
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_connections FORCE ROW LEVEL SECURITY;
CREATE POLICY platform_connections_owner_policy ON public.platform_connections USING (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), '')) WITH CHECK (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), ''));
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installations FORCE ROW LEVEL SECURITY;
CREATE POLICY installations_owner_policy ON public.installations USING (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), '')) WITH CHECK (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), ''));
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_owner_policy ON public.subscriptions USING (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), '')) WITH CHECK (clerk_user_id = NULLIF(current_setting('riftpulse.user_id', true), ''));