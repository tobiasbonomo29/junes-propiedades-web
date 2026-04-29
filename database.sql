-- =====================================================
-- Junes Propiedades — Schema SQL
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ  DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ  DEFAULT NOW() NOT NULL,
  title         TEXT         NOT NULL,
  description   TEXT,
  price         NUMERIC(15,2) NOT NULL,
  currency      TEXT         NOT NULL DEFAULT 'USD'
                             CHECK (currency IN ('USD','ARS')),
  operation     TEXT         NOT NULL
                             CHECK (operation IN ('Venta','Alquiler')),
  type          TEXT         NOT NULL
                             CHECK (type IN ('Casa','Departamento','PH','Local','Oficina','Lote')),
  neighborhood  TEXT,
  city          TEXT         NOT NULL DEFAULT 'Buenos Aires',
  bedrooms      INTEGER,
  bathrooms     INTEGER,
  total_area    NUMERIC(10,2),
  covered_area  NUMERIC(10,2),
  garage        BOOLEAN      NOT NULL DEFAULT FALSE,
  pool          BOOLEAN      NOT NULL DEFAULT FALSE,
  garden        BOOLEAN      NOT NULL DEFAULT FALSE,
  security      BOOLEAN      NOT NULL DEFAULT FALSE,
  images        TEXT[]       NOT NULL DEFAULT '{}',
  featured      BOOLEAN      NOT NULL DEFAULT FALSE,
  status        TEXT         NOT NULL DEFAULT 'Activa'
                             CHECK (status IN ('Activa','Vendida','Alquilada'))
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Usuarios anónimos (visitantes) solo ven propiedades activas
CREATE POLICY "anon_view_active"
  ON properties FOR SELECT TO anon
  USING (status = 'Activa');

-- Usuarios autenticados (admin) tienen acceso completo
CREATE POLICY "auth_full_access"
  ON properties FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================================================
-- Storage: bucket para imágenes de propiedades
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_view_images"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'property-images');

CREATE POLICY "auth_upload_images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "auth_update_images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'property-images');

CREATE POLICY "auth_delete_images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-images');
