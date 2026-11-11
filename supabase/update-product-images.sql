-- Nya kategorier utifrån bildernas motiv
INSERT INTO categories (name, slug) VALUES
  ('Handdukar', 'handdukar'),
  ('Biblar', 'biblar')
ON CONFLICT (slug) DO NOTHING;

-- Uppdatera produkterna efter bildernas faktiska motiv
WITH data(image_url, name, description, category_slug) AS (
  VALUES
    ('/images/ljusetsbarn/image1.jpg',  'Handduk med tryck – Design 1', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 'handdukar'),
    ('/images/ljusetsbarn/image2.jpg',  'Handduk med tryck – Design 2', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 'handdukar'),
    ('/images/ljusetsbarn/image14.jpg', 'Handduk med tryck – Design 3', 'Handduk med tryck i mjuk bomull. En personlig present som passar till dop, bröllop och vardag.', 'handdukar'),
    ('/images/ljusetsbarn/image3.jpg',  'Plexi – Design 1', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 'plexi'),
    ('/images/ljusetsbarn/image4.jpg',  'Plexi – Design 2', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 'plexi'),
    ('/images/ljusetsbarn/image5.jpg',  'Plexi – Design 3', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 'plexi'),
    ('/images/ljusetsbarn/image7.jpg',  'Plexi – Design 4', 'Handgjord i plexi. Passar som personlig present eller dekoration.', 'plexi'),
    ('/images/ljusetsbarn/image6.jpg',  'Dekoration – Handgjord 1', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 'dekoration'),
    ('/images/ljusetsbarn/image8.jpg',  'Dekoration – Handgjord 2', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 'dekoration'),
    ('/images/ljusetsbarn/image12.jpg', 'Dekoration – Handgjord 3', 'Handgjord dekoration med personlig touch. Passar som present eller till hemmet.', 'dekoration'),
    ('/images/ljusetsbarn/image15.jpg', 'Ljus – Handgjort 1', 'Handgjort ljus med varm och inbjudande känsla.', 'ljus'),
    ('/images/ljusetsbarn/image17.jpg', 'Ljus – Handgjort 2', 'Handgjort ljus med varm och inbjudande känsla.', 'ljus'),
    ('/images/ljusetsbarn/image16.jpg', 'Smycke – Handgjort 1', 'Handgjort smycke med unik design. Ett personligt smycke att bära eller ge bort.', 'smycken'),
    ('/images/ljusetsbarn/image10.jpg', 'Smycke – Handgjort 2', 'Handgjort smycke med unik design. Ett personligt smycke att bära eller ge bort.', 'smycken'),
    ('/images/ljusetsbarn/image9.jpg',  'Bibel med tryck – Personlig', 'Bibel med tryck. En personlig gåva för dop, konfirmation eller födelsedag.', 'biblar')
)
UPDATE products p
SET name = d.name,
    description = d.description,
    category_id = (SELECT id FROM categories c WHERE c.slug = d.category_slug)
FROM data d
WHERE p.image_url = d.image_url;

NOTIFY pgrst, 'reload schema';
