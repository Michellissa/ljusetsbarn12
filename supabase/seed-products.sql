-- Genererad från product-import.csv
INSERT INTO products (name, description, price, stock, featured, category_id, image_url, image_urls)
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
  SELECT 'Dophandduk – Klassisk', 'Klassisk broderad dophandduk i tidlös design. Mjuk och hållbar bomull.', 279, 7, false, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image14.jpg', ARRAY['/images/ljusetsbarn/image14.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Klassisk')
  UNION ALL
  SELECT 'Dophandduk – Natur', 'Dophandduk i naturlig ton med diskret broderi. En fin gåva till dopet.', 279, 9, false, (SELECT id FROM categories WHERE slug = 'dophanddukar'), '/images/ljusetsbarn/image17.jpg', ARRAY['/images/ljusetsbarn/image17.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dophandduk – Natur')
  UNION ALL
  SELECT 'Plexi – Namnskylt', 'Personlig namnskylt i plexi. Passar som dopgåva eller present.', 249, 12, true, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image1.jpg', ARRAY['/images/ljusetsbarn/image1.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Namnskylt')
  UNION ALL
  SELECT 'Plexi – Dopskylt', 'Dopskylt i plexi med plats för namn och datum. Handgjord i Sverige.', 299, 8, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image2.jpg', ARRAY['/images/ljusetsbarn/image2.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Dopskylt')
  UNION ALL
  SELECT 'Plexi – Fotoram', 'Fotoram i plexi som lyfter fram ditt finaste minne.', 199, 10, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image3.jpg', ARRAY['/images/ljusetsbarn/image3.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Fotoram')
  UNION ALL
  SELECT 'Plexi – Presentask', 'Handgjord presentask i plexi. Fyll med en personlig gåva.', 349, 6, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image4.jpg', ARRAY['/images/ljusetsbarn/image4.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Presentask')
  UNION ALL
  SELECT 'Plexi – Nyckelring', 'Liten nyckelring i plexi. Ett personligt litet minne.', 99, 20, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image5.jpg', ARRAY['/images/ljusetsbarn/image5.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Nyckelring')
  UNION ALL
  SELECT 'Plexi – Bokstöd', 'Bokstöd i plexi med modern design. Handgjord och unik.', 399, 4, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image16.jpg', ARRAY['/images/ljusetsbarn/image16.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Bokstöd')
  UNION ALL
  SELECT 'Plexi – Ljuslykta', 'Ljuslykta i plexi som sprider ett varmt sken.', 279, 7, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image22.jpg', ARRAY['/images/ljusetsbarn/image22.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Ljuslykta')
  UNION ALL
  SELECT 'Plexi – Dekoration', 'Dekoration i plexi för hemmet eller som personlig present.', 229, 9, false, (SELECT id FROM categories WHERE slug = 'plexi'), '/images/ljusetsbarn/image24.jpg', ARRAY['/images/ljusetsbarn/image24.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plexi – Dekoration')
  UNION ALL
  SELECT 'Rosenkrans – Handgjord', 'Handgjord rosenkrans med omsorgsfullt utvalda pärlor.', 249, 6, true, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image6.jpg', ARRAY['/images/ljusetsbarn/image6.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rosenkrans – Handgjord')
  UNION ALL
  SELECT 'Armband – Pärlor', 'Armband med pärlor och handgjord design. Passar till vardag och fest.', 149, 12, false, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image7.jpg', ARRAY['/images/ljusetsbarn/image7.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Armband – Pärlor')
  UNION ALL
  SELECT 'Halsband – Natursten', 'Halsband med naturstenar och handgjord finish.', 199, 8, false, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image8.jpg', ARRAY['/images/ljusetsbarn/image8.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Halsband – Natursten')
  UNION ALL
  SELECT 'Handgjort ljus – Doft', 'Handgjort doftljus med varm och inbjudande doft.', 129, 15, false, (SELECT id FROM categories WHERE slug = 'ljus'), '/images/ljusetsbarn/image9.jpg', ARRAY['/images/ljusetsbarn/image9.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Handgjort ljus – Doft')
  UNION ALL
  SELECT 'Dekoration – Trä', 'Handgjord dekoration i trä. En naturlig detalj i hemmet.', 179, 7, false, (SELECT id FROM categories WHERE slug = 'dekoration'), '/images/ljusetsbarn/image10.jpg', ARRAY['/images/ljusetsbarn/image10.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dekoration – Trä')
  UNION ALL
  SELECT 'Presentask – Handgjord', 'Handgjord presentask med personlig touch. Perfekt som gåva.', 299, 5, false, (SELECT id FROM categories WHERE slug = 'presenter'), '/images/ljusetsbarn/image12.jpg', ARRAY['/images/ljusetsbarn/image12.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Presentask – Handgjord')
  UNION ALL
  SELECT 'Smycke – Unik', 'Unikt handgjort smycke. Varje exemplar är en egen liten skapelse.', 179, 10, false, (SELECT id FROM categories WHERE slug = 'smycken'), '/images/ljusetsbarn/image15.jpg', ARRAY['/images/ljusetsbarn/image15.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smycke – Unik')
  UNION ALL
  SELECT 'Hantverk – Personlig gåva', 'Handgjord personlig gåva med hjärta och omsorg.', 249, 6, false, (SELECT id FROM categories WHERE slug = 'hantverk'), '/images/ljusetsbarn/image25.jpg', ARRAY['/images/ljusetsbarn/image25.jpg']
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Hantverk – Personlig gåva')
;
