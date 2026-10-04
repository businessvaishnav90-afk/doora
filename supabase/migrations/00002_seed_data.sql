-- Seed Data for Doora Application

-- 1. Insert Service Categories
INSERT INTO service_categories (name, icon_url, base_visiting_fee, is_active)
VALUES 
  ('Electrical', 'Zap', 150.00, true),
  ('Plumbing', 'Droplet', 150.00, true),
  ('Carpentry', 'Wrench', 200.00, true),
  ('Painting', 'Paintbrush', 250.00, true),
  ('Cleaning', 'Sparkles', 300.00, true),
  ('AC Repair', 'Snowflake', 250.00, true)
ON CONFLICT DO NOTHING;

-- Note: In a real environment, icon_url might be a real URL, but here we store the Lucide Icon name for mapping in the UI.
