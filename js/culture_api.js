/**
 * CultureAPI - 12 Haftalık Kademeli Genel Kültür Öğrenme Takvimi & Not Sistemi
 * Supabase Table: culture_study_notes (with localStorage fallback)
 */

(function () {
  const CULTURE_STORAGE_KEY = "oyp_culture_notes_v3";
  const SELECTED_WEEK_KEY = "oyp_culture_active_week";

  // 12 Haftalık (60 Konuluk) Kapsamlı & Kademeli Müfredat Veritabanı
  const INITIAL_CURRICULUM_12_WEEKS = [
    // ==========================================
    // FAZ 1: TEMEL TAŞLAR & ÇERÇEVE (Hafta 1 - 4)
    // ==========================================
    // --- HAFTA 1 ---
    {
      id: "w1_mon",
      study_week: 1,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Enflasyon, Faiz, Para Basımı & GSYİH (GDP)",
      guide_questions: [
        "Enflasyon nasıl oluşur? Talep ve maliyet enflasyonu farkı nedir?",
        "Merkez bankaları neden faiz artırır veya düşürür?",
        "Para basmak neden doğrudan zenginlik getirmez?",
        "GSYİH (GDP) bir ülkenin refahını nasıl ölçer?"
      ],
      key_takeaways: [
        "Enflasyon = Para arzının mal ve hizmet miktarından hızlı artması",
        "Faiz Artışı = Piyasadan parayı çeker, harcamaları kısar, enflasyonu frenler",
        "GSYİH = Bir ülkede 1 yılda üretilen nihai mal ve hizmetlerin toplam piyasa değeri"
      ],
      notes_content: "Ekonomi günlük hayatın motorudur. Temel prensip arz ve talep dengesidir. Para basıldığında piyasadaki mal miktarı sabitse, her bir para biriminin satın alma gücü düşer (enflasyon). Merkez bankaları enflasyon yükseldiğinde faizi artırarak insanları tasarrufa yönlendirir ve piyasadaki harcama hızını yavaşlatır.",
      is_completed: false,
      resources: "Ray Dalio - How The Economic Machine Works, Mahfi Eğilmez - Kolay Ekonomi"
    },
    {
      id: "w1_tue",
      study_week: 1,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Kuvvetler Ayrılığı & Demokrasi Modelleri",
      guide_questions: [
        "Kuvvetler ayrılığı (Yasama, Yürütme, Yargı) neden demokrasinin temelidir?",
        "Başkanlık, Yarı-Başkanlık ve Parlamenter sistem arasındaki farklar nelerdir?",
        "Sağ ve Sol siyasi kavramları nereden çıktı (Fransız İhtilali)?",
        "Hukukun üstünlüğü neden kişilerden bağımsız olmalıdır?"
      ],
      key_takeaways: [
        "Kuvvetler Ayrılığı = Gücün tek bir elde toplanıp tiranlığa dönüşmesini önler",
        "Sağ / Sol = 1789 Fransız Meclisinde kralı destekleyenlerin sağda, değişimi savunanların solda oturması",
        "Hukukun Üstünlüğü = Yöneticiler dahil herkesin yasalara bağlı olması"
      ],
      notes_content: "Siyaset, toplumların nasıl yönetileceğini ve kaynakların nasıl bölüşüleceğini belirler. Demokrasinin özü sadece çoğunluğun oyu değil, azınlık haklarının korunması ve denge-denetleme mekanizmasıdır (Checks & Balances).",
      is_completed: false,
      resources: "Montesquieu - Kanunların Ruhu Üzerine, Platon - Devlet"
    },
    {
      id: "w1_wed",
      study_week: 1,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Kan Grupları (AB0 & Rh), DNA & Gen Aktarımı",
      guide_questions: [
        "Kan grupları (A, B, AB, 0) neye göre belirlenir? Antijen ve antikor nedir?",
        "Rh pozitif / negatif ne anlama gelir? Kim kime kan verebilir?",
        "Baskın (Dominant) ve Çekinik (Resesif) gen nasıl aktarılır?",
        "DNA ile RNA arasındaki temel işlevsel fark nedir?"
      ],
      key_takeaways: [
        "0 Grubu = Alyuvarlarında A veya B antijeni yoktur (Genel Verici)",
        "AB Grubu = Alyuvarlarında hem A hem B antijeni vardır (Genel Alıcı)",
        "Rh Faktörü = Kanda Rhesus proteini varsa (+), yoksa (-)",
        "DNA = Hücrelerimizin tüm genetik kodunu taşıyan çift sarmallı molekül"
      ],
      notes_content: "Kan grupları alyuvarların yüzeyindeki proteinlere (antijen) göre belirlenir. A grubunda A antijeni, B grubunda B antijeni vardır. 0 grubunda hiçbiri yoktur, bu yüzden 0 grubu herkese kan verebilir ama sadece 0'dan alabilir. Rh(+) olanlar Rh proteinine sahiptir, Rh(-) olanlar ise bu proteine karşı antikor üretebilir.",
      is_completed: false,
      resources: "TÜBİTAK Popüler Bilim - Genetik ve Biyoloji Serisi"
    },
    {
      id: "w1_thu",
      study_week: 1,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Dünya Dil Aileleri & Kritik Deniz Boğazları",
      guide_questions: [
        "Dünyadaki ana dil aileleri hangileridir (Hint-Avrupa, Ural-Altay vb.)?",
        "Türkçe hangi dil ailesine aittir ve yapısal özellikleri nelerdir?",
        "Dünya ticaretinin kalbi olan 5 kritik boğaz hangileridir (Hürmüz, Malakka, Süveyş)?",
        "Coğrafi konum bir ülkenin kaderini nasıl belirler (Jeopolitik)?"
      ],
      key_takeaways: [
        "Hint-Avrupa = İngilizce, İspanyolca, Almanca, Farsça, Rusça, Hintçe",
        "Ural-Altay = Türkçe, Moğolca, Macarca, Fince, Japonca/Korece (akrabalık)",
        "Sondan Eklemeli Yapı = Kök değişmez, ardı ardına yapım/çekim eki eklenir",
        "Hürmüz & Malakka = Küresel enerji ve deniz ticaretinin en kritik boğazları"
      ],
      notes_content: "Diller rastgele oluşmamış, ortak ata dillerden evrilmiştir. Türkçe, Ural-Altay dil ailesinin Altay koluna mensup, ses uyumu ve sondan eklemeli yapısıyla son derece zengin ve mantıklı bir dildir. Dünyada küresel ticaretin %80'i deniz yoluyla yapılır ve Hürmüz, Süveyş, Malakka gibi dar geçitler küresel ekonominin kilit noktalarıdır.",
      is_completed: false,
      resources: "Tim Marshall - Coğrafya Mahkumları, David Crystal - Dilin Kısa Tarihi"
    },
    {
      id: "w1_fri",
      study_week: 1,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Semavi Dinlerin Kronolojisi & Stoacılık",
      guide_questions: [
        "Semavi dinlerin kronolojik sırası ve ortak peygamberleri kimlerdir?",
        "Stoacılık (Marcus Aurelius, Seneca) ve Epikürizm arasındaki fark nedir?",
        "İbrahimi dinler neden aynı kökten gelir?",
        "Stoacıların 'Kontrol Çemberi' prensibi günlük hayatı nasıl kolaylaştırır?"
      ],
      key_takeaways: [
        "Semavi Dinler = Yahudilik (Musa) → Hristiyanlık (İsa) → İslamiyet (Muhammed)",
        "Stoacılık = Kontrol edemediğin şeyleri kabullen, sadece kendi aklına ve erdemine odaklan",
        "Aydınlanma = Aklın ve bilimin dogmaların önüne geçmesi"
      ],
      notes_content: "Tarih insanlığın kolektif hafızasıdır. Semavi dinler tek tanrı inancı etrafında Hz. İbrahim soyuyla ortak köklere dayanır. Felsefede Stoacılık insanın sadece kendi kontrolündeki şeylere odaklanıp dış etkenlere karşı ruhsal sükunetini korumasını öğütler.",
      is_completed: false,
      resources: "Jostein Gaarder - Sofie'nin Dünyası, Marcus Aurelius - Kendime Düşünceler"
    },

    // --- HAFTA 2 ---
    {
      id: "w2_mon",
      study_week: 2,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Arz-Talep Yasası, Tekeller & Borsa (Hisse Senedi)",
      guide_questions: [
        "Fiyatlar serbest piyasada arz ve talep kesişiminde nasıl oluşur?",
        "Monopol (Tekel) ve Oligopol piyasalar tüketiciye nasıl zarar verir?",
        "Şirketler neden halka arz olur (IPO)?",
        "Piyasa değeri (Market Cap) ile hisse fiyatı arasındaki fark nedir?"
      ],
      key_takeaways: [
        "Arz > Talep ise Fiyat Düşer; Talep > Arz ise Fiyat Yükselir",
        "Hisse Senedi = Şirketin mülkiyetine ve kâr payına ortak olma belgesi",
        "Piyasa Değeri = Toplam Hisse Sayısı × Birim Hisse Fiyatı"
      ],
      notes_content: "Serbest piyasada fiyat bir sinyal mekanizmasıdır. Şirketler borçlanmadan sermaye toplamak için halka arz olur. Borsa spekülasyon yeri değil, şirketlerin gelecekteki kâr akışlarına ortak olma piyasasıdır.",
      is_completed: false,
      resources: "Benjamin Graham - Akıllı Yatırımcı"
    },
    {
      id: "w2_tue",
      study_week: 2,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Anayasacılık, Temel Haklar & Laiklik İlkeleri",
      guide_questions: [
        "Anayasa neden diğer tüm kanunların ve kararnamelerin üstündedir?",
        "Pozitif haklar (sağlık, eğitim) ile negatif haklar (yaşam, mülkiyet) farkı nedir?",
        "Laikliğin Fransız (Katı/Seküler) ve Anglo-Sakson (Özgürlükçü) yorumu nasıldır?",
        "Normlar Hiyerarşisi (Kelsen Piramidi) nedir?"
      ],
      key_takeaways: [
        "Anayasa = Toplumsal sözleşme ve devletin yetkilerini sınırlayan en üst metin",
        "Normlar Hiyerarşisi: Anayasa > Kanun > Cumhurbaşkanlığı Kararnamesi > Yönetmelik",
        "Laiklik = Din ve devlet işlerinin ayrılması, inanç ve vicdan özgürlüğünün güvencesi"
      ],
      notes_content: "Anayasa devleti yönetenlerin güç sarhoşluğunu engelleyen toplumsal sigortadır. İnsan hakları evrenseldir ve devlete karşı bireyi korur.",
      is_completed: false,
      resources: "John Locke - Hükümet Üzerine İkinci İnceleme"
    },
    {
      id: "w2_wed",
      study_week: 2,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Bağışıklık Sistemi, Aşılar & Virüs-Bakteri Farkı",
      guide_questions: [
        "Bakteri ile virüs arasındaki canlılık ve yapı farkı nedir?",
        "Antibiyotikler neden virüslere (grip, nezle) asla etki etmez?",
        "Aşılar bağışıklık hafızasını (T ve B lenfositleri) nasıl eğitir?",
        "Otoimmün hastalıklar nedir (Vücudun kendine saldırması)?"
      ],
      key_takeaways: [
        "Bakteri tek hücreli canlıdır; Virüs ise genetik materyal taşıyan cansız bir pakettir",
        "Aşı = Zayıflatılmış veya etkisizleştirilmiş antijenle bağışıklığa antikor ürettirme",
        "Antibiyotik Direnci = Yanlış ve gereksiz antibiyotik kullanımının en büyük küresel tehdidi"
      ],
      notes_content: "Bağışıklık sistemi vücudun ordusudur. Aşılar vücuda zararsız bir antijen tanıtarak gerçek hastalık geldiğinde ordunun hazırlıklı olmasını sağlar. Antibiyotikler sadece bakterileri öldürür.",
      is_completed: false,
      resources: "Philipp Dettmer - Immune (Bağışıklık Kitabı)"
    },
    {
      id: "w2_thu",
      study_week: 2,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Kıtalar, İklim Kuşakları & Küresel Nüfus Dağılımı",
      guide_questions: [
        "Dünya nüfusunun %90'ı neden Kuzey Yarımküre'de toplanmıştır?",
        "Muson Asyası neden dünyanın en yoğun nüfuslu bölgesidir?",
        "Ekvatoral, Çöl, Akdeniz ve Tundra iklimlerinin medeniyetlere etkisi nedir?",
        "Coğrafi İzolasyon ada ülkelerini (İngiltere, Japonya) nasıl etkiledi?"
      ],
      key_takeaways: [
        "Karaların %68'i Kuzey Yarımküre'de yer alır",
        "Muson İklimi = Yılda iki-üç kez pirinç hasadı imkanıyla devasa nüfusları besler",
        "Ada İzolasyonu = İngiltere ve Japonya'ya dış istilalara karşı doğal kale avantajı sağladı"
      ],
      notes_content: "İklim ve coğrafya insanlık tarihinin sahnesidir. Tarıma elverişli ılıman kuşaklar ve su havzaları büyük imparatorlukların doğduğu yerler olmuştur.",
      is_completed: false,
      resources: "Jared Diamond - Tüfek, Mikrop ve Çelik"
    },
    {
      id: "w2_fri",
      study_week: 2,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "İlk Uygarlıklar & Tarım Devrimi (Neolitik)",
      guide_questions: [
        "Avcı-toplayıcılıktan yerleşik tarıma geçiş (Neolitik Devrim) insanlığı nasıl değiştirdi?",
        "Mezopotamya, Mısır ve İndus vadileri neden medeniyetin beşiğidir?",
        "Yazının icadı (M.Ö. 3200 Sümer Çivi Yazısı) tarihi neden başlattı?",
        "Göbeklitepe yerleşik hayat teorilerini nasıl tersyüz etti?"
      ],
      key_takeaways: [
        "Tarım Devrimi = Artı ürün birikimi, mülkiyet kavramı ve şehirleşmenin başlangıcı",
        "Sümerler = Yazı, tekerlek, matematik ve ilk hukuk kurallarının öncüsü",
        "Göbeklitepe = İnsanların tarımdan önce tapınak yapmak için bir araya geldiğini gösterdi"
      ],
      notes_content: "Tarım devrimi insanlığı doğaya uyum sağlayan avcıdan, doğayı şekillendiren üreticiye dönüştürdü. Artı ürün bürokrasiyi, yazıyı, orduyu ve devleti doğurdu.",
      is_completed: false,
      resources: "Yuval Noah Harari - Sapiens"
    },

    // --- HAFTA 3 ---
    {
      id: "w3_mon",
      study_week: 3,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Döviz Kuru, Devalüasyon & Cari Açık",
      guide_questions: [
        "Bir ülkenin para birimi neden yabancı paralar karşısında değer kaybeder?",
        "Cari açık nedir ve bir ülkenin üretimi ile tüketimi arasındaki ilişki nasıldır?",
        "Sabit kur rejimi ile serbest dalgalı kur rejimi arasındaki fark nedir?",
        "Devalüasyon ihracatı artırır mı, enflasyonu nasıl tetikler?"
      ],
      key_takeaways: [
        "Döviz Kuru = İki ülkenin para birimlerinin birbirine göre fiyatıdır",
        "Cari Açık = Bir ülkenin ithal ettiği mal ve hizmetlerin ihracatından fazla olması",
        "Kur Şoku = İthal girdileri pahalılaştırarak doğrudan maliyet enflasyonu yaratır"
      ],
      notes_content: "Döviz kuru bir ülkenin ekonomik karnesidir. Eğer bir ülke ürettiğinden fazla tüketiyor ve dışarıdan borç alıyorsa parası değer kaybeder.",
      is_completed: false,
      resources: "Mahfi Eğilmez - Küresel Finans Krizi ve Türkiye"
    },
    {
      id: "w3_tue",
      study_week: 3,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Liberalizm, Sosyalizm & Sosyal Demokrasi",
      guide_questions: [
        "Klasik Liberalizmin (Adam Smith) 'Görünmez El' teorisi neyi savunur?",
        "Sosyalizm ve Marksizm üretim araçlarının mülkiyetine nasıl bakar?",
        "Sosyal Demokrasi (İskandinav Modeli) serbest piyasa ile sosyal adaleti nasıl birleştirir?",
        "Faşizm ve Komünizm ideolojilerinin ortak ve zıt yönleri nelerdir?"
      ],
      key_takeaways: [
        "Liberalizm = Bireysel özgürlük, özel mülkiyet ve serbest piyasa önceliği",
        "Sosyalizm = Üretim araçlarının kamulaştırılması ve sınıf ayrımlarının kaldırılması",
        "Sosyal Demokrasi = Piyasa ekonomisi içinde yüksek vergiyle ücretsiz eğitim ve sağlık"
      ],
      notes_content: "Siyasi ideolojiler kaynakların kimin tarafından ve nasıl dağıtılacağı sorusuna verilen farklı yanıtlardır. Modern dünya bu ekollerin harmanlanmasıyla şekillenir.",
      is_completed: false,
      resources: "Andrew Heywood - Siyaset Teorisine Giriş"
    },
    {
      id: "w3_wed",
      study_week: 3,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "İnsan Beyni, Nöronlar & Hormonlar (Dopamin, Serotonin)",
      guide_questions: [
        "Beyindeki 86 milyar nöron elektriksel ve kimyasal sinyalleri nasıl iletir?",
        "Dopamin ödül mekanizması ve bağımlılık döngüsü nasıl çalışır?",
        "Serotonin ruh halini ve uykuyu nasıl regüle eder?",
        "Kortizol (Stres hormonu) kronikleştiğinde vücuda nasıl zarar verir?"
      ],
      key_takeaways: [
        "Sinaps = İki nöron arasındaki mikroskobik kimyasal iletişim köprüsü",
        "Dopamin = Motivasyon, haz ve beklenti hormonudur",
        "Nöroplastisite = Beynin öğrenmeyle ve deneyimle fiziksel yapısını değiştirebilme gücü"
      ],
      notes_content: "Beynimiz sabit bir bilgisayar çipi değildir; nöroplastisite sayesinde her yeni öğrendiğimiz bilgiyle fiziksel nöron ağlarını yeniden örer.",
      is_completed: false,
      resources: "David Eagleman - Beyin: Senin Hikayen"
    },
    {
      id: "w3_thu",
      study_week: 3,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Türkçe'nin Tarihsel Evrimi & Orhun Yazıtları",
      guide_questions: [
        "Türkçe'nin yazılı ilk belgesi olan Orhun Yazıtları (8. yy) ne anlatır?",
        "Göktürkçe, Karahanlıca, Osmanlıca ve Türkiye Türkçesi zinciri nasıl evrildi?",
        "1928 Harf Devrimi ve 1932 Dil Devrimi'nin Türkçe üzerindeki etkileri nelerdir?",
        "Türkçe'nin ses uyumu ve matematiksel ekleme mantığı nasıldır?"
      ],
      key_takeaways: [
        "Orhun Abideleri (Bilge Kağan, Kül Tigin, Tonyukuk) = İlk edebi ve siyasi Türkçe metinler",
        "Divânu Lugâti't-Türk (1074) = Kaşgarlı Mahmud'un ilk Türkçe ansiklopedik sözlüğü",
        "Ünlü Uyumu (Büyük ve Küçük Ses Uyumu) = Türkçe'nin en belirgin fonetik kuralı"
      ],
      notes_content: "Türkçe binlerce yıldır kök yapısını koruyan, sondan eklemeli yapısıyla yeni kavramları kolayca türetebilen son derece kurallı ve zengin bir dildir.",
      is_completed: false,
      resources: "Talat Tekin - Orhon Yazıtları, Doğan Aksan - Her Yönüyle Dil"
    },
    {
      id: "w3_fri",
      study_week: 3,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Antik Yunan Felsefesi (Sokrates, Platon, Aristoteles)",
      guide_questions: [
        "Sokrates'in 'Sorgulanmamış hayat yaşamaya değmez' sözü ve diyalektik yöntemi nedir?",
        "Platon'un Mağara Alegorisi ve İdealar Dünyası teorisi ne anlatır?",
        "Aristoteles'in Mantık kuralları ve 'Altın Orta' (Ölçülülük) erdemi nedir?",
        "Felsefe neden Antik İyonya'da (Miletos, Efes) doğdu?"
      ],
      key_takeaways: [
        "Sokratik Yöntem = Sorular sorarak muhatabın kendi çelişkilerini fark ettirme",
        "Platon = Gördüğümüz dünya sadece ideaların gölgesidir",
        "Aristoteles = Modern bilimin, biyolojinin ve mantığın kurucusu"
      ],
      notes_content: "Batı felsefesi Platon'a düşülmüş dipnotlardan ibarettir sözü boşa değildir. Sokrates ve öğrencileri mitolojik inançların yerine rasyonel aklı koyarak felsefeyi başlattı.",
      is_completed: false,
      resources: "Platon - Devlet, Bryan Magee - Felsefenin Öyküsü"
    },

    // --- HAFTA 4 ---
    {
      id: "w4_mon",
      study_week: 4,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Kesirli Rezerv Bankacılığı & Para Yaratımı",
      guide_questions: [
        "Bankalar yatırılan mevduatın ne kadarını kasada tutar, ne kadarını kredi verir?",
        "Para Çarpanı (Money Multiplier) mekanizması ile piyasada para nasıl çoğalır?",
        "Banka hücumu (Bank Run) nedir ve bankalar neden aynı anda herkese parasını ödeyemez?",
        "Merkez Bankası zorunlu karşılık oranları ile piyasayı nasıl kontrol eder?"
      ],
      key_takeaways: [
        "Kesirli Rezerv = Bankanın mevduatın sadece %5-10'unu tutup kalanını kredi vermesi",
        "Kredi = Bankaların klavye tuşlarına basarak dijital para yaratma yöntemidir",
        "Mevduat Sigortası = Banka batışlarında küçük tasarruf sahiplerini koruma fonu"
      ],
      notes_content: "Modern bankacılık sistemi güvene dayalıdır. Fiziksel banknotlar toplam para arzının sadece %5-10'udur; kalan %90'ı bankaların kredi verirken oluşturduğu dijital kayıtlardır.",
      is_completed: false,
      resources: "Niall Ferguson - Paranın Yükselişi"
    },
    {
      id: "w4_tue",
      study_week: 4,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Birleşmiş Milletler, NATO & Uluslararası İttifaklar",
      guide_questions: [
        "BM Güvenlik Konseyi'nin 5 daimi üyesi (P5) kimlerdir ve veto hakkı nasıl çalışır?",
        "NATO'nun meşhur 5. Maddesi (Kolektif Savunma) ne anlama gelir?",
        "Avrupa Birliği'nin tek pazar, serbest dolaşım ve Eurozone yapıları nasıldır?",
        "Dünya Ticaret Örgütü (WTO) ve IMF küresel düzeni nasıl regüle eder?"
      ],
      key_takeaways: [
        "P5 Üyeleri: ABD, Rusya, Çin, İngiltere, Fransa (Tek bir 'Hayır' kararı kilitler)",
        "NATO 5. Madde: 'Bir üyeye yapılan saldırı tüm üyelere yapılmış sayılır'",
        "AB 4 Temel Özgürlük: Malların, hizmetlerin, sermayenin ve kişilerin serbest dolaşımı"
      ],
      notes_content: "2. Dünya Savaşı sonrası kurulan küresel kurumlar dünyayı 3. bir dünya savaşından korumak için tasarlanmıştır, ancak veto yetkileri günümüzde karar almayı zorlaştırır.",
      is_completed: false,
      resources: "Henry Kissinger - Diplomasi"
    },
    {
      id: "w4_wed",
      study_week: 4,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Doğal Seçilim, Mutasyon & Evrim Teorisi",
      guide_questions: [
        "Charles Darwin'in Doğal Seçilim mekanizması nasıl çalışır?",
        "Mutasyonlar rastgele midir, çevre baskısı adaptasyonu nasıl seçer?",
        "Fosil kayıtları ve homolog organlar evrimsel akrabalığı nasıl kanıtlar?",
        "Antibiyotik direnci ve virüs varyantları gözümüzün önündeki evrim örnekleri midir?"
      ],
      key_takeaways: [
        "Doğal Seçilim = Çevre koşullarına en iyi uyum sağlayan genlerin bir sonraki nesle aktarılması",
        "Ortak Ata = Yeryüzündeki tüm canlıların genetik kodunun (A, T, G, C) aynı dille yazılması",
        "Uyum Sağlayamayan Elenir = Evrim en güçlünün değil, değişime en çok uyum sağlayanın hayatta kalmasıdır"
      ],
      notes_content: "Biyolojide evrimin ışığı olmaksızın hiçbir şeyin anlamı yoktur. Bakterilerin ilaca direnç kazanması evrimin anlık kanıtıdır.",
      is_completed: false,
      resources: "Richard Dawkins - Kör Saatçi, Charles Darwin - Türlerin Kökeni"
    },
    {
      id: "w4_thu",
      study_week: 4,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Dünyanın Kritik Nehirleri, Çölleri & Dağ Sıradağları",
      guide_questions: [
        "Himalayalar Asya'nın muson iklimini ve su kaynaklarını nasıl kontrol eder?",
        "Nil, Fırat, Dicle, Tuna ve Amazon nehirlerinin jeopolitik değeri nedir?",
        "Büyük Sahra Çölü Afrika'yı kültürel olarak nasıl ikiye böldü (Kuzey vs. Sahra Altı)?",
        "Su Savaşları (Water Wars) gelecekte hangi bölgelerde patlak verebilir?"
      ],
      key_takeaways: [
        "Himalayalar = Asya'nın su kulesidir, 1.5 milyar insanın içme ve tarım suyunu besler",
        "Büyük Sahra = Dünyanın en büyük sıcak çölü olup Akdeniz Afrika'sını Sahra Altı'ndan izole etmiştir",
        "Sınır Aşan Sular (Fırat-Dicle, Nil) = Ülkeler arası en büyük diplomatik kriz kaynaklarıdır"
      ],
      notes_content: "Dağlar sınırları çizer, nehirler medeniyetleri birleştirir, çöller izole eder. Coğrafya ulusların dış politikasının değişmez zeminidir.",
      is_completed: false,
      resources: "Marshall - Coğrafya Mahkumları"
    },
    {
      id: "w4_fri",
      study_week: 4,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 1,
      phase_name: "🥉 Faz 1: Temel Taşlar",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Uzak Doğu İnançları: Budizm, Hinduizm & Taoizm",
      guide_questions: [
        "Hinduizm'in Karma, Samsara (Reenkarnasyon) ve Kast Sistemi mantığı nedir?",
        "Siddhartha Gautama (Buda) ve Dört Yüce Gerçek nedir?",
        "Taoizm'de 'Wu Wei' (Eylemsizlik / Akışa Bırakma) felsefesi ne anlatır?",
        "Konfüçyüsçülük Çin devlet ahlakını ve bürokrasisini nasıl inşa etti?"
      ],
      key_takeaways: [
        "Karma = Ne ekersen onu biçersin; eylemlerin evrensel ahlaki sebep-sonuç yasası",
        "Nirvana = Arzulardan ve acı çekme döngüsünden (Samsara) kurtulup aydınlanma",
        "Yin-Yang = Zıtlıkların uyumu ve evrendeki dinamik denge"
      ],
      notes_content: "Doğu felsefesi dış dünyayı fethetmek yerine iç dünyayı dinginleştirmeye ve doğanın akışına (Tao) uyum sağlamaya odaklanır.",
      is_completed: false,
      resources: "Lao Tzu - Tao Te Ching, Hermann Hesse - Siddhartha"
    },

    // ==================================================
    // FAZ 2: DERİNLEŞME & KÜRESEL DİNAMİKLER (Hafta 5 - 8)
    // ==================================================
    // --- HAFTA 5 ---
    {
      id: "w5_mon",
      study_week: 5,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Tarihteki Büyük Ekonomik Krizler (1929 & 2008)",
      guide_questions: [
        "1929 Büyük Buhranı nasıl başladı ve tüm dünyaya nasıl yayıldı?",
        "Keynesyen Ekonomi (Devletin harcama yaparak krizi çözmesi) nasıl doğdu?",
        "2008 İpotek (Subprime Mortgage) krizi Lehman Brothers'ı nasıl batırdı?",
        "Türev ürünler ve toksik varlıklar sistemi nasıl zehirledi?"
      ],
      key_takeaways: [
        "1929 Buhranı = Kontrolsüz borsa spekülasyonu ve talep çöküşü",
        "2008 Krizi = Ödeme gücü olmayanlara dağıtılan konut kredilerinin paketlenip satılması",
        "Too Big to Fail = Batamayacak kadar büyük kurumları devletin vergi mükellefi parasıyla kurtarması"
      ],
      notes_content: "Ekonomik krizler açgözlülük ve regülasyon eksikliğinin sonucudur. 1929 devleti ekonomiye soktu, 2008 ise merkez bankalarını sınırsız para basmaya (QE) itti.",
      is_completed: false,
      resources: "John Kenneth Galbraith - 1929 Büyük Çöküşü"
    },
    {
      id: "w5_tue",
      study_week: 5,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Soğuk Savaş, Kutuplaşma & Nükleer Caydırıcılık",
      guide_questions: [
        "ABD ve SSCB doğrudan savaşmadan 45 yıl dünyayı nasıl böldü?",
        "MAD (Karşılıklı Kesin Yıkım) doktrini nükleer savaşı nasıl engelledi?",
        "Küba Füze Krizi (1962) dünyayı nükleer kıyametin eşiğine nasıl getirdi?",
        "Vekil Savaşları (Proxy Wars: Kore, Vietnam, Afganistan) nasıl yürütüldü?"
      ],
      key_takeaways: [
        "Demir Perde = Avrupa'yı Kapitalist Batı ve Komünist Doğu olarak bölen görünmez sınır",
        "MAD Doktrini = İlk saldıran da karşı tarafın misillemesiyle yok olacağı için kimse düğmeye basamaz",
        "1989 Berlin Duvarı'nın Yıkılışı & 1991 SSCB'nin Dağılması = İki kutuplu dünyanın sonu"
      ],
      notes_content: "Soğuk Savaş ideolojik, askeri ve istihbari bir satrançtı. Nükleer silahların varlığı ironik bir biçimde iki süper gücün doğrudan savaşmasını engelledi.",
      is_completed: false,
      resources: "John Lewis Gaddis - Soğuk Savaş"
    },
    {
      id: "w5_wed",
      study_week: 5,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "CRISPR, Genetik Mühendisliği & Kök Hücre",
      guide_questions: [
        "CRISPR-Cas9 gen makası DNA'yı nasıl kesip yeniden yazar?",
        "Genetik hastalıkların (orak hücre, kistik fibrozis) kökten tedavisi mümkün mü?",
        "Kök hücreler nasıl herhangi bir organ hücresine dönüşebilir?",
        "Tasarım Bebekler (Designer Babies) ve etik sınırlar nelerdir?"
      ],
      key_takeaways: [
        "CRISPR = Bakterilerin virüslere karşı geliştirdiği savunma mekanizmasından uyarlanan moleküler makas",
        "Kök Hücre (Pluripotent) = Vücuttaki tüm dokuları yenileme potansiyeline sahip ana hücre",
        "Biyoetik = İnsan embriyosu üzerinde genetik değişiklik yapmanın ahlaki sınırları"
      ],
      notes_content: "İnsanlık tarihinde ilk kez kendi biyolojik kaynak kodunu okumanın ötesine geçip onu düzenleyebilir hale geldi. Bu teknoloji tıp devrimi kadar etik tartışmaları da getirdi.",
      is_completed: false,
      resources: "Walter Isaacson - Kod Kırıcı (Jennifer Doudna)"
    },
    {
      id: "w5_thu",
      study_week: 5,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Ortadoğu Jeopolitiği & Sykes-Picot Mirası",
      guide_questions: [
        "1916 Sykes-Picot Anlaşması ile Ortadoğu haritası cetvelle nasıl çizildi?",
        "Petrol rezervleri ve mezhepsel çatışmalar bölgeyi nasıl istikrarsızlaştırdı?",
        "Arap Baharı (2011) neden demokrasi yerine iç savaşlar ve göç krizleri getirdi?",
        "İsrail-Filistin meselesinin tarihsel kökleri (1917 Balfour Deklarasyonu) nedir?"
      ],
      key_takeaways: [
        "Sykes-Picot = İngiltere ve Fransa'nın Osmanlı topraklarını etnik yapıları hiçe sayarak bölüşmesi",
        "Yapay Sınırlar = Doğal olmayan sınırlar kalıcı etnik ve mezhepsel çatışmaların tohumunu attı",
        "Petrol Laneti (Resource Curse) = Doğal zenginliğin otokrasi ve dış müdahaleleri çekmesi"
      ],
      notes_content: "Ortadoğu'daki bugünkü çatışmalar 1. Dünya Savaşı sonrası masa başında çizilen yapay sınırların ve petrol jeopolitiğinin doğrudan sonucudur.",
      is_completed: false,
      resources: "David Fromkin - Barışa Son Veren Barış"
    },
    {
      id: "w5_fri",
      study_week: 5,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Rönesans, Reform & Aydınlanma Çağı",
      guide_questions: [
        "Rönesans (Yeniden Doğuş) İtalya'da sanatı ve hümanizmi nasıl canlandırdı?",
        "Martin Luther'in 95 Tezi ve Protestan Reformu Katolik Kilisesi'ni nasıl sarstı?",
        "Matbaanın icadı (Gutenberg) bilginin demokratikleşmesini nasıl sağladı?",
        "Kant'ın 'Aklını kullanma cesaretini göster!' (Sapere Aude) çağrısı ne demektir?"
      ],
      key_takeaways: [
        "Hümanizm = İnsanı ve aklı evrenin merkezine koyan düşünce",
        "Reform = Dinin tekelden çıkarılıp yerel dillere (İncil'in Almanca/İngilizceye çevrilmesi) kazandırılması",
        "Aydınlanma = Deney, gözlem ve aklın dogmaların yerine geçmesi (Descartes, Voltaire, Kant)"
      ],
      notes_content: "Rönesans insanı keşfetti, Reform dini özgürleştirdi, Aydınlanma ise bilimi ve aklı yücelterek modern dünyanın temellerini attı.",
      is_completed: false,
      resources: "Ernst Gombrich - Sanatın Öyküsü, Immanuel Kant - Aydınlanma Nedir?"
    },

    // --- HAFTA 6 ---
    {
      id: "w6_mon",
      study_week: 6,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Bretton Woods & Doların Küresel Hegemonyası (1971)",
      guide_questions: [
        "1944 Bretton Woods Anlaşması ile dolar neden altına endekslendi ($35 = 1 Ons Altın)?",
        "Nixon 1971'de doların altın karşılığını neden tek taraflı kaldırdı (Nixon Şoku)?",
        "Petrodolar sistemi (Suudi petrolünün sadece dolarla satılması) nasıl kuruldu?",
        "Dünyadaki ticaretin %80'i neden hala ABD doları ile dönüyor?"
      ],
      key_takeaways: [
        "Fiat Para = Karşılığı altın değil, sadece devletin egemenlik gücü ve güvene dayanan para",
        "Rezerv Para Avantajı = ABD'nin dünyaya kağıt satıp karşılığında gerçek mal ve hizmet alabilmesi",
        "Dedolarizasyon = BRICS ülkelerinin ticarette yerel paraları kullanma arayışı"
      ],
      notes_content: "1971'den beri yeryüzündeki tüm paralar safi inançla dönen 'Fiat' paradır. Doların gücü Amerikan ordusu, finansal piyasaları ve küresel ticaret tekelinden gelir.",
      is_completed: false,
      resources: "Yanis Varoufakis - Küresel Minotauros"
    },
    {
      id: "w6_tue",
      study_week: 6,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Uluslararası Hukuk, Cenevre Sözleşmesi & Savaş Suçları",
      guide_questions: [
        "Savaş hukukunun (Jus in Bello) temel ilkeleri nelerdir (Sivil dokunulmazlığı, orantılılık)?",
        "Cenevre Sözleşmeleri savaş esirlerini ve sivilleri nasıl korur?",
        "Uluslararası Ceza Mahkemesi (UCM / Lahey) hangi suçları yargılar?",
        "Egemen devletler uluslararası hukuku neden istedikleri zaman çiğner?"
      ],
      key_takeaways: [
        "Savaş Suçları = Sivilleri kasten hedef alma, işkence, kimyasal silah kullanımı",
        "İnsanlığa Karşı Suçlar = Sistematik ve yaygın bir şekilde sivil halka saldırı",
        "Yaptırım Gücü = Uluslararası hukukun arkasında küresel bir polis gücü olmaması en büyük zaafıdır"
      ],
      notes_content: "Uluslararası hukuk bir zorlama mekanizması olmaktan ziyade devletlerin itibarını ve meşruiyetini belirleyen ahlaki ve hukuki bir çerçevedir.",
      is_completed: false,
      resources: "Philippe Sands - Doğu Batı Sokağı"
    },
    {
      id: "w6_wed",
      study_week: 6,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Kanser Mekanizması, Telomerler & Hücre Biyolojisi",
      guide_questions: [
        "Kanser hücresi neden programlanmış hücre ölümünden (Apoptoz) kaçar ve ölümsüzleşir?",
        "Onkogenler ve tümör baskılayıcı genler (p53) nasıl çalışır?",
        "Kromozomların ucundaki Telomerler yaşlanma hızımızı nasıl belirler?",
        "İmmünoterapi kanser tedavisinde bağışıklığı nasıl bir silaha dönüştürdü?"
      ],
      key_takeaways: [
        "Kanser = Hücre bölünmesini kontrol eden genetik frenlerin bozulması",
        "Telomer = Hücre her bölündüğünde kısalan biyolojik sayaç",
        "İmmünoterapi = Kanser hücresinin bağışıklıktan gizlendiği 'kamuflajı' kaldıran modern tedavi"
      ],
      notes_content: "Kanser aslında yabancı bir mikrop değil, kendi hücrelerimizin kontrolden çıkıp vücudun kaynaklarını tüketmesidir. Modern tıp artık kemoterapi yerine akıllı bağışıklık hedeflemesine geçti.",
      is_completed: false,
      resources: "Siddhartha Mukherjee - Tüm Hastalıkların Şahı: Kanser"
    },
    {
      id: "w6_thu",
      study_week: 6,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Afrika'nın Sömürgeleşmesi & 1884 Berlin Konferansı",
      guide_questions: [
        "Avrupalı güçler 1884 Berlin Konferansı'nda Afrika kıtasını harita başında nasıl paylaştı?",
        "Kongo'da Kral 2. Leopold'un kauçuk terörü ve sömürgecilik soykırımları nelerdir?",
        "Etnik sınırları bölen yapay sınırlar Ruanda soykırımını (Hutu-Tutsi) nasıl tetikledi?",
        "Yeni Sömürgecilik (Neokolonyalizm) ve Afrika'daki hammadde sömürüsü bugün nasıl işler?"
      ],
      key_takeaways: [
        "Scramble for Africa = 1880'lerde Afrika'nın %90'ının birkaç Avrupa devleti tarafından işgali",
        "Yapay Sınırlar = Aynı kabileyi ikiye bölen veya düşman kabileleri aynı sınıra hapseden cetvel çizgileri",
        "Hammadde Zenginliği vs. Fakirlik Paradoksu = Dünyanın en zengin madenlerine sahip kıtanın en yoksul kalması"
      ],
      notes_content: "Afrika'nın bugünkü istikrarsızlığı yerel halkın beceriksizliği değil, 19. yüzyılda Avrupalı güçlerin sınırları cetvelle çizerek arkalarında bıraktığı kurumsal enkazdır.",
      is_completed: false,
      resources: "Adam Hochschild - Kral Leopold'un Hayaleti"
    },
    {
      id: "w6_fri",
      study_week: 6,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Varoluşçuluk (Existentialism): Sartre, Camus, Nietzsche",
      guide_questions: [
        "Sartre'ın 'Varoluş özden önce gelir' ve 'İnsan özgürlüğe mahkumdur' sözleri ne anlama gelir?",
        "Albert Camus'nün Absürdizm (Uyumsuzluk) felsefesi ve Sisifos Söyleni nedir?",
        "Nietzsche'nin 'Tanrı öldü', 'Böyle Buyurdu Zerdüşt' ve 'Üstinsan' (Übermensch) kavramı nedir?",
        "Kierkegaard'ın kaygı ve inanç sıçraması teorisi nasıldır?"
      ],
      key_takeaways: [
        "Varoluşçuluk = İnsanın önceden belirlenmiş bir kaderi yoktur, hayatının anlamını kendi kararlarıyla yaratır",
        "Absürd = İnsanın anlam arayışı ile evrenin soğuk sessizliği arasındaki trajik uyumsuzluk",
        "Übermensch = Toplumun dayattığı sürü ahlakını aşıp kendi değerlerini kendi yaratan insan"
      ],
      notes_content: "Varoluşçuluk karamsarlık değil, aksine hayatın sorumluluğunu tamamen bireyin omuzlarına yükleyen en radikal özgürlük manifestosudur.",
      is_completed: false,
      resources: "Albert Camus - Yabancı, Jean-Paul Sartre - Varoluşçuluk Bir İnsancıllıktır"
    },

    // --- HAFTA 7 ---
    {
      id: "w7_mon",
      study_week: 7,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Vergi Teorisi, Laffer Eğrisi & Vergi Cennetleri",
      guide_questions: [
        "Vergi oranları çok yükseltilirse devletin toplam geliri neden düşer (Laffer Eğrisi)?",
        "Doğrudan vergi (Gelir) ile Dolaylı vergi (KDV, ÖTV) arasındaki adalet farkı nedir?",
        "Offshore hesaplar, Cayman Adaları ve İsviçre bankaları nasıl vergi kaçırma limanı oldu?",
        "Pandora ve Panama Papers sızıntıları küresel vergi hırsızlığını nasıl ifşa etti?"
      ],
      key_takeaways: [
        "Laffer Eğrisi = %0 ve %100 vergi oranında devlet geliri sıfırdır, optimal bir tepe noktası vardır",
        "Dolaylı Vergi = Zenginin de fakirin de ekmek alırken aynı oranda vergi ödediği adaletsiz sistem",
        "Vergi Arbitrajı = Çok uluslu şirketlerin kârı sıfır vergili ülkelere aktarması"
      ],
      notes_content: "Vergi medeniyetin bedelidir ancak dolaylı vergilere bağımlı sistemler alt gelir grubunu ezer. Küresel şirketler kârlarını vergi cennetlerine kaydırarak ulus-devletleri baypas eder.",
      is_completed: false,
      resources: "Gabriel Zucman - Ulusların Gizli Zenginliği"
    },
    {
      id: "w7_tue",
      study_week: 7,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Otoriterlik, Totalitarizm & Popülizm (Hannah Arendt)",
      guide_questions: [
        "Otoriter rejimler ile Totaliter rejimler arasındaki temel fark nedir?",
        "Hannah Arendt'in 'Kötülüğün Sıradanlığı' ve 'Totalitarizmin Kaynakları' tezleri nedir?",
        "Modern Popülizm 'Halk vs. Yozlaşmış Seçkinler' söylemini nasıl kullanır?",
        "Demokrasiler sandık yoluyla kendi kendilerini nasıl tasfiye edebilir?"
      ],
      key_takeaways: [
        "Otoriterlik = Siyasi muhalefeti yasaklar ama özel hayata karışmaz",
        "Totalitarizm = İnsanın düşüncesini, ailesini ve zihnini tamamen devlete tabi kılar (1984 modeli)",
        "Kötülüğün Sıradanlığı = Korkunç suçların canavarlar tarafından değil, sorgulamadan emir dinleyen memurlar tarafından işlenmesi"
      ],
      notes_content: "Totalitarizm yalanların o kadar çok tekrar edilmesidir ki insanlar artık neyin doğru neyin yanlış olduğunu ayırt edemez hale gelir.",
      is_completed: false,
      resources: "Hannah Arendt - Kötülüğün Sıradanlığı: Eichmann Kudüs'te, Levitsky - Demokrasiler Nasıl Ölür"
    },
    {
      id: "w7_wed",
      study_week: 7,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Tarihi Değiştiren Büyük Salgınlar & Pandemi Biyolojisi",
      guide_questions: [
        "14. yüzyıl Kara Vebası (Black Death) Avrupa nüfusunun üçte birini nasıl yok etti?",
        "Salgınlar feodalizmi yıkıp işçi ücretlerini ve Rönesans'ı nasıl tetikledi?",
        "1918 İspanyol Gribi 1. Dünya Savaşı'ndan daha çok insanı nasıl öldürdü?",
        "R0 (Bulaş Katsayısı) ve Sürü Bağışıklığı eşiği nasıl hesaplanır?"
      ],
      key_takeaways: [
        "Kara Veba = Yersinia pestis bakterisinin pirelerle yayılması, kilisenin otoritesini sarstı",
        "Çiçek Hastalığı = Avrupalıların Amerika yerlilerinin %90'ını mikroplarla yok etmesi",
        "Zoonotik Bulaşma = Virüslerin hayvanlardan insanlara sıçraması (COVID, SARS, Ebola)"
      ],
      notes_content: "Mikroplar ve salgınlar tarihin en büyük komutanlarından daha çok imparatorluk yıkmış ve toplumları baştan yaratmıştır.",
      is_completed: false,
      resources: "William McNeill - Salgınlar ve Halklar"
    },
    {
      id: "w7_thu",
      study_week: 7,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Kutup Jeopolitiği, Eriyten Buzullar & Kuzey Deniz Rotaları",
      guide_questions: [
        "Kuzey Kutbu'ndaki (Arktik) buzulların erimesi küresel ticaret yollarını nasıl kısaltıyor?",
        "Kuzey Deniz Rotası (NSR) Süveyş Kanalı'na nasıl alternatif oluşturuyor?",
        "Rusya, ABD, Kanada ve Çin'in Arktik'teki petrol ve doğalgaz egemenlik kavgası nedir?",
        "İklim değişikliği jeopolitik sınırları nasıl yeniden çiziyor?"
      ],
      key_takeaways: [
        "Kuzey Deniz Rotası = Asya ile Avrupa arasındaki gemi yolculuk süresini %40 kısaltır",
        "Arktik Kaynakları = Dünyanın keşfedilmemiş petrol ve gaz rezervlerinin %20'den fazlası",
        "Buzkıran Filosu Üstünlüğü = Rusya'nın nükleer buzkıran filosuyla bölgedeki hakimiyeti"
      ],
      notes_content: "Küresel ısınma bir çevre felaketi olduğu kadar yeni bir jeopolitik çatışma alanıdır. Donmuş kuzey denizleri dünyanın yeni Süveyş'i haline gelmektedir.",
      is_completed: false,
      resources: "Scott Borgerson - Arctic Meltdown"
    },
    {
      id: "w7_fri",
      study_week: 7,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Sanayi Devrimi & Sosyal Sınıfların Doğuşu",
      guide_questions: [
        "Buhar makinesinin (James Watt) icadı atölye üretimini fabrika sistemine nasıl çevirdi?",
        "Kırsaldan şehirlere göç nasıl gecekondu mahallelerini ve işçi sınıfını (Proletarya) yarattı?",
        "Çocuk işçiliği, 16 saatlik mesailer ve sendika mücadeleleri (8 saatlik iş günü) nasıl kazanıldı?",
        "1. ve 2. Sanayi Devrimi arasındaki fark nedir (Kömür & Buhar vs. Elektrik & Petrol)?"
      ],
      key_takeaways: [
        "Fabrika Sistemi = Emeğin saatle ölçüldüğü, insanın makineye uyarlandığı yeni çağ",
        "Burjuvazi vs. Proletarya = Üretim aracına sahip olan sermaye ile sadece emeğini satan sınıf",
        "Luddizm (Makine Kırıcılık) = İşini kaybeden işçilerin teknolojiye karşı ilk isyanı"
      ],
      notes_content: "Sanayi Devrimi insanlığın doğanın ritminden kopup saat kulesinin ve fabrikanın mekanik ritmine girdiği en büyük dönüm noktasıdır.",
      is_completed: false,
      resources: "Eric Hobsbawm - Sanayi ve İmparatorluk"
    },

    // --- HAFTA 8 ---
    {
      id: "w8_mon",
      study_week: 8,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Kripto Varlıklar, Blockchain Mantığı & DeFi",
      guide_questions: [
        "Satoshi Nakamoto'nun Bitcoin'i (2008) merkezi otoritelere neden bir başkaldırıdır?",
        "Blockchain (Dağıtık Defter) teknolojisi verinin değiştirilmesini nasıl imkansız kılar?",
        "Proof of Work (Madencilik) ile Proof of Stake konsensüsü farkı nedir?",
        "Merkeziyetsiz Finans (DeFi) aracı bankaları ortadan kaldırabilir mi?"
      ],
      key_takeaways: [
        "Blockchain = Aracıya gerek kalmadan birbirine güvenmeyen taraflar arasında güven üreten defter",
        "21 Milyon Limit = Bitcoin'in enflasyona karşı tasarlanmış sınırlı arz mekanizması",
        "Akıllı Sözleşmeler (Ethereum) = Şartlar sağlandığında kodun otomatik çalışıp ödeme yapması"
      ],
      notes_content: "Kripto paralar spekülatif fiyatlarından ibaret değildir; paranın devlet tekelinden çıkarılıp matematiksel bir konsensüse bağlanması deneyidir.",
      is_completed: false,
      resources: "Don Tapscott - Blockchain Devrimi"
    },
    {
      id: "w8_tue",
      study_week: 8,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Hibrit Savaş, Siber Güvenlik & Algoritma Siyaseti",
      guide_questions: [
        "Artık tanklar yerine bot hesaplar ve siber saldırılarla savaş nasıl yürütülüyor?",
        "Cambridge Analytica skandalı 87 milyon insanın psikografik profiliyle seçimleri nasıl etkiledi?",
        "Yankı Odaları (Echo Chambers) ve algoritmaların toplumu kutuplaştırma taktiği nedir?",
        "Deepfake ve yapay zeka dezenformasyonu gerçeği nasıl imkansızlaştırıyor?"
      ],
      key_takeaways: [
        "Hibrit Savaş = Askeri olmayan araçların (siber saldırı, dezenformasyon, enerji kesintisi) silah olarak kullanılması",
        "Algoritmik Kutuplaşma = Sosyal medyanın kullanıcıyı sitede tutmak için öfke ve radikalliği ödüllendirmesi",
        "Kritik Altyapı Tehdidi = Bir ülkenin elektrik şebekesini veya bankalarını tek satır kodla felç etme riski"
      ],
      notes_content: "21. yüzyılda savaş meydanları toprak değil, insanların zihinleridir. Veri madenciliği ve algoritmalar demokrasilerin en hassas yumuşak karnıdır.",
      is_completed: false,
      resources: "Shoshana Zuboff - Gözetleme Kapitalizmi Çağı"
    },
    {
      id: "w8_wed",
      study_week: 8,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Kuantum Biyoloji, Fotosentez & Kuşların Yön Bulması",
      guide_questions: [
        "Kuantum fiziği kuralları (Süperpozisyon, Dolaşıklık) sıcak ve ıslak biyolojik dokularda nasıl çalışır?",
        "Bitkiler fotosentezde foton enerjisini %100'e yakın verimle kuantum tünelleme ile nasıl aktarır?",
        "Göçmen kuşlar Dünya'nın manyetik alanını gözlerindeki kuantum dolaşıklık (Kriptokrom) ile nasıl 'görür'?",
        "Koklama duyumuz moleküllerin şeklini mi yoksa kuantum titreşim frekansını mı algılar?"
      ],
      key_takeaways: [
        "Kuantum Biyoloji = Yaşamın en temel süreçlerinin kuantum mekaniği yasalarıyla işlemesi",
        "Kriptokrom Proteini = Kuşların gözünde manyetik alanı pusula gibi algılayan radikal çiftler",
        "Enzim Katalizi = Enzimlerin hidrojen atomlarını bariyerlerin içinden kuantum tünelleme ile geçirmesi"
      ],
      notes_content: "Biyoloji sadece kimyadan ibaret değildir; canlılar milyarlarca yıldır kuantum mekaniğinin en tuhaf özelliklerini kullanarak hayatta kalmaktadır.",
      is_completed: false,
      resources: "Jim Al-Khalili - Yaşamın Kıyısında: Kuantum Biyolojisi"
    },
    {
      id: "w8_thu",
      study_week: 8,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Dilsel Görelilik (Sapir-Whorf) & Yok Olan Diller",
      guide_questions: [
        "Konuştuğumuz dil renkleri, zamanı ve dünyayı algılama biçimimizi (Sapir-Whorf Hipotezi) sınırlar mı?",
        "Bazı yerli dillerde 'sağ-sol' yerine sadece 'kuzey-güney' kullanılması yön duygusunu nasıl geliştirir?",
        "Dünyadaki 7.000 dilden yarısının bu yüzyıl içinde yok olma tehlikesi insanlığa ne kaybettirir?",
        "Bir dil öldüğünde o dile ait benzersiz bir dünya algısı ve bilgi birikimi de ölür mü?"
      ],
      key_takeaways: [
        "Sapir-Whorf Hipotezi = Dil düşünceyi şekillendirir, kelimesi olmayan kavramları düşünmek zordur",
        "Guugu Yimithirr Dili = Yönleri sadece pusula yönleriyle tarif eden Avustralya kabilesi",
        "Dil Çeşitliliği Kaybı = Her 2 haftada bir dille birlikte bin yıllık geleneksel botanik ve tıp bilgisi kaybolur"
      ],
      notes_content: "Dil sadece iletişim aracı değildir; insan zihninin dünyayı tercüme ettiği filtre merceğidir.",
      is_completed: false,
      resources: "Guy Deutscher - Dilin Aynasından"
    },
    {
      id: "w8_fri",
      study_week: 8,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 2,
      phase_name: "🥈 Faz 2: Sistemler & Krizler",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Sanat Akımlarının Evrimi: Klasisizmden Kübizme",
      guide_questions: [
        "Rönesans'ın kusursuz gerçekçiliğinden (Da Vinci, Michelangelo) Romantizmin duygusuna nasıl geçildi?",
        "Fotoğraf makinesinin icadı ressamları neden nesneleri taklit etmek yerine ışığı yakalamaya (Empresyonizm) itti?",
        "Monet, Van Gogh ve Cézanne sanatı nasıl soyutlaştırdı?",
        "Picasso'nun Kübizmi nesneleri aynı anda birden fazla açıdan tuvale nasıl taşıdı?"
      ],
      key_takeaways: [
        "Klasisizm = Simetri, akıl ve kusursuz form ideali",
        "Empresyonizm (İzlenimcilik) = Anlık ışık oyunları ve fırça darbeleriyle duyguyu yakalama",
        "Kübizm = 3 boyutlu dünyayı parçalayıp geometrik formlarla 2 boyuta aktarma"
      ],
      notes_content: "Sanat tarihi insan zihninin özgürleşme tarihidir. Fotoğraf gerçekliği kaydetme görevini devralınca resim insan ruhunu ve zihnini ifade etme aracına dönüştü.",
      is_completed: false,
      resources: "E.H. Gombrich - Sanatın Öyküsü"
    },

    // ==================================================
    // FAZ 3: İLERİ DÜZEY ANALİZ & GELECEK (Hafta 9 - 12)
    // ==================================================
    // --- HAFTA 9 ---
    {
      id: "w9_mon",
      study_week: 9,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Oyun Teorisi & Mahkumlar Çıkmazı (Nash Dengesi)",
      guide_questions: [
        "Oyun Teorisi stratejik karar alma süreçlerini matematiksel olarak nasıl modeller?",
        "Mahkumlar Çıkmazında (Prisoner's Dilemma) rasyonel iki birey neden işbirliği yapmayıp en kötü sonucu alır?",
        "John Nash'in 'Nash Dengesi' teorisi şirketler ve devletler arası rekabette nasıl kullanılır?",
        "Sıfır Toplamlı Oyun (Zero-Sum Game) ile Kazan-Kazan oyunları farkı nedir?"
      ],
      key_takeaways: [
        "Nash Dengesi = Karşı taraf stratejisini değiştirmediği sürece kimsenin tek başına hamlesini değiştirmek istemediği durum",
        "Mahkumlar Çıkmazı = Bireysel rasyonellik kolektif felakete (silahlanma yarışı, fiyat kırma) yol açabilir",
        "Güven & Tekrarlanan Oyunlar = Oyun tekrarlandığında 'Kısasa Kısas' (Tit for Tat) stratejisi işbirliğini kazandırır"
      ],
      notes_content: "Oyun teorisi insanların ve kurumların tek başlarına değil, başkalarının hamlelerini tahmin ederek karar aldığını kanıtlar. Güven ve şeffaflık olmadığında rasyonel kararlar herkesi batırabilir.",
      is_completed: false,
      resources: "Avinash Dixit - Stratejik Düşünme"
    },
    {
      id: "w9_tue",
      study_week: 9,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Seçim Sistemleri & Anayasa Mühendisliği (D'Hondt)",
      guide_questions: [
        "D'Hondt nispi temsil sistemi oyları milletvekilliğine nasıl dönüştürür ve büyük partileri neden kayırır?",
        "Dar Bölge (First Past the Post / İngiltere-ABD) sistemi iki partili düzeni nasıl zorunlu kılar (Duverger Kanunu)?",
        "Seçim barajları mecliste istikrar mı sağlar yoksa temsilde adalet ilkesini mi zedeler?",
        "Seçim çevrelerinin iktidar lehine manipüle edilmesi (Gerrymandering) nasıl yapılır?"
      ],
      key_takeaways: [
        "D'Hondt Sistemi = Oyların sırasıyla 1, 2, 3, 4'e bölünerek en yüksek paya milletvekili verilmesi",
        "Dar Bölge = Bir bölgede en çok oyu alan 1 kişinin kazanıp diğer tüm oyların çöpe gitmesi",
        "Temsilde Adalet vs. Yönetimde İstikrar = Her seçim sisteminin çözmeye çalıştığı temel ikilem"
      ],
      notes_content: "Seçim sonuçlarını sadece seçmenin iradesi değil, oyların nasıl sayıldığını belirleyen matematiksel seçim formülleri belirler.",
      is_completed: false,
      resources: "Ergun Özbudun - Türk Anayasa Hukuku"
    },
    {
      id: "w9_wed",
      study_week: 9,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Biyoetik: Ötenazi, Klonlama & Yaşamın Tanımı",
      guide_questions: [
        "Tıbbın ömrü uzatma kapasitesi arttıkça 'yaşam kalitesi' ve ötenazi hakkı nasıl tartışılıyor?",
        "İnsan klonlama ve sentetik embriyo yaratma neden küresel olarak yasaklandı?",
        "Beyin ölümü gerçekleşmiş bir bireyin organ nakli etik olarak ne zaman yapılmalıdır?",
        "Genetik ayrımcılık (GATTACA distopyası) sigorta ve işe alımlarda nasıl engellenir?"
      ],
      key_takeaways: [
        "Ötenazi = İyileşme umudu olmayan ve dayanılmaz acı çeken bireyin kendi isteğiyle tıbbi yardımla hayatına son verilmesi",
        "Klonlama (Dolly 1996) = Somatik hücre çekirdeğinin boşaltılmış yumurtaya aktarılmasıyla genetik kopyalama",
        "Genom Mahremiyeti = Bireyin genetik yatkınlıklarının şirketler ve devletler tarafından ayrımcılık için kullanılmaması hakkı"
      ],
      notes_content: "Teknoloji ne yapabileceğimizi söyler, ancak ne yapmamız gerektiğine biyoetik karar verir. İnsan hayatının sınırları felsefe ve tıbbın en zorlu kesişim noktasıdır.",
      is_completed: false,
      resources: "Michael Sandel - Mükemmelliğe Karşı: Genetik Mühendisliğine Karşı Etik"
    },
    {
      id: "w9_thu",
      study_week: 9,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Çin'in Kuşak ve Yol Girişimi & Borç Tuzağı Diplomasisi",
      guide_questions: [
        "Çin'in trilyon dolarlık 'Yeni İpek Yolu' projesi Asya, Afrika ve Avrupa'yı nasıl birbirine bağlıyor?",
        "Borç Tuzağı Diplomasisi (Debt-Trap) nedir (Örn: Sri Lanka Hambantota Limanı'nın Çin'e 99 yıllığına devri)?",
        "Çin'in 'İnci Dizisi' stratejisi Hint Okyanusu'ndaki deniz ticaret yollarını nasıl kuşatıyor?",
        "ABD'nin Malakka İkilemi'ne karşı Çin karadan demiryolu ve boru hatları kurarak neyi hedefliyor?"
      ],
      key_takeaways: [
        "Kuşak ve Yol = 150'den fazla ülkeye liman, otoyol, demiryolu ve enerji santrali inşa etme mega-projesi",
        "Malakka Çıkmazı = Çin petrolünün %80'inin geçtiği dar boğazın ABD donanması tarafından kapatılma korkusu",
        "Hambantota Örneği = Borcunu ödeyemeyen ülkenin stratejik altyapısını kreditör devlete devretmesi"
      ],
      notes_content: "Kuşak ve Yol projesi 21. yüzyılın en büyük altyapı ve jeo-ekonomik hamlesidir. Çin askeri işgalle değil, sermaye ve altyapı kredileriyle küresel nüfuzunu genişletmektedir.",
      is_completed: false,
      resources: "Peter Frankopan - Yeni İpek Yolları"
    },
    {
      id: "w9_fri",
      study_week: 9,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Epistemoloji (Bilgi Felsefesi): Bildiğimizi Nasıl Biliriz?",
      guide_questions: [
        "Rasyonalizm (Akılcılık: Descartes) ile Empirizm (Deneycilik: Locke, Hume) arasındaki büyük tartışma nedir?",
        "Descartes'ın 'Düşünüyorum öyleyse varım' (Cogito Ergo Sum) çıkarımı şüphecilikten nasıl doğdu?",
        "Kant Saf Aklın Eleştirisi'nde Deney ile Aklı (A Priori ve A Posteriori) nasıl sentezledi?",
        "Simülasyon Argümanı (Nick Bostrom) gerçekliği algılama biçimimize nasıl meydan okur?"
      ],
      key_takeaways: [
        "Epistemoloji = Bilginin doğasını, kaynağını ve sınırlarını araştıran felsefe dalı",
        "Tabula Rasa (Boş Levha) = İnsan zihninin doğuştan boş olduğu ve tüm bilgilerin duyularla kazanıldığı savı",
        "Kopernik Devrimi (Kant) = Nesneler zihnimize uymaz, zihnimiz nesneleri zaman ve mekan kategorileriyle algılar"
      ],
      notes_content: "Gördüğümüz dünya dışarıdaki gerçekliğin birebir kopyası değil, beynimizin duyulardan gelen sinyalleri işleyerek oluşturduğu öznel bir simülasyondur.",
      is_completed: false,
      resources: "René Descartes - Meditasyonlar, Immanuel Kant - Gelecekte Bilim Olarak Ortaya Çıkabilecek Her Metafiziğe Prolegomena"
    },

    // --- HAFTA 10 ---
    {
      id: "w10_mon",
      study_week: 10,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Modern Para Teorisi (MMT) & Parasal Genişleme (QE)",
      guide_questions: [
        "Modern Para Teorisi (MMT) kendi parasını basan devletlerin asla iflas etmeyeceğini nasıl savunur?",
        "Sınırsız para basmanın tek sınırının bütçe açığı değil 'enflasyon ve üretim kapasitesi' olduğu doğru mu?",
        "Merkez bankalarının trilyonlarca dolarlık tahvil alımı (Quantitative Easing) zengin-fakir uçurumunu nasıl açtı?",
        "Negatif Faiz oranları bankacılık ve tasarruf mantığına nasıl aykırıdır?"
      ],
      key_takeaways: [
        "MMT = Para basan devlet borcunu ödeyememe riski taşımaz, kısıtlayıcı tek faktör reel kaynak kıtlığıdır",
        "QE (Parasal Genişleme) = Merkez bankasının piyasaya taze para enjekte ederek varlık fiyatlarını şişirmesi",
        "Cantillon Etkisi = Basılan paranın ilk girdiği finans çevrelerini zenginleştirip halka ulaşana kadar enflasyon yaratması"
      ],
      notes_content: "2008 ve 2020 krizlerinde merkez bankalarının bastığı trilyonlarca dolar hisse ve gayrimenkulü uçurarak tarihin en büyük servet transferine yol açtı.",
      is_completed: false,
      resources: "Stephanie Kelton - Açık Miti (MMT)"
    },
    {
      id: "w10_tue",
      study_week: 10,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Thukydides Tuzağı & Yeni Soğuk Savaş (ABD-Çin)",
      guide_questions: [
        "Graham Allison'ın 'Thukydides Tuzağı' teorisi (Yükselen gücün egemen güçle savaşı) nedir?",
        "Tarihteki 16 örneğin 12'sinde neden savaş çıktı (Sparta-Atina, İngiltere-Almanya)?",
        "Tayvan neden küresel çip (TSMC) üretiminin kalbi ve savaşın olası fitilidir?",
        "Yarı İletken (Çip) Savaşları ve teknolojik ayrışma (Decoupling) nasıl işler?"
      ],
      key_takeaways: [
        "Thukydides Tuzağı = Yükselen bir gücün egemen güçte yarattığı korkunun savaşı neredeyse kaçınılmaz kılması",
        "TSMC (Tayvan) = Dünyanın en gelişmiş mikroçiplerinin %90'ını üreten stratejik kilit nokta",
        "Teknolojik Demir Perde = ABD ve Çin'in yapay zeka, 5G ve çip tedarik zincirlerini birbirinden koparması"
      ],
      notes_content: "21. yüzyılın ana jeopolitik ekseni ABD ile Çin arasındaki hegemonya mücadelesidir. Tayvan ve mikroçipler bu mücadelenin petrolüdür.",
      is_completed: false,
      resources: "Graham Allison - Savaşa Mahkumlar: ABD ve Çin Thukydides Tuzağından Kaçabilir mi?, Chris Miller - Çip Savaşı"
    },
    {
      id: "w10_wed",
      study_week: 10,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Bilinç Problemi (Hard Problem) & Yapay Zeka",
      guide_questions: [
        "David Chalmers'ın Bilincin Zor Problemi (Hard Problem of Consciousness) nedir?",
        "Beyindeki kimyasal ve elektriksel sinyaller nasıl öznel bir 'Kırmızı Görme' hissi (Qualia) üretir?",
        "Turing Testi ve John Searle'ün Çin Odası (Chinese Room) argümanı yapay zekaya ne der?",
        "Yapay zeka gerçekten düşünebilir mi yoksa sadece olasılıkları taklit mi eder?"
      ],
      key_takeaways: [
        "Qualia = Kırmızı rengi görmek veya kahvenin kokusunu almak gibi öznel bilinç deneyimi",
        "Çin Odası = Kurallara bakarak doğru sembolü dışarı vermek o dili anladığınız anlamına gelmez",
        "AGI (Yapay Genel Zeka) = İnsan düzeyinde her alanda akıl yürütebilen yapay zeka hipotezi"
      ],
      notes_content: "Bilinç bilimin önündeki en büyük gizemdir. Nöronların nasıl çalıştığını biliyoruz ama bu biyolojik devrelerin nasıl öznel bir 'benlik' hissi yarattığını hala çözebilmiş değiliz.",
      is_completed: false,
      resources: "David Chalmers - Bilinçli Zihin, Douglas Hofstadter - Gödel, Escher, Bach"
    },
    {
      id: "w10_thu",
      study_week: 10,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Mikronasyonlar, Tanınmayan Devletler & Antarktika",
      guide_questions: [
        "1933 Montevideo Sözleşmesi'ne göre bir yerin 'Devlet' sayılması için hangi 4 şart gerekir?",
        "Kendi parasını ve pasaportunu basan Mikronasyonlar (Sealand, Liberland) neden devlet sayılmaz?",
        "Tanınmayan veya kısmen tanınan devletler (Tayvan, Kosova, KKTC) diplomaside nasıl var olur?",
        "1959 Antarktika Antlaşması bir kıtayı askersiz ve mülkiyetsiz kılmayı nasıl başardı?"
      ],
      key_takeaways: [
        "Montevideo Kriterleri: Kalıcı nüfus, tanımlanmış sınır, hükümet ve diğer devletlerle ilişki kurma kapasitesi",
        "Tanınma Hukuku: Bir devletin varlığı diğer egemen devletlerin onu tanımasına bağlıdır",
        "Antarktika Antlaşması = Dünyada hiçbir ülkeye ait olmayan, sadece bilimsel araştırmaya tahsis edilmiş tek kıta"
      ],
      notes_content: "Devlet fiziksel bir nesne değil, diğer devletlerin üzerinde anlaştığı hukuki ve diplomatik bir kurgudur.",
      is_completed: false,
      resources: "Gideon Rose - How to Run a Country"
    },
    {
      id: "w10_fri",
      study_week: 10,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Etik Teorileri: Faydacılık vs. Ödev Ahlakı (Kant)",
      guide_questions: [
        "Faydacılık (Utilitarizm: Bentham & Mill): 'En çok sayıda insana en büyük mutluluğu sağlayan eylem ahlakidir' doğru mu?",
        "Kant'ın Kategorik İmperatifi (Ödev Ahlakı): 'Bir eylem evrensel kural olabilecekse ahlakidir' ne demektir?",
        "Meşhur Tramvay Problemi (Trolley Problem) ahlak felsefesini nasıl ikiye böler?",
        "Bir hayatı kurtarmak için yalan söylenebilir mi?"
      ],
      key_takeaways: [
        "Faydacılık = Sonuç odaklı etik (Sonuç iyiyse araç meşrudur)",
        "Deontoloji (Kant) = Kural odaklı etik (İnsan asla araç olarak kullanılamaz, her zaman amaçtır)",
        "Erdem Etiği (Aristo) = Kurallardan ziyade iyi karakter ve bilgelik geliştirme"
      ],
      notes_content: "Otonom araçların kaza anında kimi koruyacağına karar veren algoritmalar bugün yüzyıllar önceki bu etik teorilerini kod satırlarına dökmek zorundadır.",
      is_completed: false,
      resources: "Michael Sandel - Adalet: Yapılması Gereken Doğru Şey Nedir?"
    },

    // --- HAFTA 11 ---
    {
      id: "w11_mon",
      study_week: 11,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Davranışsal Ekonomi & İrrasyonel Kararlarımız",
      guide_questions: [
        "Daniel Kahneman (Hızlı ve Yavaş Düşünme) Sistem 1 ve Sistem 2 zihin modelleri nasıldır?",
        "Kayıptan Kaçınma Eğilimi (Loss Aversion): 100 TL kaybetmek neden 100 TL kazanmaktan 2 kat daha çok acıtır?",
        "Çıpalama Etkisi (Anchoring) ve Batık Maliyet Yanılgısı (Sunk Cost Fallacy) kararlarımızı nasıl bozar?",
        "Klasik ekonominin 'Rasyonel İnsan' (Homo Economicus) modeli neden çöktü?"
      ],
      key_takeaways: [
        "Sistem 1 = Hızlı, otomatik, duygusal düşünme; Sistem 2 = Yavaş, analitik, yorucu mantık",
        "Dürtme Teorisi (Nudge) = İnsanların tercihlerini yasaklamadan doğru seçeneğe yönlendirme",
        "Sürü Psikolojisi = Piyasa balonlarının (Tulip Mania, Dot-com) rasyonel olmayan heyecanla şişmesi"
      ],
      notes_content: "İnsanlar mantıklı hesap makineleri değil, evrimsel ön yargılarla donatılmış duygusal karar vericilerdir. Davranışsal ekonomi bu zaafları modeller.",
      is_completed: false,
      resources: "Daniel Kahneman - Hızlı ve Yavaş Düşünme, Richard Thaler - Dürtme (Nudge)"
    },
    {
      id: "w11_tue",
      study_week: 11,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Gözetim Toplumu & Panoptikon (Foucault & Orwell)",
      guide_questions: [
        "Jeremy Bentham'ın Panoptikon hapishane tasarımı ve Foucault'nun modern gözetim analizi nedir?",
        "Bireyin sürekli izlendiğini bilmesi oto-sansür ve itaatkarlık nasıl yaratır?",
        "Çin'in Sosyal Kredi Sistemi dijital Panoptikon'u nasıl gerçeğe dönüştürdü?",
        "Veri mahremiyeti ve 'Saklayacak bir şeyim yoksa neden endişeleneyim?' yanılgısı nedir?"
      ],
      key_takeaways: [
        "Panoptikon = Merkezdeki kuledeki gardiyanın herkesi görebildiği ama mahkumların gardiyanı göremediği dairesel hapishane",
        "İçselleştirilmiş Denetim = Gözetlendiğini düşünen insanın kendi kendini disipline etmesi",
        "Büyük Birader (Big Brother) = Dijital ayak izlerimizle her hareketimizin izlendiği teknolojik gözetim"
      ],
      notes_content: "Geçmişte devletler insanları zorla hapsederdi; bugün ise akıllı telefonlarımızla kendi gözetim ağımızı ceplerimizde gönüllü olarak taşıyoruz.",
      is_completed: false,
      resources: "Michel Foucault - Hapishanenin Doğuşu, George Orwell - 1984"
    },
    {
      id: "w11_wed",
      study_week: 11,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Mikrobiyota (İkinci Beyin Bağırsak) & Epigenetik",
      guide_questions: [
        "Bağırsaklarımızdaki trilyonlarca bakteri (Mikrobiyom) serotonin üretimimizi ve depresyonu nasıl etkiler?",
        "Vagus Siniri aracılığıyla bağırsak-beyin ekseni iki yönlü nasıl haberleşir?",
        "Epigenetik: Çevre, beslenme ve travmalar DNA dizilimini değiştirmeden genleri nasıl açıp kapatır?",
        "Dedelerimizin yaşadığı kıtlık veya stres torunlarına gen ifadesiyle miras kalabilir mi?"
      ],
      key_takeaways: [
        "İkinci Beyin = Vücuttaki serotoninin %90'ı beyinde değil bağırsak mikrobiyotasında üretilir",
        "Epigenetik = DNA piyanonun tuşlarıdır, epigenom ise o tuşlara basan müzisyendir",
        "Metilasyon = Genlerin susturulması veya aktive edilmesi mekanizması"
      ],
      notes_content: "Biz sadece insan hücrelerinden oluşmuyoruz; vücudumuzdaki bakteri sayısı insan hücrelerimizden fazladır. Yediğimiz yiyecekler hem ruh halimizi hem de genlerimizin çalışma biçimini belirler.",
      is_completed: false,
      resources: "Giulia Enders - Büyüleyici Bağırsak, Nessa Carey - Epigenetik Devrimi"
    },
    {
      id: "w11_thu",
      study_week: 11,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Uzay Hukuku & Artemis Anlaşmaları (Ay/Mars Mülkiyeti)",
      guide_questions: [
        "1967 Dış Uzay Antlaşması (Outer Space Treaty) hiçbir ülkenin Ay'da egemenlik kuramayacağını nasıl belirler?",
        "NASA'nın Artemis Anlaşmaları Ay madenciliğini ve 'Güvenlik Bölgelerini' nasıl meşrulaştırıyor?",
        "SpaceX ve özel şirketlerin uzaydaki ticari faaliyetlerini hangi hukuk denetleyecek?",
        "Ay'daki Helyum-3 ve asteroit madenciliği yeni bir küresel kaynak savaşını başlatır mı?"
      ],
      key_takeaways: [
        "Dış Uzay Antlaşması = Uzayın tüm insanlığın ortak mirası olduğu ve kitle imha silahı yerleştirilemeyeceği ilkesi",
        "Asteroit Madenciliği = Tek bir asteroitteki platin ve nadir elementlerin dünya ekonomisinden büyük olması",
        "Uzay Çöpü (Kessler Sendromu) = Yörüngedeki enkazların zincirleme çarpışmalarla uydu ağlarını yok etme riski"
      ],
      notes_content: "Uzay hukuku 1960'ların Soğuk Savaş kurallarıyla yazılmıştır ancak bugün Elon Musk gibi özel aktörlerin ve Ay üslerinin kurulacağı yeni bir çağın eşiğindedir.",
      is_completed: false,
      resources: "Tim Marshall - Geleceğin Coğrafyası: Uzay Çağında Güç ve Siyaset"
    },
    {
      id: "w11_fri",
      study_week: 11,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Postmodernizm, Post-Truth & Baudrillard (Simülakr)",
      guide_questions: [
        "Jean Baudrillard'ın 'Simülasyon ve Simülakr' teorisi gerçekliğin yerini alan kopyaları nasıl açıklar?",
        "'Hakikat Sonrası' (Post-Truth) çağda nesnel gerçeklerin yerini neden duygular ve inançlar aldı?",
        "Büyük Anlatıların (Dinler, Aydınlanma, İdeolojiler) çöküşü (Lyotard) toplumu nasıl parçaladı?",
        "Sosyal medya gerçeği yansıtmak yerine kendi hiper-gerçekliğini nasıl üretiyor?"
      ],
      key_takeaways: [
        "Simülakr = Gerçekliği olmayan veya gerçeğin yerini alan sahte kopya",
        "Hipergerçeklik = İnsanların kurguyu ve simülasyonu gerçek dünyadan daha gerçek algılaması (Disneyland, Instagram)",
        "Post-Truth = Yalanın ifşa edilmesinin bile hiçbir şeyi değiştirmediği kriz hali"
      ],
      notes_content: "Postmodern çağda artık gerçek ile sahte arasındaki sınır silinmiştir; önemli olan bir olayın doğru olması değil, ne kadar etkileşim ve yankı ürettiğidir.",
      is_completed: false,
      resources: "Jean Baudrillard - Simülakrlar ve Simülasyon, Byung-Chul Han - Şeffaflık Toplumu"
    },

    // --- HAFTA 12 ---
    {
      id: "w12_mon",
      study_week: 12,
      day_key: "monday",
      day_name: "Pazartesi",
      day_number: 1,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📈 Temel Ekonomi & Finans",
      category_key: "economy",
      topic_title: "Geleceğin Ekonomisi: Evrensel Temel Gelir & Robotik",
      guide_questions: [
        "Yapay zeka ve robotlar beyaz ve mavi yakalı işleri ikame ettiğinde toplum nasıl geçinecek?",
        "Evrensel Temel Gelir (Universal Basic Income) her vatandaşa koşulsuz maaş ödeme modeli uygulanabilir mi?",
        "Bill Gates'in önerdiği 'Robot Vergisi' otomasyonu ve kamu gelirlerini nasıl dengeler?",
        "Döngüsel Ekonomi (Circular Economy) sıfır atık ve yeniden kullanım modelini nasıl kurar?"
      ],
      key_takeaways: [
        "Evrensel Temel Gelir = Devletin istisnasız her vatandaşa düzenli nakit ödeme yapması",
        "Robot Vergisi = İnsanın yerine makine koyan şirketten vergi kesip sosyal fonlara aktarma",
        "Döngüsel Ekonomi = 'Al-Yap-At' doğrusal modelinden 'Geri Dönüştür-Yenile-Tamir Et' döngüsüne geçiş"
      ],
      notes_content: "Otomasyon emeği değersizleştirdiğinde ekonominin ayakta kalabilmesi için üretilen refahın tabana dağıtılması bir tercih değil zorunluluk olacaktır.",
      is_completed: false,
      resources: "Rutger Bregman - Gerçekçiler İçin Ütopya"
    },
    {
      id: "w12_tue",
      study_week: 12,
      day_key: "tuesday",
      day_name: "Salı",
      day_number: 2,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🏛️ Siyaset, Hukuk & Yönetim",
      category_key: "politics",
      topic_title: "Geleceğin Devlet Modelleri & Dijital Vatandaşlık",
      guide_questions: [
        "Ulus-devlet modeli küreselleşme ve internet çağında yetersiz mi kalıyor?",
        "Estonya'nın e-Residency (Dijital Vatandaşlık) modeli fiziki sınırlardan bağımsız devleti nasıl kurdu?",
        "Şehir Devletlerinin (Singapur, Dubai) yükselişi ve küresel cazibe merkezine dönüşmesi",
        "Ağ Devletleri (Network State: Balaji Srinivasan) internet topluluklarının devlete dönüşmesi mümkün mü?"
      ],
      key_takeaways: [
        "E-Estonya = Devlet hizmetlerinin %99'unun dijitalde (blokzincir altyapısıyla) verilmesi",
        "Ağ Devleti = Önce internette toplanan, fon toplayıp fiziksel arazi satın alan dijital ulus",
        "Şehir Devleti = Hızlı karar alabilen, bürokrasisi az, küresel sermaye çeken kompakt yönetim"
      ],
      notes_content: "Gelecekte vatandaşlık kan bağı veya toprakla değil, tercih edilen dijital platform ve sözleşmelerle belirlenen esnek bir kimliğe dönüşebilir.",
      is_completed: false,
      resources: "Balaji Srinivasan - The Network State, Parag Khanna - Gelecek Asya'dır"
    },
    {
      id: "w12_wed",
      study_week: 12,
      day_key: "wednesday",
      day_name: "Çarşamba",
      day_number: 3,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🧬 Biyoloji, Sağlık & Genetik",
      category_key: "health",
      topic_title: "Transhümanizm, Biyonik İnsan & Ölümsüzlük",
      guide_questions: [
        "Transhümanizm insanın biyolojik sınırlarını teknolojiyle aşma felsefesi midir?",
        "Neuralink beyin-makine arayüzleri düşünce hızıyla bilgisayar kontrolünü nasıl sağlıyor?",
        "Biyolojik yaşlanmanın (Senesens) bir hastalık gibi tedavi edilip durdurulması mümkün mü (David Sinclair)?",
        "Zihin Yükleme (Mind Uploading) ve dijital bilinç ölümsüzlüğü getirebilir mi?"
      ],
      key_takeaways: [
        "Transhümanizm = Genetik, sibernetik ve yapay zekayla 'Homo Deus' (İnsan-Tanrı) aşamasına geçiş",
        "Telomeraz & Hücresel Gençleşme = Hücrelerin biyolojik yaşını sıfırlayan epigenetik reprogramlama",
        "Sibernetik Hibrit = Biyonik uzuvlar ve yapay organlarla güçlendirilmiş insan bedeni"
      ],
      notes_content: "İnsan türü ilk kez doğal evrimin elinden direksiyonu alıp kendi biyolojisini tasarlayan bir yaratıcıya dönüşme eşiğindedir.",
      is_completed: false,
      resources: "Ray Kurzweil - İnsanlık 2.0 (Tekillik Yakın), David Sinclair - Yaşam Süresi: Neden Yaşlanıyoruz?"
    },
    {
      id: "w12_thu",
      study_week: 12,
      day_key: "thursday",
      day_name: "Perşembe",
      day_number: 4,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "🗣️ Dilbilim, Coğrafya & Jeopolitik",
      category_key: "languages",
      topic_title: "Büyük Dil Modelleri & Babil Kulesi'nin Yıkılışı",
      guide_questions: [
        "Yapay zeka (LLM - GPT, Claude, Gemini) insan dillerini ve anlamsal uzayı (Vector Embeddings) nasıl öğrendi?",
        "Gerçek zamanlı kulaklık çevirileri dünyadaki dil bariyerlerini tamamen kaldırırsa ne olur?",
        "Babil Kulesi efsanesinin (Dillerin ayrılması) teknolojiyle tersine dönmesi kültürel çeşitliliği yok eder mi?",
        "Yapay zeka insan dilinin ötesinde kendi dillerini ve iletişim protokollerini geliştirebilir mi?"
      ],
      key_takeaways: [
        "Vektör Uzayı = Kelimelerin ve kavramların çok boyutlu matematiksel mesafelerle temsil edilmesi",
        "Evrensel Çevirici = Anında ses ve mimik taklidiyle 100 dilde akıcı konuşabilme teknolojisi",
        "Sentetik Dil = İnsan dillerinin verimsizliğini aşan yapay zeka arası optimize iletişim"
      ],
      notes_content: "Büyük Dil Modelleri insanlığın ürettiği tüm yazılı külliyatı tek bir matematiksel matrise sığdırdı; dil bariyerleri artık tarihe karışmaktadır.",
      is_completed: false,
      resources: "Mustafa Suleyman - Yaklaşan Dalga, Ted Chiang - Nefes"
    },
    {
      id: "w12_fri",
      study_week: 12,
      day_key: "friday",
      day_name: "Cuma",
      day_number: 5,
      difficulty: 3,
      phase_name: "🥇 Faz 3: İleri Düzey Analiz",
      category_title: "📜 Tarih, Felsefe & Dünya Dinleri",
      category_key: "history",
      topic_title: "Fermi Paradoksu, Kardaşev Ölçeği & İnsanlığın Geleceği",
      guide_questions: [
        "Enrico Fermi'nin 'Evrende herkes nerede?' (Fermi Paradoksu) sorusunun yanıtları nelerdir?",
        "Büyük Filtre (Great Filter) hipotezine göre medeniyetler yıldızlararası aşamaya geçemeden kendini yok mu eder?",
        "Kardaşev Ölçeği (Tip 1: Gezegensel, Tip 2: Yıldızsal, Tip 3: Galaktik Medeniyet) nedir?",
        "İnsanlığın kozmik sorumluluğu: Evrendeki bilincin sönmeyen meşalesi olmak."
      ],
      key_takeaways: [
        "Fermi Paradoksu = 2 trilyon galaksi ve milyarlarca Dünya benzeri gezegene rağmen uzayda neden tek bir sinyal bulamadığımız çelişkisi",
        "Büyük Filtre = Nükleer savaş, yapay zeka veya iklim krizi gibi medeniyetleri yok eden evrensel bariyer",
        "Tip 1 Medeniyet = Kendi gezegeninin tüm enerjisini (deprem, güneş, okyanus) kontrol edebilen insanlık (Henüz Tip 0.73'üz)"
      ],
      notes_content: "Bizler evrenin kendi kendini anlama çabasıyız. Carl Sagan'ın dediği gibi 'Yıldız tozuyuz ve yıldızları anlamaya çalışıyoruz.' Genel kültür bu bilincin en büyük erdemidir.",
      is_completed: false,
      resources: "Carl Sagan - Kozmos, Michio Kaku - Geleceğin Fiziği"
    }
  ];

  window.CultureAPI = {
    _memoryCache: null,

    getActiveWeek() {
      try {
        const saved = parseInt(localStorage.getItem(SELECTED_WEEK_KEY), 10);
        if (saved >= 1 && saved <= 12) return saved;
      } catch (e) {}
      return 1;
    },

    setActiveWeek(weekNum) {
      const w = Math.min(Math.max(parseInt(weekNum, 10) || 1, 1), 12);
      localStorage.setItem(SELECTED_WEEK_KEY, String(w));
      window.dispatchEvent(new CustomEvent("culture:weekChanged", { detail: { week: w } }));
      return w;
    },

    getLocalNotes() {
      try {
        const raw = localStorage.getItem(CULTURE_STORAGE_KEY);
        if (!raw) {
          localStorage.setItem(CULTURE_STORAGE_KEY, JSON.stringify(INITIAL_CURRICULUM_12_WEEKS));
          return INITIAL_CURRICULUM_12_WEEKS;
        }
        let parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 60) {
          return parsed;
        }
        // Eksik hafta varsa INITIAL ile birleştir
        const merged = INITIAL_CURRICULUM_12_WEEKS.map(initialItem => {
          const found = parsed.find(p => p.id === initialItem.id || (p.study_week === initialItem.study_week && p.day_key === initialItem.day_key));
          return found ? { ...initialItem, ...found } : initialItem;
        });
        localStorage.setItem(CULTURE_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error("CultureAPI getLocalNotes error:", e);
        return INITIAL_CURRICULUM_12_WEEKS;
      }
    },

    saveLocalNotes(notes) {
      try {
        localStorage.setItem(CULTURE_STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.error("CultureAPI saveLocalNotes error:", e);
      }
    },

    async fetchNotes() {
      if (this._memoryCache) return this._memoryCache;

      if (window.supabaseClient) {
        try {
          const { data, error } = await window.supabaseClient
            .from("culture_study_notes")
            .select("*");

          if (!error && data && data.length > 0) {
            console.log("✅ Supabase culture_study_notes yüklendi:", data.length, "kayıt");
            const local = this.getLocalNotes();
            // Supabase verilerini yerel müfredat ile harmanla
            const merged = local.map(localItem => {
              const sbItem = data.find(d => d.id === localItem.id || (d.day_key === localItem.day_key && d.study_week === localItem.study_week));
              if (sbItem) {
                return {
                  ...localItem,
                  ...sbItem,
                  is_completed: !!sbItem.is_completed,
                  key_takeaways: sbItem.key_takeaways || localItem.key_takeaways,
                  notes_content: sbItem.notes_content || localItem.notes_content
                };
              }
              return localItem;
            });

            this._memoryCache = merged;
            this.saveLocalNotes(merged);
            return merged;
          } else if (error) {
            console.warn("⚠️ Supabase culture_study_notes sorgu uyarısı:", error.message);
          }
        } catch (err) {
          console.warn("⚠️ Supabase fetch culture_study_notes error, using local fallback:", err);
        }
      }

      const local = this.getLocalNotes();
      this._memoryCache = local;
      return local;
    },

    async getWeekNotes(weekNum = null) {
      const w = weekNum !== null ? weekNum : this.getActiveWeek();
      const all = await this.fetchNotes();
      return all.filter(item => (item.study_week || 1) === w);
    },

    async getAllWeeksSummary() {
      const all = await this.fetchNotes();
      const summary = [];
      const phaseNames = {
        1: "🥉 Faz 1: Temel Taşlar",
        2: "🥉 Faz 1: Temel Taşlar",
        3: "🥉 Faz 1: Temel Taşlar",
        4: "🥉 Faz 1: Temel Taşlar",
        5: "🥈 Faz 2: Sistemler & Krizler",
        6: "🥈 Faz 2: Sistemler & Krizler",
        7: "🥈 Faz 2: Sistemler & Krizler",
        8: "🥈 Faz 2: Sistemler & Krizler",
        9: "🥇 Faz 3: İleri Düzey Analiz",
        10: "🥇 Faz 3: İleri Düzey Analiz",
        11: "🥇 Faz 3: İleri Düzey Analiz",
        12: "🥇 Faz 3: İleri Düzey Analiz"
      };

      for (let w = 1; w <= 12; w++) {
        const weekItems = all.filter(i => (i.study_week || 1) === w);
        const completed = weekItems.filter(i => i.is_completed).length;
        summary.push({
          week: w,
          phase: phaseNames[w] || "Müfredat",
          completed,
          total: weekItems.length || 5,
          percent: Math.round((completed / (weekItems.length || 5)) * 100),
          items: weekItems
        });
      }
      return summary;
    },

    async saveNote(noteData) {
      let notes = await this.fetchNotes();
      const existingIdx = notes.findIndex(
        n => n.id === noteData.id || (n.day_key === noteData.day_key && (n.study_week || 1) === (noteData.study_week || 1))
      );

      const updatedItem = {
        ...((existingIdx >= 0 ? notes[existingIdx] : {})),
        ...noteData,
        updated_at: new Date().toISOString()
      };

      if (!updatedItem.id) {
        updatedItem.id = `w${updatedItem.study_week || 1}_${updatedItem.day_key}`;
      }

      if (existingIdx >= 0) {
        notes[existingIdx] = updatedItem;
      } else {
        notes.push(updatedItem);
      }

      this._memoryCache = notes;
      this.saveLocalNotes(notes);

      if (window.supabaseClient) {
        try {
          const payload = {
            day_key: updatedItem.day_key,
            day_name: updatedItem.day_name,
            category_title: updatedItem.category_title,
            topic_title: updatedItem.topic_title,
            notes_content: updatedItem.notes_content || "",
            key_takeaways: updatedItem.key_takeaways || [],
            resources: updatedItem.resources || "",
            is_completed: !!updatedItem.is_completed,
            study_week: updatedItem.study_week || 1
          };

          const { error } = await window.supabaseClient
            .from("culture_study_notes")
            .upsert(payload, { onConflict: "day_key" });

          if (error) {
            console.warn("⚠️ Supabase culture save warning:", error.message);
          } else {
            console.log("✅ Supabase culture study note kaydedildi");
          }
        } catch (err) {
          console.warn("⚠️ Supabase culture save error:", err);
        }
      }

      window.dispatchEvent(new CustomEvent("culture:changed", { detail: updatedItem }));
      return updatedItem;
    },

    async toggleComplete(itemIdOrDayKey, weekNum = null) {
      const notes = await this.fetchNotes();
      let target = notes.find(n => n.id === itemIdOrDayKey);
      if (!target && weekNum !== null) {
        target = notes.find(n => n.day_key === itemIdOrDayKey && (n.study_week || 1) === weekNum);
      }
      if (!target) {
        const activeW = this.getActiveWeek();
        target = notes.find(n => n.day_key === itemIdOrDayKey && (n.study_week || 1) === activeW);
      }
      if (!target) return null;

      target.is_completed = !target.is_completed;
      return await this.saveNote(target);
    },

    getTodayStudyDay() {
      const dayIdx = new Date().getDay();
      const map = {
        1: { key: "monday", name: "Pazartesi", isWeekend: false, dayNum: 1 },
        2: { key: "tuesday", name: "Salı", isWeekend: false, dayNum: 2 },
        3: { key: "wednesday", name: "Çarşamba", isWeekend: false, dayNum: 3 },
        4: { key: "thursday", name: "Perşembe", isWeekend: false, dayNum: 4 },
        5: { key: "friday", name: "Cuma", isWeekend: false, dayNum: 5 },
        6: { key: "saturday", name: "Cumartesi (Tekrar)", isWeekend: true, fallbackKey: "monday", dayNum: 1 },
        0: { key: "sunday", name: "Pazar (Değerlendirme)", isWeekend: true, fallbackKey: "friday", dayNum: 5 }
      };
      return map[dayIdx] || map[1];
    },

    async getTodayFocus() {
      const activeWeek = this.getActiveWeek();
      const weekNotes = await this.getWeekNotes(activeWeek);
      const todayInfo = this.getTodayStudyDay();
      
      let item = weekNotes.find(n => n.day_key === todayInfo.key);
      if (!item) {
        item = weekNotes.find(n => n.day_key === (todayInfo.fallbackKey || "monday")) || weekNotes[0];
      }

      return {
        todayInfo,
        item,
        activeWeek
      };
    },

    // ==========================================
    // KELİME & KAVRAM DAĞARCIĞI (LUGAT & KEŞİFLER)
    // ==========================================
    VOCAB_STORAGE_KEY: "oyp_culture_vocab_v1",

    INITIAL_VOCABULARY: [
      {
        id: "vocab-tecit",
        word: "Tecit (تجدید)",
        category: "📜 Edebiyat & Osmanlıca",
        origin: "Arapça (c-d-d kökü)",
        meaning: "Yenileme, tazeleme, baştan alma. Bir sözleşmeyi, bağı veya ahdi tazeleyip güncel kılma.",
        example: "Aramızdaki kadim dostluk bağını tecit etmek ve hatıraları tazelemek için bir araya geldik.",
        research_status: "researched",
        is_memorized: false,
        added_at: "2026-08-25"
      },
      {
        id: "vocab-musvedde",
        word: "Müsvedde (مسوّدة)",
        category: "✍️ Edebiyat & Yazı Sanatı",
        origin: "Arapça (sevâd / karalama kökünden)",
        meaning: "Temize çekilmemiş, üzerinde karalamalar ve düzeltmeler bulunan taslak metin veya çizim.",
        example: "Bütün büyük edebiyat şaheserleri, sabırla yırtılıp baştan yazılan müsveddelerin üzerinde yükselir.",
        is_memorized: false,
        added_at: "2026-08-25"
      },
      {
        id: "vocab-manolya",
        word: "Manolya Ağacı (Magnolia)",
        category: "🌿 Doğa & Botanik",
        origin: "Botanik (Pierre Magnol anısına)",
        meaning: "Dinozorlar çağından (95 milyon yıl önce) günümüze kalmış, arılar evrimleşmeden önce kınkanatlılarla tozlaşan, kadifemsi kokulu iri beyaz çiçekleriyle asil bir ağaç türü.",
        example: "Tarihi Boğaziçi yalılarının bahçesinde asırlık manolya ağaçları yazın gelişini müjdeler.",
        added_at: "2026-08-25"
      },
      {
        id: "vocab-dehliz",
        word: "Dehliz (دهليز)",
        category: "🏛️ Mimari & Tarih",
        origin: "Farsça",
        meaning: "Üstü kapalı, dar ve genellikle karanlık yeraltı geçidi veya koridor. Zihinsel karmaşa ve gizem için de metafor olarak kullanılır.",
        example: "Tarihi sarnıcın gizli dehlizlerinden geçerek eski şehrin yeraltı kemerlerine ulaştılar.",
        added_at: "2026-08-25"
      },
      {
        id: "vocab-muteveffa",
        word: "Müteveffa (متوفى)",
        category: "📜 Edebiyat & Hukuk",
        origin: "Arapça (vefat kökünden)",
        meaning: "Vefat etmiş, hayata gözlerini yummuş kimse. (Kaba ifadeler yerine kullanılan nezafet ve saygı sözcüğü).",
        example: "Müteveffa düşünürün ardında bıraktığı el yazması notlar kütüphane arşivine devredildi.",
        added_at: "2026-08-25"
      },
      {
        id: "vocab-letafet",
        word: "Letafet (لطافت)",
        category: "✨ Estetik & Felsefe",
        origin: "Arapça (lütuf / latif kökünden)",
        meaning: "İncelik, zarafet, yumuşaklık, hoşa giden narin ve ruh okşayıcı güzellik.",
        example: "Konuşmasındaki ölçü ve letafet, salondaki tüm gerginliği bir anda huzura dönüştürdü.",
        added_at: "2026-08-25"
      },
      {
        id: "vocab-mutekabiliyet",
        word: "Mütekabiliyet (متقابليّة)",
        category: "🏛️ Diplomasi & Hukuk",
        origin: "Arapça (karşılıklılık)",
        meaning: "Karşılıklılık ilkesi; uluslararası ilişkilerde bir devletin başka bir devlete uyguladığı muameleye aynı şekilde karşılık vermesi.",
        example: "Diplomatik vize ve mülk edinim kurallarında mütekabiliyet esası uluslararası hukukun temelidir.",
        added_at: "2026-08-25"
      }
    ],

    async fetchVocabulary() {
      let list = [];
      try {
        if (window.supabaseClient) {
          const { data, error } = await window.supabaseClient
            .from("culture_vocabulary")
            .select("*")
            .order("created_at", { ascending: false });
          if (!error && data && data.length > 0) {
            localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(data));
            return data;
          }
        }
      } catch (e) {
        console.warn("Supabase vocab fetch error:", e);
      }

      try {
        const local = localStorage.getItem(this.VOCAB_STORAGE_KEY);
        if (local) {
          list = JSON.parse(local);
        }
      } catch (e) {}

      if (!list || list.length === 0) {
        list = [...this.INITIAL_VOCABULARY];
        localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));
      } else {
        // Merge any new initial seed items that might not be in local storage yet
        this.INITIAL_VOCABULARY.forEach(seed => {
          if (!list.some(existing => existing.id === seed.id || existing.word === seed.word)) {
            list.push(seed);
          }
        });
        list = list.map(w => ({
          research_status: w.research_status || "researched",
          is_memorized: !!w.is_memorized,
          ...w
        }));
        localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));
      }
      return list;
    },

    async saveWord(wordData) {
      let list = await this.fetchVocabulary();
      const now = new Date().toISOString();

      if (!wordData.id) {
        wordData.id = "vocab-" + Date.now();
      }

      const idx = list.findIndex(w => w.id === wordData.id);
      const itemToSave = {
        ...wordData,
        updated_at: now
      };

      if (idx >= 0) {
        list[idx] = itemToSave;
      } else {
        itemToSave.created_at = now;
        list.unshift(itemToSave);
      }

      localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));

      if (window.supabaseClient) {
        try {
          await window.supabaseClient
            .from("culture_vocabulary")
            .upsert([itemToSave], { onConflict: "id" });
        } catch (e) {
          console.warn("Supabase vocab save warning:", e);
        }
      }

      window.dispatchEvent(new CustomEvent("culture:vocab_changed", { detail: itemToSave }));
      return itemToSave;
    },

    async toggleWordResearchStatus(wordId) {
      let list = await this.fetchVocabulary();
      const item = list.find(w => w.id === wordId);
      if (!item) return null;

      item.research_status = item.research_status === "to_research" ? "researched" : "to_research";
      item.updated_at = new Date().toISOString();

      localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));

      if (window.supabaseClient) {
        try {
          await window.supabaseClient
            .from("culture_vocabulary")
            .update({ research_status: item.research_status, updated_at: item.updated_at })
            .eq("id", wordId);
        } catch (e) {
          console.warn("Supabase vocab toggle research status warning:", e);
        }
      }

      window.dispatchEvent(new CustomEvent("culture:vocab_changed", { detail: item }));
      return item;
    },

    async toggleWordMemorized(wordId) {
      let list = await this.fetchVocabulary();
      const item = list.find(w => w.id === wordId);
      if (!item) return null;

      item.is_memorized = !item.is_memorized;
      item.updated_at = new Date().toISOString();

      localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));

      if (window.supabaseClient) {
        try {
          await window.supabaseClient
            .from("culture_vocabulary")
            .update({ is_memorized: item.is_memorized, updated_at: item.updated_at })
            .eq("id", wordId);
        } catch (e) {
          console.warn("Supabase vocab toggle warning:", e);
        }
      }

      window.dispatchEvent(new CustomEvent("culture:vocab_changed", { detail: item }));
      return item;
    },

    async deleteWord(wordId) {
      let list = await this.fetchVocabulary();
      list = list.filter(w => w.id !== wordId);
      localStorage.setItem(this.VOCAB_STORAGE_KEY, JSON.stringify(list));

      if (window.supabaseClient) {
        try {
          await window.supabaseClient
            .from("culture_vocabulary")
            .delete()
            .eq("id", wordId);
        } catch (e) {
          console.warn("Supabase vocab delete warning:", e);
        }
      }

      window.dispatchEvent(new CustomEvent("culture:vocab_changed", { detail: { id: wordId } }));
      return true;
    }
  };
})();
