-- 1. Adicionar coluna professional_id (nullable)
ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS professional_id UUID
  REFERENCES professionals(id) ON DELETE SET NULL;

-- 2. Auto-vincular por match exato de nome (case-insensitive)
UPDATE equipment e
SET professional_id = p.id
FROM professionals p
WHERE lower(trim(e.professional_name)) = lower(trim(p.name))
  AND e.professional_id IS NULL;

-- 3. Índice para performance
CREATE INDEX IF NOT EXISTS idx_equipment_professional_id
  ON equipment(professional_id);
