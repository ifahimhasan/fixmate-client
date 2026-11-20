/**
 * All site images in one place.
 * To use your own photos: put the file in /public/images and replace the URL
 * with "/images/<file-name>.jpg". Service images in the database come from the
 * technician's ImgBB upload.
 */
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  about: unsplash("1721332154191-ba5f1534266e", 1400),
  authSide: unsplash("1721333089073-215a56fd710c", 1200),
  /** Fallback when a service has no image */
  serviceFallback: unsplash("1550041473-d296a3a8a18a", 900),
  category: {
    Smartphone: unsplash("1550041473-d296a3a8a18a"),
    "Laptop & PC": unsplash("1721333089073-215a56fd710c"),
    AC: unsplash("1718203862467-c33159fdc504"),
    Refrigerator: unsplash("1722603929403-de9e80c46a9a"),
    TV: unsplash("1584280795027-321f4d68e77b"),
    "Washing Machine": unsplash("1626806787461-102c1bfaaea1"),
    Electrical: unsplash("1621905251189-08b45d6a269e"),
  } as Record<string, string>,
};

/** Photo credits (Unsplash License) - shown nowhere, kept for reference. */
export const UNSPLASH_IDS = {
  Smartphone: ["1550041473-d296a3a8a18a", "1639776738932-956082f0b704"],
  "Laptop & PC": ["1721333089073-215a56fd710c", "1721332154191-ba5f1534266e"],
  AC: ["1718203862467-c33159fdc504", "1667983453881-4992fe86ab1b"],
  Refrigerator: ["1722603929403-de9e80c46a9a", "1536353284924-9220c464e262"],
  TV: ["1584280795027-321f4d68e77b", "1567690187548-f07b1d7bf5a9"],
  "Washing Machine": ["1626806787461-102c1bfaaea1", "1604335399105-a0c585fd81a1"],
  Electrical: ["1621905251189-08b45d6a269e", "1758101755915-462eddc23f57"],
};
export { unsplash };
