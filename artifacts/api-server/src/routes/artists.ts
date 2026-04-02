import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { artistsTable, contactRequestsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { GetArtistsQueryParams, GetArtistByIdParams, SubmitContactRequestBody } from "@workspace/api-zod";
import { z } from "zod";

const router: IRouter = Router();

router.get("/artists", async (req, res) => {
  try {
    const query = GetArtistsQueryParams.parse(req.query);

    const conditions: ReturnType<typeof eq>[] = [eq(artistsTable.approved, true)];

    if (query.featured) {
      conditions.push(eq(artistsTable.featured, true));
    }

    let artists = await db
      .select()
      .from(artistsTable)
      .where(and(...conditions));

    if (query.specialty) {
      artists = artists.filter((a) =>
        a.specialty.toLowerCase().includes(query.specialty!.toLowerCase())
      );
    }

    if (query.country) {
      artists = artists.filter((a) =>
        a.country.toLowerCase().includes(query.country!.toLowerCase())
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      artists = artists.filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          a.specialty.toLowerCase().includes(searchLower)
      );
    }

    const mapped = artists.map((a) => ({
      id: a.id,
      name: a.name,
      specialty: a.specialty,
      country: a.country,
      city: a.city ?? undefined,
      experience: a.experience,
      bio: a.bio ?? undefined,
      education: a.education ?? undefined,
      imageUrl: a.imageUrl ?? undefined,
      portfolioLinks: a.portfolioLinks
        ? a.portfolioLinks.split(",").map((l) => l.trim()).filter(Boolean)
        : [],
      works: a.works
        ? a.works.split(",").map((w) => w.trim()).filter(Boolean)
        : [],
      featured: a.featured,
      workTypes: a.workTypes ?? undefined,
      languages: a.languages ?? undefined,
      dialects: a.dialects ?? undefined,
    }));

    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to get artists");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch artists" });
  }
});

router.get("/artists/:id", async (req, res) => {
  try {
    const { id } = GetArtistByIdParams.parse(req.params);

    const [artist] = await db
      .select()
      .from(artistsTable)
      .where(and(eq(artistsTable.id, id), eq(artistsTable.approved, true)));

    if (!artist) {
      res.status(404).json({ error: "not_found", message: "Artist not found" });
      return;
    }

    res.json({
      id: artist.id,
      name: artist.name,
      specialty: artist.specialty,
      country: artist.country,
      city: artist.city ?? undefined,
      experience: artist.experience,
      bio: artist.bio ?? undefined,
      education: artist.education ?? undefined,
      imageUrl: artist.imageUrl ?? undefined,
      portfolioLinks: artist.portfolioLinks
        ? artist.portfolioLinks.split(",").map((l) => l.trim()).filter(Boolean)
        : [],
      works: artist.works
        ? artist.works.split(",").map((w) => w.trim()).filter(Boolean)
        : [],
      featured: artist.featured,
      workTypes: artist.workTypes ?? undefined,
      languages: artist.languages ?? undefined,
      dialects: artist.dialects ?? undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get artist");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch artist" });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const body = SubmitContactRequestBody.parse(req.body);

    const [artist] = await db
      .select({ id: artistsTable.id })
      .from(artistsTable)
      .where(and(eq(artistsTable.id, body.artistId), eq(artistsTable.approved, true)));

    if (!artist) {
      res.status(404).json({ error: "not_found", message: "Artist not found" });
      return;
    }

    const [inserted] = await db
      .insert(contactRequestsTable)
      .values({
        artistId: body.artistId,
        requesterName: body.requesterName,
        company: body.company ?? null,
        projectType: body.projectType,
        budget: body.budget ?? null,
        message: body.message,
      })
      .returning({ id: contactRequestsTable.id });

    res.status(201).json({
      success: true,
      message: "تم إرسال طلب التواصل بنجاح",
      id: String(inserted.id),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact request");
    res.status(400).json({ error: "bad_request", message: "Invalid request data" });
  }
});

const ArtistApplicationBody = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  country: z.string().min(2),
  city: z.string().optional(),
  experience: z.string().min(1),
  bio: z.string().min(10).optional(),
  education: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  portfolioLinks: z.string().optional(),
  works: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7),
  // New fields
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  workTypes: z.string().optional(),
  languages: z.string().optional(),
  dialects: z.string().optional(),
});

router.post("/artists/apply", async (req, res) => {
  try {
    const body = ArtistApplicationBody.parse(req.body);

    const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await db.insert(artistsTable).values({
      id,
      name: body.name,
      specialty: body.specialty,
      country: body.country,
      city: body.city ?? null,
      experience: body.experience,
      bio: body.bio ?? null,
      education: body.education ?? null,
      imageUrl: body.imageUrl && body.imageUrl !== "" ? body.imageUrl : null,
      portfolioLinks: body.portfolioLinks ?? null,
      works: body.works ?? null,
      email: body.email ?? null,
      phone: body.phone,
      gender: body.gender ?? null,
      dateOfBirth: body.dateOfBirth ?? null,
      workTypes: body.workTypes ?? null,
      languages: body.languages ?? null,
      dialects: body.dialects ?? null,
      approved: false,
      featured: false,
    });

    res.status(201).json({
      success: true,
      message: "تم استلام طلبك بنجاح. سيتم مراجعته والرد عليك قريباً.",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit artist application");
    res.status(400).json({ error: "bad_request", message: "بيانات غير صالحة" });
  }
});

export default router;
