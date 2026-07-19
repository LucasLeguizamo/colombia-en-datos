-- Newsletter "el mes en 5 datos" (Fase 3). Captura pública de emails.
-- Cualquiera puede suscribirse (INSERT anónimo); nadie anónimo puede leer la
-- lista (sin SELECT) para no exponer los correos.

CREATE TABLE public.suscriptores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  fuente     TEXT NOT NULL DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT email_valido CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

ALTER TABLE public.suscriptores ENABLE ROW LEVEL SECURITY;

-- Solo insertar; sin política de SELECT => lectura anónima denegada por defecto.
CREATE POLICY "cualquiera se suscribe" ON public.suscriptores
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Privilegios: revocar el DML amplio por defecto y dejar solo INSERT.
REVOKE ALL ON public.suscriptores FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.suscriptores TO anon, authenticated;
