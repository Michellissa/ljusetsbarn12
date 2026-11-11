-- Genererad från product-import.csv
INSERT INTO products (name, description, price, stock, featured, category_id, image_url, image_urls)
  SELECT 'Handduk med tryck – Design 1', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 249, 12, true, (SELECT id FROM categories WHERE slug = 'handdukar'), '/images/ljusetsbarn/image1.jpg', ARRAY['/images/ljusetsbarn/image1.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Handduk med tryck – Design 1')
  UNION ALL
  SELECT 'Handduk med tryck – Design 2', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 299, 8, false, (SELECT id FROM categories WHERE slug = 'handdukar'), '/images/ljusetsbarn/image2.jpg', ARRAY['/images/ljusetsbarn/image2.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Handduk med tryck – Design 2')
  UNION ALL
  SELECT 'Plexi – Design 1', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 199, 10, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image3.jpg', ARRAY['/images/ljusetsbarn/image3.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Design 1')
  UNION ALL
  SELECT 'Plexi – Design 2', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 349, 6, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image4.jpg', ARRAY['/images/ljusetsbarn/image4.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Design 2')
  UNION ALL
  SELECT 'Plexi – Design 3', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 99, 20, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image5.jpg', ARRAY['/images/ljusetsbarn/image5.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Design 3')
  UNION ALL
  SELECT 'Dekoration – Handgjord 1', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 249, 6, true, (SELECT id FROM categories WHERE slug = 'dekoration'), '/images/ljusetsbarn/image6.jpg', ARRAY['/images/ljusetsbarn/image6.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dekoration – Handgjord 1')
  UNION ALL
  SELECT 'Plexi – Design 4', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 149, 12, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image7.jpg', ARRAY['/images/ljusetsbarn/image7.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Design 4')
  UNION ALL
  SELECT 'Dekoration – Handgjord 2', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 199, 8, false, (SELECT id FROM categories WHERE slug = 'dekoration'), '/images/ljusetsbarn/image8.jpg', ARRAY['/images/ljusetsbarn/image8.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dekoration – Handgjord 2')
  UNION ALL
  SELECT 'Bibel med tryck – Personlig', 'Bibel med tryck. En personlig gåva för dop, konfirmation eller födelsedag.', 129, 15, false, (SELECT id FROM categories WHERE slug = 'biblar'), '/images/ljusetsbarn/image9.jpg', ARRAY['/images/ljusetsbarn/image9.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bibel med tryck – Personlig')
  UNION ALL
  SELECT 'Smycke – Handgjort 2', 'Handgjort smycke med unik design. Ett personligt smycke att bära eller ge bort.', 179, 7, false, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image10.jpg', ARRAY['/images/ljusetsbarn/image10.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smycke – Handgjort 2')
  UNION ALL
  SELECT 'Dekoration – Handgjord 3', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 299, 5, false, (SELECT id FROM categories WHERE slug = 'dekoration'), '/images/ljusetsbarn/image12.jpg', ARRAY['/images/ljusetsbarn/image12.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dekoration – Handgjord 3')
  UNION ALL
  SELECT 'Handduk med tryck – Design 3', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 279, 7, false, (SELECT id FROM categories WHERE slug = 'handdukar'), '/images/ljusetsbarn/image14.jpg', ARRAY['/images/ljusetsbarn/image14.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Handduk med tryck – Design 3')
  UNION ALL
  SELECT 'Ljus – Handgjort 1', 'Handgjort ljus med varm och inbjudande känsla.', 179, 10, false, (SELECT id FROM categories WHERE slug = 'ljus'), '/images/ljusetsbarn/image15.jpg', ARRAY['/images/ljusetsbarn/image15.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ljus – Handgjort 1')
  UNION ALL
  SELECT 'Smycke – Handgjort 1', 'Handgjort smycke med unik design. Ett personligt smycke att bära eller ge bort.', 399, 4, false, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image16.jpg', ARRAY['/images/ljusetsbarn/image16.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smycke – Handgjort 1')
  UNION ALL
  SELECT 'Ljus – Handgjort 2', 'Handgjort ljus med varm och inbjudande känsla.', 279, 9, false, (SELECT id FROM categories WHERE slug = 'ljus'), '/images/ljusetsbarn/image17.jpg', ARRAY['/images/ljusetsbarn/image17.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ljus – Handgjort 2')
  UNION ALL
  SELECT 'Dophandduk – Vit med kors', 'Broderad dophandduk i mjuk bomull. En personlig och tidlös dopgåva.', 299, 8, true, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image18.jpg', ARRAY['/images/ljusetsbarn/image18.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Vit med kors')
  UNION ALL
  SELECT 'Dophandduk – Elfenben', 'Handbroderad dophandduk i varm elfenbensvit ton. Passar till dop och högtider.', 299, 6, false, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image19.jpg', ARRAY['/images/ljusetsbarn/image19.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Elfenben')
  UNION ALL
  SELECT 'Dophandduk – Broderad blomma', 'Dophandduk med broderad blomma. Ett uppskattat minne från dopdagen.', 349, 5, false, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image20.jpg', ARRAY['/images/ljusetsbarn/image20.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Broderad blomma')
  UNION ALL
  SELECT 'Dophandduk – Personlig', 'Personlig dophandduk med namn och datum. Broderas på beställning.', 399, 10, true, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image21.jpg', ARRAY['/images/ljusetsbarn/image21.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Personlig')
  UNION ALL
  SELECT 'Plexi – Ljuslykta', 'Ljuslykta i plexi som sprider ett varmt sken.', 279, 7, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image22.jpg', ARRAY['/images/ljusetsbarn/image22.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Ljuslykta')
  UNION ALL
  SELECT 'Plexi – Dekoration', 'Dekoration i plexi för hemmet eller som personlig present.', 229, 9, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image24.jpg', ARRAY['/images/ljusetsbarn/image24.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Dekoration')
  UNION ALL
  SELECT 'Hantverk – Personlig gåva', 'Handgjord personlig gåva med hjärta och omsorg.', 249, 6, false, (SELECT id FROM categories WHERE slug = 'hantverk'), '/images/ljusetsbarn/image25.jpg', ARRAY['/images/ljusetsbarn/image25.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Hantverk – Personlig gåva')
;
