"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, Settings, Info, RefreshCw, ChevronRight } from "lucide-react";

// ── Simulation imports ──────────────────────────────────────────────────────
// Fisika
import GelombangTali from "@/simulations/fisika/GelombangTali";
import GerakProyektil from "@/simulations/fisika/GerakProyektil";
import GravitasiOrbit from "@/simulations/fisika/GravitasiOrbit";
import HukumNewton from "@/simulations/fisika/HukumNewton";
import OptikLensa from "@/simulations/fisika/OptikLensa";
import Termodinamika from "@/simulations/fisika/Termodinamika";
import RangkaianListrik from "@/simulations/fisika/RangkaianListrik";
import MedanMagnet from "@/simulations/fisika/MedanMagnet";
import GerakLurus from "@/simulations/fisika/GerakLurus";
import GayaGesek from "@/simulations/fisika/GayaGesek";
import GayaGerakDasar from "@/simulations/fisika/GayaGerakDasar";
import KeseimbanganTorsi from "@/simulations/fisika/KeseimbanganTorsi";
import GerakMelingkar from "@/simulations/fisika/GerakMelingkar";
import Tumbukan from "@/simulations/fisika/Tumbukan";
import MomentumImpuls from "@/simulations/fisika/MomentumImpuls";
import EnergiSkatePark from "@/simulations/fisika/EnergiSkatePark";
import PegasHukumHooke from "@/simulations/fisika/PegasHukumHooke";
import BandulSederhana from "@/simulations/fisika/BandulSederhana";
import TekananHidrostatis from "@/simulations/fisika/TekananHidrostatis";
import HukumArchimedes from "@/simulations/fisika/HukumArchimedes";
import AliranFluida from "@/simulations/fisika/AliranFluida";
import PrinsipBernoulli from "@/simulations/fisika/PrinsipBernoulli";
import TekananGas from "@/simulations/fisika/TekananGas";
import TeganganPermukaan from "@/simulations/fisika/TeganganPermukaan";
import Viskositas from "@/simulations/fisika/Viskositas";
import SuhuKalor from "@/simulations/fisika/SuhuKalor";
import PerpindahanPanas from "@/simulations/fisika/PerpindahanPanas";
import PerubahanWujudZat from "@/simulations/fisika/PerubahanWujudZat";
import HukumGasIdeal from "@/simulations/fisika/HukumGasIdeal";
import MesinCarnot from "@/simulations/fisika/MesinCarnot";
import Entropi from "@/simulations/fisika/Entropi";
import HukumCoulomb from "@/simulations/fisika/HukumCoulomb";
import MuatanMedanListrik from "@/simulations/fisika/MuatanMedanListrik";
import PotensialListrik from "@/simulations/fisika/PotensialListrik";
import Kapasitor from "@/simulations/fisika/Kapasitor";
import HukumOhm from "@/simulations/fisika/HukumOhm";
import RangkaianAC from "@/simulations/fisika/RangkaianAC";
import InduksiFaraday from "@/simulations/fisika/InduksiFaraday";
import GeneratorMotor from "@/simulations/fisika/GeneratorMotor";
import Semikonduktor from "@/simulations/fisika/Semikonduktor";
import GelombangSuara from "@/simulations/fisika/GelombangSuara";
import InterferensiGelombang from "@/simulations/fisika/InterferensiGelombang";
import EfekDoppler from "@/simulations/fisika/EfekDoppler";
import Resonansi from "@/simulations/fisika/Resonansi";
import PemantulanPembiasan from "@/simulations/fisika/PemantulanPembiasan";
import DispersiCahaya from "@/simulations/fisika/DispersiCahaya";
import DifraksiCahaya from "@/simulations/fisika/DifraksiCahaya";
import PolarisasiCahaya from "@/simulations/fisika/PolarisasiCahaya";
import EfekFotolistrik from "@/simulations/fisika/EfekFotolistrik";
import ModelAtomBohr from "@/simulations/fisika/ModelAtomBohr";
import PeluruhanRadioaktif from "@/simulations/fisika/PeluruhanRadioaktif";
import FisiFusiNuklir from "@/simulations/fisika/FisiFusiNuklir";
import RelativitasKhusus from "@/simulations/fisika/RelativitasKhusus";
// Kimia
import PenyeimbanganPersamaan from "@/simulations/kimia/PenyeimbanganPersamaan";
import TabelPeriodik from "@/simulations/kimia/TabelPeriodik";
import AsamBasa from "@/simulations/kimia/AsamBasa";
import ReaksiKimia from "@/simulations/kimia/ReaksiKimia";
import StrukturAtom from "@/simulations/kimia/StrukturAtom";
import IkatanKimia from "@/simulations/kimia/IkatanKimia";
import KonfigurasiElektron from "@/simulations/kimia/KonfigurasiElektron";
import IonIsotop from "@/simulations/kimia/IonIsotop";
import BentukMolekul from "@/simulations/kimia/BentukMolekul";
import PolaritasMolekul from "@/simulations/kimia/PolaritasMolekul";
import GayaAntarmolekul from "@/simulations/kimia/GayaAntarmolekul";
import Stoikiometri from "@/simulations/kimia/Stoikiometri";
import LajuReaksi from "@/simulations/kimia/LajuReaksi";
import KesetimbanganKimia from "@/simulations/kimia/KesetimbanganKimia";
import Elektrokimia from "@/simulations/kimia/Elektrokimia";
import TitrasiAsamBasa from "@/simulations/kimia/TitrasiAsamBasa";
import SifatKoligatif from "@/simulations/kimia/SifatKoligatif";
import KoloidSuspensi from "@/simulations/kimia/KoloidSuspensi";
import GugusFungsi from "@/simulations/kimia/GugusFungsi";
import Polimer from "@/simulations/kimia/Polimer";
// Matematika
import GrafikFungsi from "@/simulations/matematika/GrafikFungsi";
import GeometriInteraktif from "@/simulations/matematika/GeometriInteraktif";
import Kubus from "@/simulations/matematika/Kubus";
import Balok from "@/simulations/matematika/Balok";
import Tabung from "@/simulations/matematika/Tabung";
import Kerucut from "@/simulations/matematika/Kerucut";
import Bola from "@/simulations/matematika/Bola";
import KalkulusVisual from "@/simulations/matematika/KalkulusVisual";
import StatistikProbabilitas from "@/simulations/matematika/StatistikProbabilitas";
import MatriksTransformasi from "@/simulations/matematika/MatriksTransformasi";
import AljabarLinear from "@/simulations/matematika/AljabarLinear";
import Trigonometri from "@/simulations/matematika/Trigonometri";
import PecahanDesimal from "@/simulations/matematika/PecahanDesimal";
import GarisBilangan from "@/simulations/matematika/GarisBilangan";
import FaktorKelipatan from "@/simulations/matematika/FaktorKelipatan";
import TeoremaPythagoras from "@/simulations/matematika/TeoremaPythagoras";
import SistemPersamaan from "@/simulations/matematika/SistemPersamaan";
import Kesebangunan from "@/simulations/matematika/Kesebangunan";
import FungsiKuadrat from "@/simulations/matematika/FungsiKuadrat";
import EksponenLogaritma from "@/simulations/matematika/EksponenLogaritma";
import KomposisiFungsi from "@/simulations/matematika/KomposisiFungsi";
import PeluangDasar from "@/simulations/matematika/PeluangDasar";
import VektorVisual from "@/simulations/matematika/VektorVisual";
import BilanganKompleks from "@/simulations/matematika/BilanganKompleks";
import BarisanDeret from "@/simulations/matematika/BarisanDeret";
// Biologi
import SelOrganel from "@/simulations/biologi/SelOrganel";
import Fotosintesis from "@/simulations/biologi/Fotosintesis";
import GenetikaDNA from "@/simulations/biologi/GenetikaDNA";
import Ekosistem from "@/simulations/biologi/Ekosistem";
import TubuhManusia from "@/simulations/biologi/TubuhManusia";
import Evolusi from "@/simulations/biologi/Evolusi";
import ReproduksiSel from "@/simulations/biologi/ReproduksiSel";
import TransporMembran from "@/simulations/biologi/TransporMembran";
import RespirasiSeluler from "@/simulations/biologi/RespirasiSeluler";
import SintesisProtein from "@/simulations/biologi/SintesisProtein";
import SistemSaraf from "@/simulations/biologi/SistemSaraf";
import EfekRumahKaca from "@/simulations/biologi/EfekRumahKaca";
import MutasiGenetik from "@/simulations/biologi/MutasiGenetik";
import SistemPeredaranDarah from "@/simulations/biologi/SistemPeredaranDarah";
import SistemPernapasan from "@/simulations/biologi/SistemPernapasan";
import SistemPencernaan from "@/simulations/biologi/SistemPencernaan";
import SistemImun from "@/simulations/biologi/SistemImun";
import PohonFilogenetik from "@/simulations/biologi/PohonFilogenetik";
import SistemHormon from "@/simulations/biologi/SistemHormon";
import SistemEkskresi from "@/simulations/biologi/SistemEkskresi";
import SiklusBiogeokimia from "@/simulations/biologi/SiklusBiogeokimia";
import DinamikaPopulasi from "@/simulations/biologi/DinamikaPopulasi";
// Geografi
import StrukturBumi from "@/simulations/geografi/StrukturBumi";
import TektonikLempeng from "@/simulations/geografi/TektonikLempeng";
import GunungBerapi from "@/simulations/geografi/GunungBerapi";
import SiklusBatuan from "@/simulations/geografi/SiklusBatuan";
import LapisanAtmosfer from "@/simulations/geografi/LapisanAtmosfer";
import GempaBumi from "@/simulations/geografi/GempaBumi";
import SiklusAir from "@/simulations/geografi/SiklusAir";
import CuacaIklim from "@/simulations/geografi/CuacaIklim";
import ArusLaut from "@/simulations/geografi/ArusLaut";
import ZonaWaktu from "@/simulations/geografi/ZonaWaktu";
// Bahasa
import StrukturKalimat from "@/simulations/bahasa/StrukturKalimat";
import JenisKata from "@/simulations/bahasa/JenisKata";
import MajasGayaBahasa from "@/simulations/bahasa/MajasGayaBahasa";
import Sintaksis from "@/simulations/bahasa/Sintaksis";
import FonetikPengucapan from "@/simulations/bahasa/FonetikPengucapan";
import EjaanTandaBaca from "@/simulations/bahasa/EjaanTandaBaca";
import ParagrafWacana from "@/simulations/bahasa/ParagrafWacana";
import TeksGenre from "@/simulations/bahasa/TeksGenre";
import PetaKata from "@/simulations/bahasa/PetaKata";
import Morfologi from "@/simulations/bahasa/Morfologi";
// Ekonomi
import PenawaranPermintaan from "@/simulations/ekonomi/PenawaranPermintaan";
import InflasiDeflasi from "@/simulations/ekonomi/InflasiDeflasi";
import PersamaanAkuntansi from "@/simulations/ekonomi/PersamaanAkuntansi";
import SimulasiSaham from "@/simulations/ekonomi/SimulasiSaham";
import KebijakanFiskalMoneter from "@/simulations/ekonomi/KebijakanFiskalMoneter";
import Elastisitas from "@/simulations/ekonomi/Elastisitas";
import StrukturPasar from "@/simulations/ekonomi/StrukturPasar";
import SiklusAkuntansi from "@/simulations/ekonomi/SiklusAkuntansi";
import PajakDasar from "@/simulations/ekonomi/PajakDasar";
import NilaiWaktuUang from "@/simulations/ekonomi/NilaiWaktuUang";
// Sejarah
import SejarahIndonesia from "@/simulations/sejarah/SejarahIndonesia";
import KerajaanNusantara from "@/simulations/sejarah/KerajaanNusantara";
import PerjuanganKemerdekaan from "@/simulations/sejarah/PerjuanganKemerdekaan";
import PeradabanKuno from "@/simulations/sejarah/PeradabanKuno";
import PerangDunia from "@/simulations/sejarah/PerangDunia";
import SistemPemerintahan from "@/simulations/sejarah/SistemPemerintahan";
import DemokrasiPemilu from "@/simulations/sejarah/DemokrasiPemilu";
import LembagaNegara from "@/simulations/sejarah/LembagaNegara";
import InteraksiSosial from "@/simulations/sejarah/InteraksiSosial";
import MobilitasSosial from "@/simulations/sejarah/MobilitasSosial";
// Teknologi
import AlgoritmaFlowchart from "@/simulations/teknologi/AlgoritmaFlowchart";
import SortingVisual from "@/simulations/teknologi/SortingVisual";
import SearchingVisual from "@/simulations/teknologi/SearchingVisual";
import StrukturData from "@/simulations/teknologi/StrukturData";
import RekursiVisual from "@/simulations/teknologi/RekursiVisual";
import KompleksitasAlgoritma from "@/simulations/teknologi/KompleksitasAlgoritma";
import JaringanKomputer from "@/simulations/teknologi/JaringanKomputer";
import ModelOSI from "@/simulations/teknologi/ModelOSI";
import DnsHttp from "@/simulations/teknologi/DnsHttp";
import KeamananJaringan from "@/simulations/teknologi/KeamananJaringan";
import SistemBilangan from "@/simulations/teknologi/SistemBilangan";
import GerbangLogika from "@/simulations/teknologi/GerbangLogika";
import ArsitekturCpu from "@/simulations/teknologi/ArsitekturCpu";
import MachineLearning from "@/simulations/teknologi/MachineLearning";
import VisualisasiData from "@/simulations/teknologi/VisualisasiData";
// Seni
import TeoriWarna from "@/simulations/seni/TeoriWarna";
import PerspektifSeni from "@/simulations/seni/PerspektifSeni";
import KomposisiDesain from "@/simulations/seni/KomposisiDesain";
import DesainBatik from "@/simulations/seni/DesainBatik";
import SeniUkir from "@/simulations/seni/SeniUkir";
import NotRitme from "@/simulations/seni/NotRitme";
import TanggaNada from "@/simulations/seni/TanggaNada";
import GelombangTimbre from "@/simulations/seni/GelombangTimbre";
import AlatMusikTradisional from "@/simulations/seni/AlatMusikTradisional";
import BudayaTariWayang from "@/simulations/seni/BudayaTariWayang";
// Astronomi
import TataSurya from "@/simulations/astronomi/TataSurya";
import FaseBulan from "@/simulations/astronomi/FaseBulan";
import Gerhana from "@/simulations/astronomi/Gerhana";
import SiklusBintang from "@/simulations/astronomi/SiklusBintang";
import GalaksiAlamSemesta from "@/simulations/astronomi/GalaksiAlamSemesta";
import PasangSurut from "@/simulations/astronomi/PasangSurut";
import RotasiBumi from "@/simulations/astronomi/RotasiBumi";
import AsteroidMeteor from "@/simulations/astronomi/AsteroidMeteor";
import TeleskopSpektrum from "@/simulations/astronomi/TeleskopSpektrum";
import HabitableAurora from "@/simulations/astronomi/HabitableAurora";
// Kesehatan
import IlusiOptik from "@/simulations/psikologi_kesehatan/IlusiOptik";
import MemoriBelajar from "@/simulations/psikologi_kesehatan/MemoriBelajar";
import EmosiMental from "@/simulations/psikologi_kesehatan/EmosiMental";
import KalkulatorIMT from "@/simulations/psikologi_kesehatan/KalkulatorIMT";
import SimulasiP3K from "@/simulations/psikologi_kesehatan/SimulasiP3K";

// ── Slug → title helper ─────────────────────────────────────────────────────
function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── renderSimulation ────────────────────────────────────────────────────────
function renderSimulation(slug: string) {
  switch (slug) {
    // Fisika
    case "gerak-lurus": return <GerakLurus />;
    case "gaya-gesek": return <GayaGesek />;
    case "gaya-gerak-dasar": return <GayaGerakDasar />;
    case "keseimbangan-torsi": return <KeseimbanganTorsi />;
    case "gerak-melingkar": return <GerakMelingkar />;
    case "tumbukan": return <Tumbukan />;
    case "momentum-impuls": return <MomentumImpuls />;
    case "energi-skate-park": return <EnergiSkatePark />;
    case "pegas-hukum-hooke": return <PegasHukumHooke />;
    case "bandul-sederhana": return <BandulSederhana />;
    case "tekanan-hidrostatis": return <TekananHidrostatis />;
    case "hukum-archimedes": return <HukumArchimedes />;
    case "aliran-fluida": return <AliranFluida />;
    case "prinsip-bernoulli": return <PrinsipBernoulli />;
    case "tekanan-gas": return <TekananGas />;
    case "tegangan-permukaan": return <TeganganPermukaan />;
    case "viskositas": return <Viskositas />;
    case "suhu-kalor": return <SuhuKalor />;
    case "perpindahan-panas": return <PerpindahanPanas />;
    case "perubahan-wujud-zat": return <PerubahanWujudZat />;
    case "hukum-gas-ideal": return <HukumGasIdeal />;
    case "mesin-carnot": return <MesinCarnot />;
    case "entropi": return <Entropi />;
    case "hukum-coulomb": return <HukumCoulomb />;
    case "muatan-medan-listrik": return <MuatanMedanListrik />;
    case "potensial-listrik": return <PotensialListrik />;
    case "kapasitor": return <Kapasitor />;
    case "hukum-ohm": return <HukumOhm />;
    case "rangkaian-ac": return <RangkaianAC />;
    case "induksi-faraday": return <InduksiFaraday />;
    case "generator-motor": return <GeneratorMotor />;
    case "semikonduktor": return <Semikonduktor />;
    case "gelombang-suara": return <GelombangSuara />;
    case "interferensi-gelombang": return <InterferensiGelombang />;
    case "efek-doppler": return <EfekDoppler />;
    case "resonansi": return <Resonansi />;
    case "pemantulan-pembiasan": return <PemantulanPembiasan />;
    case "dispersi-cahaya": return <DispersiCahaya />;
    case "difraksi-cahaya": return <DifraksiCahaya />;
    case "polarisasi-cahaya": return <PolarisasiCahaya />;
    case "efek-fotolistrik": return <EfekFotolistrik />;
    case "model-atom": return <ModelAtomBohr />;
    case "peluruhan-radioaktif": return <PeluruhanRadioaktif />;
    case "fisi-fusi-nuklir": return <FisiFusiNuklir />;
    case "relativitas-khusus": return <RelativitasKhusus />;
    case "gelombang-tali": return <GelombangTali />;
    case "gerak-proyektil": return <GerakProyektil />;
    case "gravitasi-orbit": return <GravitasiOrbit />;
    case "hukum-newton": return <HukumNewton />;
    case "optik-lensa": return <OptikLensa />;
    case "termodinamika": return <Termodinamika />;
    case "rangkaian-listrik": return <RangkaianListrik />;
    case "medan-magnet": return <MedanMagnet />;
    // Kimia
    case "penyeimbangan-persamaan": return <PenyeimbanganPersamaan />;
    case "tabel-periodik": return <TabelPeriodik />;
    case "asam-basa": return <AsamBasa />;
    case "reaksi-kimia": return <ReaksiKimia />;
    case "struktur-atom": return <StrukturAtom />;
    case "ikatan-kimia": return <IkatanKimia />;
    case "konfigurasi-elektron": return <KonfigurasiElektron />;
    case "ion-isotop": return <IonIsotop />;
    case "bentuk-molekul": return <BentukMolekul />;
    case "polaritas-molekul": return <PolaritasMolekul />;
    case "gaya-antarmolekul": return <GayaAntarmolekul />;
    case "stoikiometri": return <Stoikiometri />;
    case "laju-reaksi": return <LajuReaksi />;
    case "kesetimbangan-kimia": return <KesetimbanganKimia />;
    case "elektrokimia": return <Elektrokimia />;
    case "titrasi-asam-basa": return <TitrasiAsamBasa />;
    case "sifat-koligatif": return <SifatKoligatif />;
    case "koloid-suspensi": return <KoloidSuspensi />;
    case "gugus-fungsi": return <GugusFungsi />;
    case "polimer": return <Polimer />;
    // Matematika
    case "pecahan-desimal": return <PecahanDesimal />;
    case "garis-bilangan": return <GarisBilangan />;
    case "faktor-kelipatan": return <FaktorKelipatan />;
    case "teorema-pythagoras": return <TeoremaPythagoras />;
    case "sistem-persamaan": return <SistemPersamaan />;
    case "kesebangunan": return <Kesebangunan />;
    case "fungsi-kuadrat": return <FungsiKuadrat />;
    case "eksponen-logaritma": return <EksponenLogaritma />;
    case "komposisi-fungsi": return <KomposisiFungsi />;
    case "grafik-fungsi": return <GrafikFungsi />;
    case "geometri-interaktif": return <GeometriInteraktif />;
    case "kubus": return <Kubus />;
    case "balok": return <Balok />;
    case "tabung": return <Tabung />;
    case "kerucut": return <Kerucut />;
    case "bola": return <Bola />;
    case "kalkulus-visual": return <KalkulusVisual />;
    case "statistik-probabilitas": return <StatistikProbabilitas />;
    case "matriks-transformasi": return <MatriksTransformasi />;
    case "aljabar-linear": return <AljabarLinear />;
    case "trigonometri": return <Trigonometri />;
    case "peluang-dasar": return <PeluangDasar />;
    case "vektor-visual": return <VektorVisual />;
    case "bilangan-kompleks": return <BilanganKompleks />;
    case "barisan-deret": return <BarisanDeret />;
    // Biologi
    case "sel-organel": return <SelOrganel />;
    case "fotosintesis": return <Fotosintesis />;
    case "genetika-dna": return <GenetikaDNA />;
    case "ekosistem": return <Ekosistem />;
    case "tubuh-manusia": return <TubuhManusia />;
    case "evolusi": return <Evolusi />;
    case "reproduksi-sel": return <ReproduksiSel />;
    case "transpor-membran": return <TransporMembran />;
    case "respirasi-seluler": return <RespirasiSeluler />;
    case "sintesis-protein": return <SintesisProtein />;
    case "sistem-saraf": return <SistemSaraf />;
    case "efek-rumah-kaca": return <EfekRumahKaca />;
    case "mutasi-genetik": return <MutasiGenetik />;
    case "sistem-peredaran-darah": return <SistemPeredaranDarah />;
    case "sistem-pernapasan": return <SistemPernapasan />;
    case "sistem-pencernaan": return <SistemPencernaan />;
    case "sistem-imun": return <SistemImun />;
    case "pohon-filogenetik": return <PohonFilogenetik />;
    case "sistem-hormon": return <SistemHormon />;
    case "sistem-ekskresi": return <SistemEkskresi />;
    case "siklus-biogeokimia": return <SiklusBiogeokimia />;
    case "dinamika-populasi": return <DinamikaPopulasi />;
    // Geografi
    case "struktur-bumi": return <StrukturBumi />;
    case "tektonik-lempeng": return <TektonikLempeng />;
    case "gunung-berapi": return <GunungBerapi />;
    case "siklus-batuan": return <SiklusBatuan />;
    case "lapisan-atmosfer": return <LapisanAtmosfer />;
    case "gempa-bumi": return <GempaBumi />;
    case "siklus-air": return <SiklusAir />;
    case "cuaca-iklim": return <CuacaIklim />;
    case "arus-laut": return <ArusLaut />;
    case "zona-waktu": return <ZonaWaktu />;
    // Bahasa
    case "struktur-kalimat": return <StrukturKalimat />;
    case "jenis-kata": return <JenisKata />;
    case "majas-gaya-bahasa": return <MajasGayaBahasa />;
    case "sintaksis": return <Sintaksis />;
    case "fonetik-pengucapan": return <FonetikPengucapan />;
    case "ejaan-tanda-baca": return <EjaanTandaBaca />;
    case "paragraf-wacana": return <ParagrafWacana />;
    case "teks-genre": return <TeksGenre />;
    case "peta-kata": return <PetaKata />;
    case "morfologi": return <Morfologi />;
    // Ekonomi
    case "penawaran-permintaan": return <PenawaranPermintaan />;
    case "inflasi-deflasi": return <InflasiDeflasi />;
    case "persamaan-akuntansi": return <PersamaanAkuntansi />;
    case "simulasi-saham": return <SimulasiSaham />;
    case "kebijakan-fiskal-moneter": return <KebijakanFiskalMoneter />;
    case "elastisitas": return <Elastisitas />;
    case "struktur-pasar": return <StrukturPasar />;
    case "siklus-akuntansi": return <SiklusAkuntansi />;
    case "pajak-dasar": return <PajakDasar />;
    case "nilai-waktu-uang": return <NilaiWaktuUang />;
    // Sejarah
    case "sejarah-indonesia": return <SejarahIndonesia />;
    case "kerajaan-nusantara": return <KerajaanNusantara />;
    case "perjuangan-kemerdekaan": return <PerjuanganKemerdekaan />;
    case "peradaban-kuno": return <PeradabanKuno />;
    case "perang-dunia": return <PerangDunia />;
    case "sistem-pemerintahan": return <SistemPemerintahan />;
    case "demokrasi-pemilu": return <DemokrasiPemilu />;
    case "lembaga-negara": return <LembagaNegara />;
    case "interaksi-sosial": return <InteraksiSosial />;
    case "mobilitas-sosial": return <MobilitasSosial />;
    // Teknologi
    case "algoritma-flowchart": return <AlgoritmaFlowchart />;
    case "sorting-visual": return <SortingVisual />;
    case "searching-visual": return <SearchingVisual />;
    case "struktur-data": return <StrukturData />;
    case "rekursi": return <RekursiVisual />;
    case "kompleksitas-algoritma": return <KompleksitasAlgoritma />;
    case "jaringan-komputer": return <JaringanKomputer />;
    case "model-osi": return <ModelOSI />;
    case "dns-http": return <DnsHttp />;
    case "keamanan-jaringan": return <KeamananJaringan />;
    case "sistem-bilangan": return <SistemBilangan />;
    case "gerbang-logika": return <GerbangLogika />;
    case "arsitektur-cpu": return <ArsitekturCpu />;
    case "machine-learning": return <MachineLearning />;
    case "visualisasi-data": return <VisualisasiData />;
    // Seni
    case "teori-warna": return <TeoriWarna />;
    case "perspektif-seni": return <PerspektifSeni />;
    case "komposisi-desain": return <KomposisiDesain />;
    case "desain-batik": return <DesainBatik />;
    case "seni-ukir": return <SeniUkir />;
    case "not-ritme": return <NotRitme />;
    case "tangga-nada": return <TanggaNada />;
    case "gelombang-timbre": return <GelombangTimbre />;
    case "alat-musik-tradisional": return <AlatMusikTradisional />;
    case "budaya-tari-wayang": return <BudayaTariWayang />;
    // Astronomi
    case "tata-surya": return <TataSurya />;
    case "fase-bulan": return <FaseBulan />;
    case "gerhana": return <Gerhana />;
    case "siklus-bintang": return <SiklusBintang />;
    case "galaksi-alam-semesta": return <GalaksiAlamSemesta />;
    case "pasang-surut": return <PasangSurut />;
    case "rotasi-bumi": return <RotasiBumi />;
    case "asteroid-meteor": return <AsteroidMeteor />;
    case "teleskop-spektrum": return <TeleskopSpektrum />;
    case "zona-layak-huni": return <HabitableAurora />;
    // Kesehatan
    case "ilusi-optik": return <IlusiOptik />;
    case "memori-belajar": return <MemoriBelajar />;
    case "emosi-mental": return <EmosiMental />;
    case "kalkulator-imt": return <KalkulatorIMT />;
    case "simulasi-p3k": return <SimulasiP3K />;

    default: return null;
  }
}

// ── Component ───────────────────────────────────────────────────────────────
export default function SimulationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const title = slugToTitle(slug);
  const simulation = renderSimulation(slug);

  return (
    <div className="flex flex-col min-h-screen bg-black">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-20 h-12 sm:h-13 border-b border-white/[0.07] bg-zinc-950/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-5 gap-3">

        {/* Left: back + breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            href="/simulasi"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.07] text-zinc-400 hover:text-white transition-all group"
            aria-label="Kembali ke katalog"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Katalog</span>
          </Link>

          <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0 hidden sm:block" />

          <h1 className="text-xs sm:text-sm font-black text-white truncate tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/[0.07] transition-all"
            title="Informasi"
            aria-label="Informasi simulasi"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/[0.07] transition-all"
            title="Pengaturan"
            aria-label="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/[0.07] transition-all"
            title="Layar Penuh"
            aria-label="Layar penuh"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Canvas ── */}
      <main className="flex-1 flex flex-col overflow-auto">
        {simulation ?? <ComingSoon title={title} />}
      </main>
    </div>
  );
}

// ── Coming Soon fallback ────────────────────────────────────────────────────
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 bg-zinc-950">
      <div className="w-full max-w-sm mx-auto text-center space-y-5 p-6 sm:p-8 bg-white/[0.03] border border-white/[0.07] rounded-2xl sm:rounded-[28px]">
        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">Segera Hadir</h2>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-medium">
            Simulasi{" "}
            <span className="text-indigo-400 font-bold">"{title}"</span>{" "}
            sedang dalam pengembangan tim Arshaka Edu.
          </p>
        </div>

        <Link
          href="/simulasi"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="w-3 h-3" />
          Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
}