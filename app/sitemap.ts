import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://edu.heyhaqi.my.id';

  // Dynamic simulation slugs from our Arshaka catalog
  const simulationSlugs = [
    // Fisika
    "generator-motor", "semikonduktor", "gelombang-suara", "interferensi-gelombang",
    "efek-doppler", "resonansi", "pemantulan-pembiasan", "dispersi-cahaya",
    "difraksi-cahaya", "polarisasi-cahaya", "efek-fotolistrik", "model-atom",
    "peluruhan-radioaktif", "fisi-fusi-nuklir", "relativitas-khusus", "gelombang-tali",
    "gerak-proyektil", "gravitasi-orbit", "hukum-newton", "optik-lensa",
    "termodinamika", "rangkaian-listrik", "medan-magnet",

    // Kimia
    "penyeimbangan-persamaan", "tabel-periodik", "asam-basa", "reaksi-kimia",
    "struktur-atom", "ikatan-kimia", "konfigurasi-elektron", "ion-isotop",
    "bentuk-molekul", "polaritas-molekul", "gaya-antarmolekul", "stoikiometri",
    "laju-reaksi", "kesetimbangan-kimia", "elektrokimia", "titrasi-asam-basa",
    "sifat-koligatif", "koloid-suspensi", "gugus-fungsi", "polimer",

    // Matematika
    "pecahan-desimal", "garis-bilangan", "faktor-kelipatan", "teorema-pythagoras",
    "sistem-persamaan", "kesebangunan", "fungsi-kuadrat", "eksponen-logaritma",
    "komposisi-fungsi", "grafik-fungsi", "geometri-interaktif", "kubus",
    "balok", "tabung", "kerucut", "bola", "kalkulus-visual",
    "statistik-probabilitas", "matriks-transformasi", "aljabar-linear",
    "trigonometri", "peluang-dasar", "vektor-visual", "bilangan-kompleks",
    "barisan-deret",

    // Biologi
    "sel-organel", "fotosintesis", "genetika-dna", "ekosistem", "tubuh-manusia",
    "evolusi", "reproduksi-sel", "transpor-membran", "respirasi-seluler",
    "sintesis-protein", "sistem-saraf", "efek-rumah-kaca", "mutasi-genetik",
    "sistem-peredaran-darah", "sistem-pernapasan", "sistem-pencernaan",
    "sistem-imun", "pohon-filogenetik", "sistem-hormon", "sistem-ekskresi",
    "siklus-biogeokimia", "dinamika-populasi",

    // Ilmu Bumi & Geografi
    "struktur-bumi", "tektonik-lempeng", "gunung-berapi", "siklus-batuan",
    "lapisan-atmosfer", "gempa-bumi", "siklus-air", "cuaca-iklim", "arus-laut", "zona-waktu",

    // Bahasa & Linguistik
    "struktur-kalimat", "jenis-kata", "majas-gaya-bahasa", "sintaksis",
    "fonetik-pengucapan", "ejaan-tanda-baca", "paragraf-wacana", "teks-genre",
    "peta-kata", "morfologi",

    // Ekonomi & Akuntansi
    "penawaran-permintaan", "inflasi-deflasi", "persamaan-akuntansi",
    "simulasi-saham", "kebijakan-fiskal-moneter", "elastisitas", "struktur-pasar",
    "siklus-akuntansi", "pajak-dasar"
  ];

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/simulasi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/donasi`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    }
  ];

  // Simulation dynamic routes
  const dynamicRoutes = simulationSlugs.map((slug) => ({
    url: `${baseUrl}/simulasi/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...dynamicRoutes];
}
