import { db, artistsTable } from "@workspace/db";

const sampleArtists = [
  {
    id: "artist-001",
    name: "سارة المنصور",
    specialty: "إخراج مسرحي",
    country: "الكويت",
    city: "الكويت",
    experience: "10+ سنوات",
    bio: "مخرجة مسرحية متخصصة في المسرح المعاصر والكلاسيكي. قدّمت أعمالاً في أهم المسارح العربية والدولية، وحصلت على جوائز عدة في مجال الإخراج المسرحي. تؤمن بأن المسرح مرآة المجتمع وأداة للتغيير.",
    education: "ماجستير إخراج مسرحي - الأكاديمية العربية للفنون، القاهرة",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.youtube.com/watch?v=example1,https://vimeo.com/example1",
    works: "مسرحية الانتظار,مسرحية البيت الأزرق,مسرحية صمت الجدران,مهرجان الكويت المسرحي 2023",
    approved: true,
    featured: true,
  },
  {
    id: "artist-002",
    name: "خالد العمري",
    specialty: "تمثيل",
    country: "مصر",
    city: "القاهرة",
    experience: "15+ سنوات",
    bio: "ممثل محترف له تجربة واسعة في المسرح والسينما والتلفزيون. تخرّج من أكاديمية الفنون ونال تكريمات عديدة على مستوى الوطن العربي. يؤمن بالمسرح كلغة كونية.",
    education: "بكالوريوس تمثيل وإخراج - أكاديمية الفنون، القاهرة",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.youtube.com/watch?v=example2",
    works: "مسرحية القاهرة 30,فيلم طريق الأمل,مسلسل الأبطال,مهرجان القاهرة السينمائي",
    approved: true,
    featured: true,
  },
  {
    id: "artist-003",
    name: "ليلى الزهراني",
    specialty: "تصميم ديكور مسرحي",
    country: "السعودية",
    city: "الرياض",
    experience: "8 سنوات",
    bio: "مصممة ديكور مسرحي إبداعية تجمع بين الأصالة العربية والمعاصرة. ابتكرت بيئات بصرية مؤثرة لأكثر من 30 عرضاً مسرحياً. خريجة مدرسة الفنون التطبيقية بلندن.",
    education: "دبلوم تصميم مسرحي - Central Saint Martins، لندن",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.behance.net/example,https://www.instagram.com/example",
    works: "ديكور مسرحية ألف ليلة,تصميم خشبة مهرجان الرياض,معرض الفن المسرحي 2022,مشروع الضوء والظل",
    approved: true,
    featured: true,
  },
  {
    id: "artist-004",
    name: "أحمد الرشيد",
    specialty: "كتابة نصوص مسرحية",
    country: "الأردن",
    city: "عمّان",
    experience: "12 سنوات",
    bio: "كاتب مسرحي متميز يُعدّ من أبرز أقلام المسرح العربي المعاصر. يكتب بأسلوب يجمع بين الواقعية والسريالية، وتُرجمت أعماله إلى سبع لغات. فاز بجائزة أفضل نص مسرحي عربي ثلاث مرات.",
    education: "دكتوراه في الأدب المسرحي - جامعة اليرموك",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.goodreads.com/author/example",
    works: "نص الغرفة الأخيرة,نص على حافة الهاوية,نص رسائل إلى المجهول,نص في الظلام",
    approved: true,
    featured: false,
  },
  {
    id: "artist-005",
    name: "نور الحداد",
    specialty: "تصميم إضاءة مسرحية",
    country: "لبنان",
    city: "بيروت",
    experience: "6 سنوات",
    bio: "مصممة إضاءة مسرحية شابة ومبدعة، درست في معهد الفنون بباريس. تُقدّم الإضاءة كعنصر درامي فاعل لا مجرد إضاءة. عملت مع كبرى الفرق المسرحية في بيروت وأوروبا.",
    education: "ماجستير تصميم إضاءة - ESAD، باريس",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.instagram.com/example,https://vimeo.com/example2",
    works: "إضاءة مسرحية في الشتاء,مشروع الألوان والمشاعر,إضاءة مهرجان بيروت الدولي,تصميم ضوء نور",
    approved: true,
    featured: false,
  },
  {
    id: "artist-006",
    name: "يوسف القحطاني",
    specialty: "تمثيل وإدارة إنتاج",
    country: "قطر",
    city: "الدوحة",
    experience: "20+ سنوات",
    bio: "فنان متعدد المواهب يجمع بين التمثيل وإدارة الإنتاج المسرحي. أسّس شركته للإنتاج الفني وأنتج أكثر من 50 عرضاً مسرحياً على مستوى الخليج والوطن العربي. أحد أبرز رواد المسرح الخليجي.",
    education: "ماجستير فنون مسرحية - جامعة قطر",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
    portfolioLinks: "https://www.linkedin.com/in/example",
    works: "إنتاج مهرجان الدوحة المسرحي,مسرحية البحر والرمل,إنتاج الموسم الثقافي 2023,دور البطولة في ألف ليلة",
    approved: true,
    featured: true,
  },
];

async function seed() {
  console.log("Seeding artists...");
  
  for (const artist of sampleArtists) {
    await db
      .insert(artistsTable)
      .values(artist)
      .onConflictDoUpdate({
        target: artistsTable.id,
        set: {
          name: artist.name,
          specialty: artist.specialty,
          country: artist.country,
          city: artist.city,
          experience: artist.experience,
          bio: artist.bio,
          education: artist.education,
          imageUrl: artist.imageUrl,
          portfolioLinks: artist.portfolioLinks,
          works: artist.works,
          approved: artist.approved,
          featured: artist.featured,
        },
      });
    console.log(`Seeded artist: ${artist.name}`);
  }
  
  console.log("Done seeding artists!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
