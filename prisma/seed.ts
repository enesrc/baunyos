import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "crypto";
import "dotenv/config";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Slider ──────────────────────────────────────────────
  const sliderCount = await prisma.slider.count();
  if (sliderCount === 0) {
    await prisma.slider.createMany({
      data: [
        {
          image_url: "/uploads/1772145333776-8qj0ilo87j6.jpg",
          title_tr: "Slide 1",
          title_en: "Slide 1",
          order: 1,
          is_active: true,
        },
        {
          image_url: "/uploads/1772189689186-2t1yaeqmyc6.jpg",
          title_tr: "Slide 2",
          title_en: "Slide 2",
          order: 2,
          is_active: true,
        },
        {
          image_url: "/uploads/1772189696930-s2pdgtecu0i.jpg",
          title_tr: "Slide 3",
          title_en: "Slide 3",
          order: 3,
          is_active: true,
        },
        {
          image_url: "/uploads/1772189705904-3adadjalstp.jpg",
          title_tr: "Slide 4",
          title_en: "Slide 4",
          order: 4,
          is_active: true,
        },
      ],
    });
    console.log("✅ 4 slider eklendi.");
  } else {
    console.log("Slider tablosu zaten dolu, atlandı.");
  }

  // ── NavItems ─────────────────────────────────────────────
  const navCount = await prisma.navItem.count();
  if (navCount === 0) {
    // 1. ÖĞRENCİLER İÇİN (dropdown)
    const forStudents = await prisma.navItem.create({
      data: { label_tr: "Öğrenciler İçin", label_en: "For Students", href: null, order: 1, is_active: true },
    });
    await prisma.navItem.createMany({
      data: [
        { label_tr: "Kayıt ve İkamet İzni", label_en: "Registration and Residence Permit", href: "/students/registration", parent_id: forStudents.id, order: 1, is_active: true },
        { label_tr: "İkamet İçin Gerekli Belgeler", label_en: "Documents Required for Residence", href: "/students/residence-documents", parent_id: forStudents.id, order: 2, is_active: true },
        { label_tr: "BAÜn'de Eğitim Öğretim", label_en: "Education at BAU", href: "/students/education", parent_id: forStudents.id, order: 3, is_active: true },
      ],
    });

    // 2. HAKKIMIZDA (dropdown)
    const aboutUs = await prisma.navItem.create({
      data: { label_tr: "Hakkımızda", label_en: "About Us", href: null, order: 2, is_active: true },
    });
    await prisma.navItem.createMany({
      data: [
        { label_tr: "Yönerge", label_en: "Directive", href: "/about/directive", parent_id: aboutUs.id, order: 1, is_active: true },
        { label_tr: "Genel Bilgiler", label_en: "General Information", href: "/about/general", parent_id: aboutUs.id, order: 2, is_active: true },
        { label_tr: "Personel", label_en: "Personnel", href: "/about/personnel", parent_id: aboutUs.id, order: 3, is_active: true },
      ],
    });

    // 3. BAŞVURABİLECEĞİNİZ BÖLÜMLER (dropdown)
    const departments = await prisma.navItem.create({
      data: { label_tr: "Başvurabileceğiniz Bölümler", label_en: "Departments You Can Apply To", href: null, order: 3, is_active: true },
    });
    await prisma.navItem.createMany({
      data: [
        { label_tr: "Lisans", label_en: "Bachelor's", href: "/departments/bachelors", parent_id: departments.id, order: 1, is_active: true },
        { label_tr: "Yüksek Okullar / Meslek Yüksek Okulları", label_en: "Colleges / Vocational Schools", href: "/departments/colleges", parent_id: departments.id, order: 2, is_active: true },
        { label_tr: "Lisansüstü", label_en: "Graduate", href: "/departments/graduate", parent_id: departments.id, order: 3, is_active: true },
      ],
    });

    // 4. ADAYLARIN DİKKATİNE (dropdown)
    const candidates = await prisma.navItem.create({
      data: { label_tr: "Adayların Dikkatine", label_en: "To the Attention of the Candidates", href: null, order: 4, is_active: true },
    });
    await prisma.navItem.createMany({
      data: [
        { label_tr: "Bilgilendirme", label_en: "Information", href: "/candidates/info", parent_id: candidates.id, order: 1, is_active: true },
        { label_tr: "Kayıt İçin Gerekli Evraklar", label_en: "Documents Required for Registration", href: "/candidates/documents", parent_id: candidates.id, order: 2, is_active: true },
        { label_tr: "Başvuru Süreci", label_en: "Application Process", href: "/candidates/process", parent_id: candidates.id, order: 3, is_active: true },
        { label_tr: "TÖMER", label_en: "TÖMER", href: "/candidates/tomer", parent_id: candidates.id, order: 4, is_active: true },
        { label_tr: "Üniversitemizde Kabul Edilen Sınavlar", label_en: "Accepted Exams", href: "/candidates/exams", parent_id: candidates.id, order: 5, is_active: true },
      ],
    });

    // 5. HARÇLAR (link)
    await prisma.navItem.create({
      data: { label_tr: "Harçlar", label_en: "Tuition Fees", href: "/tuition-fees", order: 5, is_active: true },
    });

    console.log("✅ Navbar öğeleri eklendi.");
  } else {
    console.log("NavItem tablosu zaten dolu, atlandı.");
  }

  // ── Announcements ────────────────────────────────────────
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title_tr: "2025-2026 Yabancı Uyruklu Öğrenci Başvuruları TR-YÖS (Tıp Fakültesi)",
          title_en: "2025-2026 Foreign Student Applications TR-YÖS (Faculty of Medicine)",
          content_tr:
            "2025-2026 Uluslararası öğrenci başvurularımız açıklacaktır.\n\nBaşvurmak isteyen adaylarımızın dikkatine!\n\nTR-YÖS puanı ile başvuru için https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx adresini ziyaret ediniz.",
          content_en:
            "Our 2025-2026 international student applications will be announced.\n\nAttention to candidates who wish to apply!\n\nTo apply with TR-YÖS score, please visit https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx",
          published_at: new Date("2025-10-23"),
          is_active: true,
        },
        {
          title_tr: "Yunus Emre Enstitüsü Türkçe Yeterlilik Sınavı",
          title_en: "Yunus Emre Institute Turkish Proficiency Exam",
          content_tr: "Detaylı bilgi için https://www.yee.org.tr adresini ziyaret ediniz.",
          content_en: "For detailed information, please visit https://www.yee.org.tr",
          published_at: new Date("2025-12-22"),
          is_active: true,
        },
        {
          title_tr: "2025-2026 Yabancı Uyruklu Öğrenci Başvuruları (14 Ekim Lise Diploması)",
          title_en: "2025-2026 Foreign Student Applications (October 14 High School Diploma)",
          content_tr:
            "2025-2026 Uluslararası öğrenci başvurularımız 14-15 Ekim 2025 tarihleri arasında açık olacaktır.\n\nBaşvurmak isteyen adaylarımızın dikkatine!\n\nLise diploma puanı ile başvuru için https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx adresini ziyaret ediniz.",
          content_en:
            "Our 2025-2026 international student applications will be open between October 14-15, 2025.\n\nAttention to candidates who wish to apply!\n\nTo apply with high school diploma score, please visit https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx",
          published_at: new Date("2025-10-14"),
          is_active: true,
        },
        {
          title_tr: "Uluslararası Öğrencilere Yönelik Ücretsiz Dış Ticaret Eğitimleri",
          title_en: "Free Foreign Trade Training for International Students",
          content_tr: "İlgili afişe ulaşmak için lütfen ofisimizle iletişime geçiniz.",
          content_en: "Please contact our office to access the related poster.",
          published_at: new Date("2025-10-10"),
          is_active: true,
        },
        {
          title_tr: "Parmak İzi Vermeyen Öğrencilerimizin Dikkatine!!",
          title_en: "Attention to Our Students Who Have Not Given Fingerprints!!",
          content_tr:
            "Uluslararası öğrencilerimizden ikamet süreçleri devam eden öğrencilerimizin parmak izi vermek ve adres kayıt işlemlerini kolaylıkla gerçekleştirmeleri adına mobil göç aracı kampüslerimizde olacaktır. İlgili tarih ve kampüs bilgileri aşağıdaki gibidir:\n\n• 9.10.2025 / 10.10.2025 / 23.10.2025 / 30.10.2025 tarihlerinde saat 10:00 - 16:00 aralığında Necatibey Eğitim Fakültesinde\n• 16.10.2025 tarihinde 10:00 - 16:00 saatleri arasında Çağış kampüsünde parmak izi ve adres kayıt işlemleri gerçekleştirilecektir.\n\nHenüz parmak izi vermemiş ve adres kayıt bilgisi iletmesi gereken öğrencilerin mobil aracı ziyaret etmesi önemle duyurulur.",
          content_en:
            "A mobile immigration vehicle will be on our campuses to help international students whose residence processes are ongoing to easily complete fingerprinting and address registration. The relevant dates and campus information are as follows:\n\n• October 9 / 10 / 23 / 30, 2025 between 10:00 - 16:00 at Necatibey Faculty of Education\n• October 16, 2025 between 10:00 - 16:00 at Çağış Campus for fingerprinting and address registration.\n\nStudents who have not yet given their fingerprints and need to submit address registration information are strongly advised to visit the mobile vehicle.",
          published_at: new Date("2025-10-07"),
          is_active: true,
        },
        {
          title_tr: "2025-2026 Yabancı Uyruklu Öğrenci Başvuruları (25 Eylül Lise Diploması)",
          title_en: "2025-2026 Foreign Student Applications (September 25 High School Diploma)",
          content_tr:
            "2025-2026 Uluslararası öğrenci başvurularımız 25-26 Eylül 2025 tarihleri arasında açık olacaktır.\n\nBaşvurmak isteyen adaylarımızın dikkatine!\n\nLise diploma puanı ile başvuru için https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx adresini ziyaret ediniz.",
          content_en:
            "Our 2025-2026 international student applications will be open between September 25-26, 2025.\n\nAttention to candidates who wish to apply!\n\nTo apply with high school diploma score, please visit https://obs.balikesir.edu.tr/oibs/foa_app/login.aspx",
          published_at: new Date("2025-09-25"),
          is_active: true,
        },
      ],
    });
    console.log("✅ 6 duyuru eklendi.");
  } else {
    console.log("Announcement tablosu zaten dolu, atlandı.");
  }

  // ── Admin User ───────────────────────────────────────────
  const ADMIN_EMAIL = "admin@baunyos.com";
  const ADMIN_PASSWORD = "Admin1234!";

  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingUser) {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    const userId = randomUUID();
    const accountId = randomUUID();
    const now = new Date();

    await prisma.user.create({
      data: {
        id: userId,
        name: "Admin",
        email: ADMIN_EMAIL,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    await prisma.account.create({
      data: {
        id: accountId,
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    });

    console.log("✅ Admin kullanıcısı oluşturuldu.");
    console.log(`   E-posta : ${ADMIN_EMAIL}`);
    console.log(`   Şifre   : ${ADMIN_PASSWORD}`);
  } else {
    console.log("Admin kullanıcısı zaten var, atlandı.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });