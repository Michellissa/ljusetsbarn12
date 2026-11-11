-- Ta bort kategorierna Inredning och Övrigt
DELETE FROM categories WHERE slug IN ('inredning', 'ovrigt');

NOTIFY pgrst, 'reload schema';
