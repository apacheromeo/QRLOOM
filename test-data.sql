-- Phase 3 Test Data
-- Run this in Supabase SQL Editor to create test QR codes
-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual user ID from auth.users table

-- First, get your user ID:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert test QR codes:

INSERT INTO qrcodes (
  user_id,
  data_url,
  short_code,
  title,
  description,
  format,
  foreground_color,
  background_color,
  status,
  scan_count
) VALUES
  (
    'YOUR_USER_ID',
    'https://github.com',
    'github001',
    'GitHub',
    'Official GitHub website',
    'png',
    '#24292e',
    '#FFFFFF',
    'active',
    45
  ),
  (
    'YOUR_USER_ID',
    'https://google.com',
    'google002',
    'Google Search',
    'The most popular search engine',
    'png',
    '#4285F4',
    '#FFFFFF',
    'active',
    128
  ),
  (
    'YOUR_USER_ID',
    'https://youtube.com',
    'youtube03',
    'YouTube',
    'Watch videos online',
    'svg',
    '#FF0000',
    '#FFFFFF',
    'active',
    89
  ),
  (
    'YOUR_USER_ID',
    'https://twitter.com',
    'twitter04',
    'Twitter (X)',
    'Social media platform',
    'png',
    '#1DA1F2',
    '#FFFFFF',
    'active',
    34
  ),
  (
    'YOUR_USER_ID',
    'https://linkedin.com',
    'linkedin05',
    'LinkedIn',
    'Professional networking',
    'png',
    '#0077B5',
    '#FFFFFF',
    'active',
    67
  ),
  (
    'YOUR_USER_ID',
    'https://example.com/products',
    'product06',
    'Product Catalog',
    'Browse our products',
    'png',
    '#000000',
    '#FFFFFF',
    'archived',
    12
  ),
  (
    'YOUR_USER_ID',
    'https://example.com/contact',
    'contact07',
    'Contact Us',
    'Get in touch',
    'png',
    '#000000',
    '#FFFFFF',
    'active',
    23
  ),
  (
    'YOUR_USER_ID',
    'https://docs.example.com',
    'docs0008',
    'Documentation',
    'Read the docs',
    'svg',
    '#4A5568',
    '#FFFFFF',
    'active',
    156
  );

-- Verify insertion:
SELECT
  id,
  title,
  short_code,
  scan_count,
  status,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created
FROM qrcodes
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC;

-- To test scans (for Phase 4), you can add some sample scan data:
-- (Replace QR_CODE_ID with actual ID from qrcodes table)

/*
INSERT INTO scans (
  qrcode_id,
  country,
  city,
  device_type,
  browser,
  scanned_at
) VALUES
  ('QR_CODE_ID', 'United States', 'New York', 'Mobile', 'Chrome', NOW() - INTERVAL '2 hours'),
  ('QR_CODE_ID', 'United Kingdom', 'London', 'Desktop', 'Firefox', NOW() - INTERVAL '5 hours'),
  ('QR_CODE_ID', 'Thailand', 'Bangkok', 'Mobile', 'Safari', NOW() - INTERVAL '1 day'),
  ('QR_CODE_ID', 'Japan', 'Tokyo', 'Tablet', 'Chrome', NOW() - INTERVAL '2 days'),
  ('QR_CODE_ID', 'Germany', 'Berlin', 'Desktop', 'Edge', NOW() - INTERVAL '3 days');
*/
