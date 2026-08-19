// ===== ENGLISH.JS — English Learning & Practice Hub =====

const ENGLISH_STORAGE_KEY = 'oyp_english_places_v1';
const VOCAB_STORAGE_KEY = 'oyp_english_vocab_v1';
const FAV_PHRASES_KEY = 'oyp_english_fav_phrases_v1';
const FAV_VOCAB_KEY = 'oyp_english_fav_vocab_v1';
const MASTERED_VOCAB_KEY = 'oyp_english_mastered_vocab_v1';

// Initial Rich Place & Dialogue Dataset
const DEFAULT_PLACES = [
  {
    id: "cafe",
    title_tr: "Kafe & Kahve Dükkanı",
    title_en: "Cafe & Coffee Shop",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    description_tr: "Kahve siparişi verme, süt ve aroma tercihleri, tatlı seçimi, wi-fi sorma ve hesap ödeme.",
    description_en: "Ordering coffee, milk & syrup choices, pastries, asking for Wi-Fi and paying.",
    gradient: "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
    tag: "Yeme & İçme",
    sections: [
      {
        id: "cafe-s1",
        title_tr: "Bölüm 1: Kahve Siparişi & Boyut Seçimi",
        title_en: "Section 1: Ordering Coffee & Sizes",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "En sık kullanılan temel sipariş cümleleri ve boyut tercihleri.",
        phrases: [
          {
            id: "cp-1",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Merhaba, büyük boy yağsız sütlü Latte alabilir miyim lütfen?",
            en: "Hello, could I have a large latte with skim milk, please?",
            note: "'Could I have...' veya 'Can I get...' en kibar ve yaygın sipariş kalıbıdır."
          },
          {
            id: "cp-2",
            speaker: "Barista ☕",
            role: "staff",
            tr: "Tabii ki! Burada mı içeceksiniz yoksa paket mi olsun?",
            en: "Certainly! Is that for here or to go?",
            note: "Amerikan İngilizcesinde 'for here or to go', İngiliz İngilizcesinde 'eat in or takeaway' denir."
          },
          {
            id: "cp-3",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Paket olsun lütfen. Bir de içine vanilya şurubu ekleyebilir misiniz?",
            en: "To go, please. Also, could you add vanilla syrup to that?",
            note: "Ekstra aroma isterken 'could you add...?' kalıbı kullanılır."
          },
          {
            id: "cp-4",
            speaker: "Barista ☕",
            role: "staff",
            tr: "Elbette. Yanında kruvasan veya taze kurabiye ister misiniz?",
            en: "Sure thing. Would you like a croissant or a fresh cookie with that?",
            note: "'Would you like...' nazik bir teklif yöneltme kalıbıdır."
          },
          {
            id: "cp-5",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Hayır teşekkürler, sadece kahve. Kartla temassız ödeyebilir miyim?",
            en: "No, thank you, just the coffee. Can I pay with contactless card?",
            note: "'Contactless' temassız ödeme demektir."
          }
        ]
      },
      {
        id: "cafe-s2",
        title_tr: "Bölüm 2: Özel İstekler & Wi-Fi / Priz Sorma",
        title_en: "Section 2: Special Requests & Wi-Fi",
        level: "B1-B2 Orta",
        level_badge: "intermediate",
        desc_tr: "Çalışma ortamı, kablosuz ağ şifresi ve masaya servis diyalogları.",
        phrases: [
          {
            id: "cp-6",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Affedersiniz, Wi-Fi şifresini öğrenebilir miyim?",
            en: "Excuse me, could you tell me the Wi-Fi password?",
            note: "Garsona seslenirken her zaman 'Excuse me' ile başlamak nezakettir."
          },
          {
            id: "cp-7",
            speaker: "Garson ☕",
            role: "staff",
            tr: "Şifre fişinizin en altında yazıyor, ancak 'coffee2026' olarak da girebilirsiniz.",
            en: "It's printed at the bottom of your receipt, but you can also enter 'coffee2026'.",
            note: "'Receipt' fiş/makbuz anlamına gelir (p harfi okunmaz: re-siit)."
          },
          {
            id: "cp-8",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Şu köşedeki prizin yanında oturmamda bir sakınca var mı?",
            en: "Do you mind if I sit by that power outlet in the corner?",
            note: "'Do you mind if I...' bir şey için izin isterken en doğal ifadedir."
          },
          {
            id: "cp-9",
            speaker: "Garson ☕",
            role: "staff",
            tr: "Hiç sorun değil, dilediğiniz gibi rahatça oturup çalışabilirsiniz.",
            en: "Not at all, feel free to sit there and make yourself comfortable.",
            note: "'Feel free to...' istediğin gibi yapabilirsin demektir."
          }
        ]
      },
      {
        id: "cafe-s3",
        title_tr: "Bölüm 3: Yanlış Sipariş & Problem Çözme",
        title_en: "Section 3: Wrong Order & Polite Complaints",
        level: "C1 İleri",
        level_badge: "advanced",
        desc_tr: "Soğuk kahve, yanlış süt veya unutulan siparişlerde kibar iletişim.",
        phrases: [
          {
            id: "cp-10",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Kusura bakmayın ama ben yulaf sütlü istemiştim, bu inek sütü gibi görünüyor.",
            en: "I'm terribly sorry to bother you, but I asked for oat milk, and this seems to be regular dairy.",
            note: "'I'm terribly sorry to bother you...' kibar itiraz girişidir."
          },
          {
            id: "cp-11",
            speaker: "Barista ☕",
            role: "staff",
            tr: "Çok özür dilerim! Hemen sizin için yenisini hazırlıyorum.",
            en: "I do apologize for the mix-up! I'll remake that for you right away.",
            note: "'Mix-up' karışıklık/karışma anlamına gelir."
          }
        ]
      }
    ]
  },
  {
    id: "airport",
    title_tr: "Havalimanı & Uçuş",
    title_en: "Airport & Flight",
    icon: "✈️",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
    description_tr: "Check-in masası, bagaj teslimi, pasaport kontrolü, uçak içi diyaloglar ve aktarma.",
    description_en: "Check-in counter, baggage drop, passport control, in-flight phrases and transfers.",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
    tag: "Seyahat & Ulaşım",
    sections: [
      {
        id: "air-s1",
        title_tr: "Bölüm 1: Check-in & Bagaj Teslimi",
        title_en: "Section 1: Check-in & Baggage Drop",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Bilet gösterme, koltuk seçimi ve bagaj teslim cümleleri.",
        phrases: [
          {
            id: "ap-1",
            speaker: "Görevli 👮",
            role: "staff",
            tr: "İyi günler! Pasaportunuzu ve bilet rezervasyon kodunuzu görebilir miyim?",
            en: "Good day! May I see your passport and booking reference, please?",
            note: "'Booking reference' rezervasyon PNR kodudur."
          },
          {
            id: "ap-2",
            speaker: "Yolcu 🧳",
            role: "customer",
            tr: "Buyrun buradalar. Mümkünse cam kenarı bir koltuk alabilir miyim?",
            en: "Here they are. Could I get a window seat if available, please?",
            note: "'Window seat' cam kenarı, 'Aisle seat' koridor kenarıdır."
          },
          {
            id: "ap-3",
            speaker: "Görevli 👮",
            role: "staff",
            tr: "Kaç parça bagaj teslim edeceksiniz?",
            en: "How many bags will you be checking in today?",
            note: "'Check in a bag' bagajı uçağın altına vermek demektir."
          },
          {
            id: "ap-4",
            speaker: "Yolcu 🧳",
            role: "customer",
            tr: "Bir büyük valizim ve bir de kabin boy el çantam var.",
            en: "Just one large suitcase to check, and one carry-on bag with me.",
            note: "'Carry-on' kabin el bagajıdır."
          },
          {
            id: "ap-5",
            speaker: "Görevli 👮",
            role: "staff",
            tr: "Uçağınız 14B kapısından kalkacak ve biniş saati 16:30'da başlayacak. İyi uçuşlar!",
            en: "Your flight departs from Gate 14B and boarding starts at 4:30 PM. Have a safe flight!",
            note: "'Boarding' uçağa biniş işlemidir."
          }
        ]
      },
      {
        id: "air-s2",
        title_tr: "Bölüm 2: Pasaport Kontrolü & Güvenlik",
        title_en: "Section 2: Passport Control & Security",
        level: "B1-B2 Orta",
        level_badge: "intermediate",
        desc_tr: "Ziyaret amacı, kalış süresi ve gümrük sorularına yanıt verme.",
        phrases: [
          {
            id: "ap-6",
            speaker: "Memur 🛂",
            role: "staff",
            tr: "Ziyaretinizin amacı nedir ve ülkede ne kadar süre kalacaksınız?",
            en: "What is the purpose of your visit, and how long do you intend to stay?",
            note: "'Purpose of your visit' vize ve pasaport kontrolünün 1 numaralı sorusudur."
          },
          {
            id: "ap-7",
            speaker: "Yolcu 🧳",
            role: "customer",
            tr: "Turistik gezi ve tatil için geldim, 10 gün kalıp dönüş yapacağım.",
            en: "I am here on vacation for sightseeing, and I will stay for 10 days.",
            note: "'On vacation' tatilde olmak demektir."
          },
          {
            id: "ap-8",
            speaker: "Memur 🛂",
            role: "staff",
            tr: "Dönüş biletinizi ve otel rezervasyonunuzu gösterebilir misiniz?",
            en: "Could you show me your return flight ticket and hotel confirmation?",
            note: "'Return ticket' gidiş-dönüş uçak biletidir."
          }
        ]
      }
    ]
  },
  {
    id: "restaurant",
    title_tr: "Restoran & Akşam Yemeği",
    title_en: "Restaurant & Dining",
    icon: "🍽️",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    description_tr: "Masa rezervasyonu, menü tavsiyesi isteme, alerjen sorma, hesap ve bahşiş diyalogları.",
    description_en: "Table reservations, menu recommendations, allergen queries, bill and tipping.",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    tag: "Yeme & İçme",
    sections: [
      {
        id: "res-s1",
        title_tr: "Bölüm 1: Masa İsteme & Menü İnceleme",
        title_en: "Section 1: Getting a Table & Menu",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Kaç kişilik masa olduğu, menü isteme ve günün çorbası.",
        phrases: [
          {
            id: "rp-1",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "İyi akşamlar, iki kişilik boş masanız var mı acaba?",
            en: "Good evening, do you have a table available for two, please?",
            note: "'Table for two' iki kişilik masa demektir."
          },
          {
            id: "rp-2",
            speaker: "Garson 🍷",
            role: "staff",
            tr: "Evet tabii ki, lütfen beni takip edin. İşte menüleriniz.",
            en: "Yes of course, please follow me right this way. Here are your menus.",
            note: "'Follow me' beni takip edin demektir."
          },
          {
            id: "rp-3",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Şefin özel yemeği veya bugün için ne tavsiye edersiniz?",
            en: "What do you recommend as the chef's special today?",
            note: "'Chef's special' şefin günün tavsiyesidir."
          },
          {
            id: "rp-4",
            speaker: "Garson 🍷",
            role: "staff",
            tr: "Izgara levrek ve yanında fırınlanmış sebzelerimiz bugün çok taze ve popüler.",
            en: "Our grilled sea bass with roasted vegetables is exceptionally fresh today.",
            note: "'Sea bass' levrek balığıdır."
          }
        ]
      },
      {
        id: "res-s2",
        title_tr: "Bölüm 2: Alerjenler, Pişme Derecesi & Hesap",
        title_en: "Section 2: Allergies, Meat Doneness & Bill",
        level: "B1-B2 Orta",
        level_badge: "intermediate",
        desc_tr: "Fıstık/gluten alerjisi, etin pişme derecesi ve hesabı isteme.",
        phrases: [
          {
            id: "rp-5",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Fıstığa alerjim var. Bu sosun içinde herhangi bir kuruyemiş var mı?",
            en: "I am allergic to peanuts. Does this sauce contain any nuts?",
            note: "'Allergic to...' alerjisi olmak demektir."
          },
          {
            id: "rp-6",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Biftek orta-iyi pişmiş olsun lütfen.",
            en: "I'd like my steak cooked medium-well, please.",
            note: "Et pişme dereceleri: Rare (Az), Medium (Orta), Medium-well (Orta-İyi), Well-done (Çok pişmiş)."
          },
          {
            id: "rp-7",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Hesabı alabilir miyiz lütfen? Servis ücreti dahil mi?",
            en: "Could we get the bill, please? Is service charge included?",
            note: "Amerikan İngilizcesinde 'the check', İngiliz İngilizcesinde 'the bill' denir."
          }
        ]
      }
    ]
  },
  {
    id: "taxi",
    title_tr: "Taksi & Ulaşım",
    title_en: "Taxi & Ride",
    icon: "🚕",
    image: "https://images.unsplash.com/photo-1549520018-68a3eb1447dd?auto=format&fit=crop&w=900&q=80",
    description_tr: "Taksiye binme, varış adresini söyleme, taksimetre açtırma ve yönlendirme.",
    description_en: "Catching a taxi, giving destination address, taximeter and directions.",
    gradient: "linear-gradient(135deg, #713f12 0%, #eab308 100%)",
    tag: "Seyahat & Ulaşım",
    sections: [
      {
        id: "tax-s1",
        title_tr: "Bölüm 1: Adres Belirtme & Ücret Sorma",
        title_en: "Section 1: Destination & Fare",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Beni şu adrese götürür müsünüz, taksimetre açar mısınız kalıpları.",
        phrases: [
          {
            id: "tp-1",
            speaker: "Yolcu 👤",
            role: "customer",
            tr: "Merhaba, beni şehir merkezindeki Grand Hotel'e götürebilir misiniz?",
            en: "Hello, could you take me to the Grand Hotel in the city center, please?",
            note: "'Could you take me to...' bir yere gitmek istediğinde kullanılan en pratik kalıptır."
          },
          {
            id: "tp-2",
            speaker: "Şoför 🚕",
            role: "staff",
            tr: "Tabii ki! Valizlerinizi bagaja koymama izin verin.",
            en: "Sure thing! Let me put your luggage in the trunk for you.",
            note: "'Trunk' (Amerikan) veya 'Boot' (İngiliz) araba bagajıdır."
          },
          {
            id: "tp-3",
            speaker: "Yolcu 👤",
            role: "customer",
            tr: "Teşekkürler. Oraya varmamız yaklaşık ne kadar sürer?",
            en: "Thanks. How long do you think it will take to get there?",
            note: "'How long will it take?' ne kadar sürer anlamına gelir."
          },
          {
            id: "tp-4",
            speaker: "Yolcu 👤",
            role: "customer",
            tr: "Lütfen beni şu binanın tam önünde indirebilir misiniz? Üstü kalsın!",
            en: "Could you drop me off right in front of that building, please? Keep the change!",
            note: "'Drop me off' beni indirin, 'Keep the change' üstü kalsın demektir."
          }
        ]
      }
    ]
  },
  {
    id: "street",
    title_tr: "Sokak & Yol Tarifi",
    title_en: "Street & Directions",
    icon: "🏙️",
    image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=900&q=80",
    description_tr: "Yoldan geçen birine adres sorma, metro istasyonu bulma, sağa/sola dönme tarifleri.",
    description_en: "Asking pedestrians for directions, finding subway stations, turns and landmarks.",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    tag: "Şehir & Yaşam",
    sections: [
      {
        id: "str-s1",
        title_tr: "Bölüm 1: Yol Sorma & Dönüş Kalıpları",
        title_en: "Section 1: Asking Directions & Turns",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "En yakın metro nerede, düz git, sağa dön, ışıklardan sonra kalıpları.",
        phrases: [
          {
            id: "sp-1",
            speaker: "Turist 👤",
            role: "customer",
            tr: "Affedersiniz, en yakın metro istasyonuna nasıl gidebilirim?",
            en: "Excuse me, how can I get to the nearest subway station?",
            note: "'How can I get to...' bir yere nasıl gideceğinizi sorarken en net kalıptır."
          },
          {
            id: "sp-2",
            speaker: "Yerli Sakin 🚶",
            role: "staff",
            tr: "Bu cadde boyunca düz yürüyün, trafik ışıklarından sağa dönün. Solunuzda göreceksiniz.",
            en: "Go straight down this street, take a right at the traffic lights. It will be on your left.",
            note: "'Go straight' düz git, 'take a right' sağa dön demektir."
          },
          {
            id: "sp-3",
            speaker: "Turist 👤",
            role: "customer",
            tr: "Yürüme mesafesinde mi yoksa otobüse binmem gerekir mi?",
            en: "Is it within walking distance, or should I take a bus?",
            note: "'Within walking distance' yürüme mesafesinde demektir."
          },
          {
            id: "sp-4",
            speaker: "Yerli Sakin 🚶",
            role: "staff",
            tr: "Sadece 5 dakikalık yürüme mesafesinde, kaçırmanız imkansız!",
            en: "It's only a 5-minute walk from here, you can't miss it!",
            note: "'You can't miss it' kesinlikle bulursunuz/kaçırmazsınız demektir."
          }
        ]
      }
    ]
  },
  {
    id: "shopping",
    title_tr: "Alışveriş & Mağaza",
    title_en: "Shopping & Store",
    icon: "🛍️",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description_tr: "Beden/renk sorma, deneme kabini, indirim sorma, iade ve fiş isteme.",
    description_en: "Sizes, colors, fitting room, discounts, returns and receipts.",
    gradient: "linear-gradient(135deg, #831843 0%, #db2777 100%)",
    tag: "Alışveriş",
    sections: [
      {
        id: "shop-s1",
        title_tr: "Bölüm 1: Beden & Deneme Kabini",
        title_en: "Section 1: Sizes & Fitting Room",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Bunun Medium bedeni var mı, üzerimde deneyebilir miyim cümleleri.",
        phrases: [
          {
            id: "shp-1",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Bunun Medium bedeni veya siyah rengi var mı elinizde?",
            en: "Do you have this in size Medium or in black color?",
            note: "'In size Medium' veya 'in size Small/Large' kalıbı beden sorarken kullanılır."
          },
          {
            id: "shp-2",
            speaker: "Satış Danışmanı 🛍️",
            role: "staff",
            tr: "Hemen depoya bakayım sizin için. Evet, son bir adet kalmış!",
            en: "Let me check the stock room for you. Yes, we have one last piece left!",
            note: "'Stock room' mağaza deposudur."
          },
          {
            id: "shp-3",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Harika! Deneme kabinleri nerede acaba?",
            en: "Wonderful! Where are the fitting rooms located?",
            note: "'Fitting room' veya 'Dressing room' deneme kabinidir."
          },
          {
            id: "shp-4",
            speaker: "Müşteri 👤",
            role: "customer",
            tr: "Bu üzerime tam oturdu. Şu an uygulanan herhangi bir indirim var mı?",
            en: "This fits me perfectly. Is there any discount on this item right now?",
            note: "'It fits me' üzerime tam oldu/uydu anlamına gelir."
          }
        ]
      }
    ]
  },
  {
    id: "hotel",
    title_tr: "Otel & Konaklama",
    title_en: "Hotel & Accommodation",
    icon: "🏨",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    description_tr: "Otele giriş (Check-in), oda anahtarı, kahvaltı saatleri, oda servisi ve çıkış.",
    description_en: "Hotel check-in, key card, breakfast hours, room service and check-out.",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
    tag: "Konaklama",
    sections: [
      {
        id: "hot-s1",
        title_tr: "Bölüm 1: Check-in & Oda Bilgileri",
        title_en: "Section 1: Check-in & Room Details",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Otel giriş işlemleri, oda kartı alma ve kahvaltı detayları.",
        phrases: [
          {
            id: "hp-1",
            speaker: "Misafir 👤",
            role: "customer",
            tr: "İyi günler, 'Yılmaz' ismiyle 3 gecelik bir rezervasyonum vardı.",
            en: "Good afternoon, I have a reservation for three nights under the name 'Yilmaz'.",
            note: "'Under the name...' rezervasyon yapılan ismi söylerken kullanılır."
          },
          {
            id: "hp-2",
            speaker: "Resepsiyonist 🏨",
            role: "staff",
            tr: "Hoş geldiniz! İşte 402 numaralı deniz manzaralı odanızın anahtar kartı.",
            en: "Welcome! Here is your key card for room 402 with a sea view.",
            note: "'Key card' elektronik oda kartıdır."
          },
          {
            id: "hp-3",
            speaker: "Misafir 👤",
            role: "customer",
            tr: "Sabah kahvaltısı saat kaçta ve hangi katta servis ediliyor?",
            en: "What time is breakfast served, and on which floor?",
            note: "'Breakfast served' kahvaltı servis edilme saatidir."
          },
          {
            id: "hp-4",
            speaker: "Resepsiyonist 🏨",
            role: "staff",
            tr: "Kahvaltı lobi katında sabah 07:00 ile 10:30 arasında açık büfedir.",
            en: "Breakfast is a buffet on the lobby level between 7:00 and 10:30 AM.",
            note: "'Buffet' açık büfe demektir."
          }
        ]
      }
    ]
  },
  {
    id: "museum",
    title_tr: "Müze & Sanat Galerisi",
    title_en: "Museum & Sightseeing",
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80",
    description_tr: "Müze bileti alma, sesli rehber (audio guide) kiralama, fotoğraf kuralları.",
    description_en: "Buying museum tickets, audio guides, photography rules and exhibitions.",
    gradient: "linear-gradient(135deg, #3b0764 0%, #7e22ce 100%)",
    tag: "Kültür & Sanat",
    sections: [
      {
        id: "mus-s1",
        title_tr: "Bölüm 1: Bilet Alma & Sesli Rehber",
        title_en: "Section 1: Tickets & Audio Guide",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Yetişkin/öğrenci bileti alma ve Türkçe sesli rehber sorma.",
        phrases: [
          {
            id: "mp-1",
            speaker: "Ziyaretçi 👤",
            role: "customer",
            tr: "İki adet yetişkin ve bir adet öğrenci bileti alabilir miyim?",
            en: "Could I have two adult tickets and one student ticket, please?",
            note: "'Adult ticket' yetişkin, 'Student ticket' öğrenci biletidir."
          },
          {
            id: "mp-2",
            speaker: "Gişe Görevlisi 🏛️",
            role: "staff",
            tr: "Türkçe dil seçeneği bulunan sesli rehber cihazı ister misiniz?",
            en: "Would you like an audio guide device with Turkish language support?",
            note: "'Audio guide' sesli kulaklık rehberidir."
          },
          {
            id: "mp-3",
            speaker: "Ziyaretçi 👤",
            role: "customer",
            tr: "İçeride flaşsız fotoğraf çekimine izin veriliyor mu?",
            en: "Is photography without flash permitted inside the galleries?",
            note: "'Without flash' flaşsız demektir."
          }
        ]
      }
    ]
  },
  {
    id: "pharmacy",
    title_tr: "Eczane & Sağlık",
    title_en: "Pharmacy & Health",
    icon: "🏥",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=900&q=80",
    description_tr: "Ağrı kesici isteme, semptom açıklama (baş ağrısı, boğaz ağrısı), ilaç kullanım sıklığı.",
    description_en: "Painkillers, describing symptoms, cough & sore throat, medication dosage.",
    gradient: "linear-gradient(135deg, #022c22 0%, #059669 100%)",
    tag: "Sağlık",
    sections: [
      {
        id: "pha-s1",
        title_tr: "Bölüm 1: Semptom Açıklama & İlaç İsteme",
        title_en: "Section 1: Symptoms & Medication",
        level: "A1-A2 Başlangıç",
        level_badge: "beginner",
        desc_tr: "Boğaz ağrısı, mide bulantısı ve reçetesiz ilaç alma diyalogları.",
        phrases: [
          {
            id: "php-1",
            speaker: "Hasta 👤",
            role: "customer",
            tr: "Şiddetli bir baş ağrım ve boğaz ağrım var. Reçetesiz ne tavsiye edersiniz?",
            en: "I have a severe headache and a sore throat. What do you recommend over the counter?",
            note: "'Over the counter (OTC)' reçetesiz satılan ilaç demektir."
          },
          {
            id: "php-2",
            speaker: "Eczacı 💊",
            role: "staff",
            tr: "Bu pastilleri günde üç kez tok karnına alabilirsiniz.",
            en: "You can take these lozenges three times a day after meals.",
            note: "'After meals' tok karnına, 'Lozenges' boğaz pastilidir."
          }
        ]
      }
    ]
  }
];

// Rich Vocabulary Bank (100+ Essential Words)
const DEFAULT_VOCAB = [
  // Kafe & Yeme İçme
  { id: "v1", word: "Takeaway / To go", meaning: "Paket (Al-götür)", pron: "[ˈteɪk.ə.weɪ]", cat: "Kafe & Yeme İçme", level: "A1", ex_en: "Can I get a coffee to go?", ex_tr: "Paket bir kahve alabilir miyim?" },
  { id: "v2", word: "Receipt", meaning: "Fiş, makbuz", pron: "[rɪˈsiːt]", cat: "Kafe & Yeme İçme", level: "A1", ex_en: "Would you like your receipt?", ex_tr: "Fişinizi ister misiniz?" },
  { id: "v3", word: "Skim milk", meaning: "Yağsız süt", pron: "[skɪm mɪlk]", cat: "Kafe & Yeme İçme", level: "A2", ex_en: "A latte with skim milk, please.", ex_tr: "Yağsız sütlü bir latte lütfen." },
  { id: "v4", word: "Decaf", meaning: "Kafeinsiz", pron: "[ˈdiː.kæf]", cat: "Kafe & Yeme İçme", level: "A2", ex_en: "Do you have decaf espresso?", ex_tr: "Kafeinsiz esprsonuz var mı?" },
  { id: "v5", word: "Sweetener", meaning: "Tatlandırıcı", pron: "[ˈswiːt.nər]", cat: "Kafe & Yeme İçme", level: "B1", ex_en: "I prefer artificial sweetener instead of sugar.", ex_tr: "Şeker yerine tatlandırıcı tercih ederim." },
  { id: "v6", word: "Tap water", meaning: "Musluk / İçme suyu", pron: "[tæp ˈwɔː.tər]", cat: "Kafe & Yeme İçme", level: "A1", ex_en: "A glass of tap water is fine.", ex_tr: "Bir bardak musluk suyu yeterli." },
  { id: "v7", word: "Appetizer", meaning: "Başlangıç yemeği, meze", pron: "[ˈæp.ə.taɪ.zər]", cat: "Kafe & Yeme İçme", level: "B1", ex_en: "Shall we order some appetizers first?", ex_tr: "Önce başlangıçlardan sipariş edelim mi?" },
  { id: "v8", word: "Rare / Well-done", meaning: "Az pişmiş / Çok pişmiş (et)", pron: "[reər / wɛl dʌn]", cat: "Kafe & Yeme İçme", level: "A2", ex_en: "I'd like my steak well-done.", ex_tr: "Bifteğimi çok pişmiş istiyorum." },
  { id: "v9", word: "Bill / Check", meaning: "Hesap", pron: "[bɪl / tʃɛk]", cat: "Kafe & Yeme İçme", level: "A1", ex_en: "Could we have the bill, please?", ex_tr: "Hesabı alabilir miyiz lütfen?" },
  { id: "v10", word: "Tip / Gratuity", meaning: "Bahşiş", pron: "[tɪp / ɡrəˈtjuː.ə.ti]", cat: "Kafe & Yeme İçme", level: "B1", ex_en: "Is tip included in the total?", ex_tr: "Bahşiş toplama dahil mi?" },

  // Havalimanı & Seyahat
  { id: "v11", word: "Boarding pass", meaning: "Uçağa biniş kartı", pron: "[ˈbɔː.dɪŋ ˌpɑːs]", cat: "Seyahat & Havalimanı", level: "A1", ex_en: "Please show your boarding pass at the gate.", ex_tr: "Lütfen kapıda biniş kartınızı gösterin." },
  { id: "v12", word: "Baggage claim", meaning: "Bagaj teslim alanı", pron: "[ˈbæɡ.ɪdʒ kleɪm]", cat: "Seyahat & Havalimanı", level: "A2", ex_en: "Proceed to carousel 4 for baggage claim.", ex_tr: "Bagaj teslimi için 4 numaralı banda ilerleyin." },
  { id: "v13", word: "Customs", meaning: "Gümrük", pron: "[ˈkʌs.təmz]", cat: "Seyahat & Havalimanı", level: "B1", ex_en: "Do you have anything to declare at customs?", ex_tr: "Gümrükte beyan edeceğiniz bir şey var mı?" },
  { id: "v14", word: "Departure / Arrival", meaning: "Kalkış / Varış", pron: "[dɪˈpɑː.tʃər / əˈraɪ.vəl]", cat: "Seyahat & Havalimanı", level: "A1", ex_en: "Check the departures board for gate info.", ex_tr: "Kapı bilgisi için kalkış panosuna bakın." },
  { id: "v15", word: "Carry-on luggage", meaning: "Kabin / El bagajı", pron: "[ˈkær.i.ɒn ˈlʌɡ.ɪdʒ]", cat: "Seyahat & Havalimanı", level: "A2", ex_en: "Only one carry-on bag is allowed per person.", ex_tr: "Kişi başı yalnızca bir el bagajına izin verilir." },
  { id: "v16", word: "Delayed / Cancelled", meaning: "Rötarlı / İptal edilmiş", pron: "[dɪˈleɪd / ˈkæn.səld]", cat: "Seyahat & Havalimanı", level: "A2", ex_en: "Flight TK1980 is delayed by two hours.", ex_tr: "TK1980 uçuşu iki saat rötarlı." },
  { id: "v17", word: "Aisle seat", meaning: "Koridor tarafı koltuk", pron: "[aɪl siːt]", cat: "Seyahat & Havalimanı", level: "B1", ex_en: "I prefer an aisle seat for extra legroom.", ex_tr: "Daha fazla bacak mesafesi için koridor koltuğunu tercih ederim." },
  { id: "v18", word: "Layover / Transfer", meaning: "Aktarma / Bekleme süresi", pron: "[ˈleɪˌoʊ.vər]", cat: "Seyahat & Havalimanı", level: "B2", ex_en: "We have a three-hour layover in Frankfurt.", ex_tr: "Frankfurt'ta 3 saatlik aktarma beklememiz var." },

  // Taksi & Ulaşım
  { id: "v19", word: "Fare", meaning: "Bilet / Yolculuk ücreti", pron: "[feər]", cat: "Taksi & Ulaşım", level: "A2", ex_en: "How much is the fare to the airport?", ex_tr: "Havalimanına yolculuk ücreti ne kadar?" },
  { id: "v20", word: "Taximeter", meaning: "Taksimetre", pron: "[ˈtæk.siˌmiː.tər]", cat: "Taksi & Ulaşım", level: "A2", ex_en: "Could you please turn on the meter?", ex_tr: "Lütfen taksimetreyi açabilir misiniz?" },
  { id: "v21", word: "Drop off", meaning: "İndirmek (araçtan)", pron: "[drɒp ɒf]", cat: "Taksi & Ulaşım", level: "B1", ex_en: "You can drop me off right here.", ex_tr: "Beni tam burada indirebilirsiniz." },
  { id: "v22", word: "Pick up", meaning: "Almak (arabayla)", pron: "[pɪk ʌp]", cat: "Taksi & Ulaşım", level: "A2", ex_en: "The driver will pick us up at 8:00 AM.", ex_tr: "Şoför bizi sabah 08:00'de alacak." },
  { id: "v23", word: "Change (money)", meaning: "Para üstü", pron: "[tʃeɪndʒ]", cat: "Taksi & Ulaşım", level: "A1", ex_en: "Keep the change, thank you!", ex_tr: "Üstü kalsın, teşekkür ederim!" },
  { id: "v24", word: "Trunk / Boot", meaning: "Araba bagajı", pron: "[trʌŋk / buːt]", cat: "Taksi & Ulaşım", level: "B1", ex_en: "Can we put these bags in the trunk?", ex_tr: "Bu çantaları bagaja koyabilir miyiz?" },

  // Sokak & Yol Tarifi
  { id: "v25", word: "Crosswalk", meaning: "Yaya geçidi", pron: "[ˈkrɒs.wɔːk]", cat: "Sokak & Yol Tarifi", level: "A2", ex_en: "Use the crosswalk to get to the other side.", ex_tr: "Karşıya geçmek için yaya geçidini kullanın." },
  { id: "v26", word: "Traffic lights", meaning: "Trafik ışıkları", pron: "[ˈtræf.ɪk laɪts]", cat: "Sokak & Yol Tarifi", level: "A1", ex_en: "Turn left at the next traffic lights.", ex_tr: "Gelecek trafik ışıklarından sola dönün." },
  { id: "v27", word: "Intersection", meaning: "Dörtyol, kavşak", pron: "[ˌɪn.təˈsek.ʃən]", cat: "Sokak & Yol Tarifi", level: "B1", ex_en: "Turn right after passing the intersection.", ex_tr: "Kavşağı geçtikten sonra sağa dönün." },
  { id: "v28", word: "Within walking distance", meaning: "Yürüme mesafesinde", pron: "[wɪˈðɪn ˈwɔː.kɪŋ]", cat: "Sokak & Yol Tarifi", level: "B2", ex_en: "The beach is within walking distance.", ex_tr: "Plaj yürüme mesafesinde." },
  { id: "v29", word: "Landmark", meaning: "Belirgin yapı, simge", pron: "[ˈlænd.mɑːk]", cat: "Sokak & Yol Tarifi", level: "B2", ex_en: "The clock tower is a famous local landmark.", ex_tr: "Saat kulesi şehrin ünlü bir simgesidir." },

  // Alışveriş
  { id: "v30", word: "Fitting room", meaning: "Deneme kabini", pron: "[ˈfɪt.ɪŋ ruːm]", cat: "Alışveriş & Mağaza", level: "A2", ex_en: "Where is the nearest fitting room?", ex_tr: "En yakın deneme kabini nerede?" },
  { id: "v31", word: "Discount / Sale", meaning: "İndirim / İndirimli satış", pron: "[ˈdɪs.kaʊnt / seɪl]", cat: "Alışveriş & Mağaza", level: "A1", ex_en: "Is there any discount on this jacket?", ex_tr: "Bu cekette herhangi bir indirim var mı?" },
  { id: "v32", word: "Refund / Exchange", meaning: "Para iadesi / Değişim", pron: "[ˈriː.fʌnd / ɪksˈtʃeɪndʒ]", cat: "Alışveriş & Mağaza", level: "B1", ex_en: "Can I get a refund if it doesn't fit?", ex_tr: "Uymazsa para iadesi alabilir miyim?" },
  { id: "v33", word: "In stock", meaning: "Stokta mevcut", pron: "[ɪn stɒk]", cat: "Alışveriş & Mağaza", level: "B1", ex_en: "We don't have size 42 in stock right now.", ex_tr: "Şu anda stokta 42 bedenimiz yok." },
  { id: "v34", word: "Price tag", meaning: "Fiyat etiketi", pron: "[praɪs tæɡ]", cat: "Alışveriş & Mağaza", level: "A1", ex_en: "Check the price tag on the back.", ex_tr: "Arkada yer alan fiyat etiketine bakın." },

  // Otel & Konaklama
  { id: "v35", word: "Key card", meaning: "Oda anahtar kartı", pron: "[kiː kɑːd]", cat: "Otel & Konaklama", level: "A1", ex_en: "Please keep your key card with you.", ex_tr: "Lütfen anahtar kartınızı yanınızda bulundurun." },
  { id: "v36", word: "Wake-up call", meaning: "Uyandırma servisi araması", pron: "[ˈweɪk.ʌp kɔːl]", cat: "Otel & Konaklama", level: "A2", ex_en: "Can I schedule a wake-up call for 7:00 AM?", ex_tr: "Sabah 07:00 için bir uyandırma araması isteyebilir miyim?" },
  { id: "v37", word: "Housekeeping", meaning: "Kat / Oda temizlik hizmeti", pron: "[ˈhaʊsˌkiː.pɪŋ]", cat: "Otel & Konaklama", level: "B1", ex_en: "Housekeeping cleans the rooms every morning.", ex_tr: "Kat hizmetleri her sabah odaları temizler." },
  { id: "v38", word: "Do not disturb", meaning: "Rahatsız etmeyiniz", pron: "[duː nɒt dɪˈstɜːb]", cat: "Otel & Konaklama", level: "A1", ex_en: "Hang the 'Do Not Disturb' sign on the door handle.", ex_tr: "Kapı koluna 'Rahatsız Etmeyiniz' levhasını asın." },
  { id: "v39", word: "Complimentary", meaning: "İkram, ücretsiz", pron: "[ˌkɒm.plɪˈmen.tər.i]", cat: "Otel & Konaklama", level: "B2", ex_en: "Bottled water in the room is complimentary.", ex_tr: "Odadaki şişe su ikramımızdır." },

  // Eczane & Sağlık
  { id: "v40", word: "Painkiller", meaning: "Ağrı kesici", pron: "[ˈpeɪnˌkɪl.ər]", cat: "Eczane & Sağlık", level: "A2", ex_en: "Do you need a painkiller for your toothache?", ex_tr: "Diş ağrınız için bir ağrı kesiciye ihtiyacınız var mı?" },
  { id: "v41", word: "Prescription", meaning: "Reçete", pron: "[prɪˈskrɪp.ʃən]", cat: "Eczane & Sağlık", level: "B1", ex_en: "This medicine is only available with a doctor's prescription.", ex_tr: "Bu ilaç sadece doktor reçetesiyle alınabilir." },
  { id: "v42", word: "Drowsiness", meaning: "Uyuşukluk, uyku hali", pron: "[ˈdraʊ.zi.nəs]", cat: "Eczane & Sağlık", level: "B2", ex_en: "This allergy pill may cause mild drowsiness.", ex_tr: "Bu alerji hapı hafif uyku hali yapabilir." },
  { id: "v43", word: "Side effect", meaning: "Yan etki", pron: "[saɪd ɪˈfekt]", cat: "Eczane & Sağlık", level: "B1", ex_en: "Are there any side effects of this medication?", ex_tr: "Bu ilacın herhangi bir yan etkisi var mı?" },
  { id: "v44", word: "Lozenges", meaning: "Boğaz pastili", pron: "[ˈlɒz.ɪndʒɪz]", cat: "Eczane & Sağlık", level: "B2", ex_en: "Take a soothing lozenge for your cough.", ex_tr: "Öksürüğünüz için yatıştırıcı bir pastil alın." }
];

// App State
const EnglishApp = {
  places: [],
  vocab: [],
  favoritePhrases: new Set(),
  favoriteVocab: new Set(),
  masteredVocab: new Set(),
  activeTab: 'places', // 'places', 'detail', 'vocab', 'mastered', 'quiz', 'favorites'
  activePlaceId: null,
  activeSectionId: null,
  vocabFilter: 'all',
  vocabLevelFilter: 'all',
  vocabSearchQuery: '',
  vocabViewMode: 'list', // 'list' or 'flashcard'
  masteredViewMode: 'list',
  flashcardIndex: 0,
  flashcardFlipped: false,
  allRevealed: false,
  isAdmin: false,
  speechRate: 1.0,
  quizSource: 'all', // 'all', 'mastered', 'vocab', 'phrases'
  quizMode: 'mixed', // 'mixed', 'type_tr', 'type_en', 'audio_listen', 'choice'

  async init() {
    this._loadFavorites();
    this._loadMastered();
    await this._checkAdminStatus();
    await this.loadData();
    this._attachEvents();
    this.render();

    window.addEventListener('auth:changed', async () => {
      await this._checkAdminStatus();
      this.render();
    });
  },

  async _checkAdminStatus() {
    if (window.Auth && typeof window.Auth.canManageContent === 'function') {
      this.isAdmin = await window.Auth.canManageContent();
    } else {
      this.isAdmin = localStorage.getItem('site-admin-access') === '1';
    }
  },

  _loadFavorites() {
    try {
      const p = JSON.parse(localStorage.getItem(FAV_PHRASES_KEY) || '[]');
      this.favoritePhrases = new Set(p);
      const v = JSON.parse(localStorage.getItem(FAV_VOCAB_KEY) || '[]');
      this.favoriteVocab = new Set(v);
    } catch (e) {
      this.favoritePhrases = new Set();
      this.favoriteVocab = new Set();
    }
  },

  _saveFavorites() {
    localStorage.setItem(FAV_PHRASES_KEY, JSON.stringify(Array.from(this.favoritePhrases)));
    localStorage.setItem(FAV_VOCAB_KEY, JSON.stringify(Array.from(this.favoriteVocab)));
  },

  _loadMastered() {
    try {
      const m = JSON.parse(localStorage.getItem(MASTERED_VOCAB_KEY) || '[]');
      this.masteredVocab = new Set(m);
    } catch (e) {
      this.masteredVocab = new Set();
    }
  },

  async _saveMastered() {
    localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(Array.from(this.masteredVocab)));
    try {
      if (window.supabaseClient) {
        const { error } = await window.supabaseClient
          .from('site_settings')
          .upsert({ 
            key: 'oyp_english_mastered_vocab', 
            value: JSON.stringify(Array.from(this.masteredVocab)),
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });
        if (error) console.warn("Mastered vocab cloud save error:", error);
      }
    } catch (e) {
      console.warn("Mastered vocab save warning:", e);
    }
  },

  async toggleMasteredVocab(vocabId) {
    if (this.masteredVocab.has(vocabId)) {
      this.masteredVocab.delete(vocabId);
      this.toast("Kelime ezberlenenlerden çıkarıldı.", "info");
    } else {
      this.masteredVocab.add(vocabId);
      this.toast("🎓 Harika! Kelime ezberlenenlere eklendi.", "success");
    }
    await this._saveMastered();
    this.renderStats();
    this.render();
  },

  // ===== DATA SYNC =====
  async loadData() {
    // 1. Try local storage
    const localPlaces = localStorage.getItem(ENGLISH_STORAGE_KEY);
    const localVocab = localStorage.getItem(VOCAB_STORAGE_KEY);

    if (localPlaces) {
      try { this.places = JSON.parse(localPlaces); } catch (e) { this.places = DEFAULT_PLACES; }
    } else {
      this.places = DEFAULT_PLACES;
    }

    if (localVocab) {
      try { this.vocab = JSON.parse(localVocab); } catch (e) { this.vocab = DEFAULT_VOCAB; }
    } else {
      this.vocab = DEFAULT_VOCAB;
    }

    // 2. Try Supabase cloud sync if available
    try {
      if (window.supabaseClient) {
        // A) Places
        const { data: placesData } = await window.supabaseClient
          .from('site_settings')
          .select('value')
          .eq('key', 'oyp_english_places')
          .maybeSingle();

        if (placesData && placesData.value) {
          let parsed = placesData.value;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e) {}
          }
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.places = parsed;
            localStorage.setItem(ENGLISH_STORAGE_KEY, JSON.stringify(parsed));
          }
        }

        // B) Vocab
        const { data: vocabData } = await window.supabaseClient
          .from('site_settings')
          .select('value')
          .eq('key', 'oyp_english_vocab')
          .maybeSingle();

        if (vocabData && vocabData.value) {
          let parsedV = vocabData.value;
          if (typeof parsedV === 'string') {
            try { parsedV = JSON.parse(parsedV); } catch (e) {}
          }
          if (Array.isArray(parsedV) && parsedV.length > 0) {
            this.vocab = parsedV;
            localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(parsedV));
          }
        }

        // C) Mastered Vocabulary (Ezberlenenler)
        const { data: masteredData } = await window.supabaseClient
          .from('site_settings')
          .select('value')
          .eq('key', 'oyp_english_mastered_vocab')
          .maybeSingle();

        if (masteredData && masteredData.value) {
          let parsedM = masteredData.value;
          if (typeof parsedM === 'string') {
            try { parsedM = JSON.parse(parsedM); } catch (e) {}
          }
          if (Array.isArray(parsedM)) {
            parsedM.forEach(id => this.masteredVocab.add(id));
            localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(Array.from(this.masteredVocab)));
          }
        }
      }
    } catch (err) {
      console.warn("English data sync warning:", err);
    }
  },

  async savePlaces() {
    localStorage.setItem(ENGLISH_STORAGE_KEY, JSON.stringify(this.places));
    try {
      if (window.supabaseClient && this.isAdmin) {
        await window.supabaseClient
          .from('site_settings')
          .upsert({ key: 'oyp_english_places', value: JSON.stringify(this.places) }, { onConflict: 'key' });
      }
    } catch (e) {
      console.warn("Supabase place save warning:", e);
    }
  },

  async saveVocab() {
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(this.vocab));
    try {
      if (window.supabaseClient && this.isAdmin) {
        await window.supabaseClient
          .from('site_settings')
          .upsert({ key: 'oyp_english_vocab', value: JSON.stringify(this.vocab) }, { onConflict: 'key' });
      }
    } catch (e) {
      console.warn("Supabase vocab save warning:", e);
    }
  },

  // ===== TEXT TO SPEECH (TTS) =====
  speak(text, lang = 'en-US') {
    if (!('speechSynthesis' in window)) {
      this.toast('Tarayıcınız sesli okumayı desteklemiyor.', 'warning');
      return;
    }
    window.speechSynthesis.cancel(); // stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = this.speechRate || 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if possible
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && !v.name.includes('Google'));
    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.speak(utterance);
  },

  speakSequential(texts, index = 0) {
    if (index >= texts.length) return;
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(texts[index]);
    utterance.lang = 'en-US';
    utterance.rate = this.speechRate || 1.0;
    utterance.onend = () => {
      setTimeout(() => this.speakSequential(texts, index + 1), 700);
    };
    window.speechSynthesis.speak(utterance);
  },

  // ===== TOAST NOTIFICATIONS =====
  toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `en-toast toast-${type}`;
    el.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '💡'}</span> <span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  },

  _getTabBarHtml() {
    return `
      <div class="en-tab-bar">
        <button class="en-tab-btn ${this.activeTab === 'places' ? 'active' : ''}" onclick="EnglishApp.setTab('places')">🏢 Mekanlar & Konuşmalar</button>
        <button class="en-tab-btn ${this.activeTab === 'vocab' ? 'active' : ''}" onclick="EnglishApp.setTab('vocab')">📚 Kelime Defteri</button>
        <button class="en-tab-btn ${this.activeTab === 'mastered' ? 'active' : ''}" onclick="EnglishApp.setTab('mastered')">🎓 Ezberlediklerim (${this.masteredVocab.size})</button>
        <button class="en-tab-btn ${this.activeTab === 'quiz' ? 'active' : ''}" onclick="EnglishApp.setTab('quiz')">🧠 İnteraktif Quiz</button>
        <button class="en-tab-btn ${this.activeTab === 'favorites' ? 'active' : ''}" onclick="EnglishApp.setTab('favorites')">⭐ Favorilerim</button>
      </div>
    `;
  },

  // ===== RENDER DISPATCHER =====
  render() {
    this.renderStats();
    this.renderAdminControls();

    if (this.activeTab === 'places') {
      this.renderPlaces();
    } else if (this.activeTab === 'detail') {
      this.renderPlaceDetail();
    } else if (this.activeTab === 'vocab') {
      this.renderVocab();
    } else if (this.activeTab === 'mastered') {
      this.renderMastered();
    } else if (this.activeTab === 'quiz') {
      this.renderQuiz();
    } else if (this.activeTab === 'favorites') {
      this.renderFavorites();
    }
  },

  renderStats() {
    const totalPlaces = this.places.length;
    let totalSections = 0;
    let totalPhrases = 0;
    this.places.forEach(p => {
      (p.sections || []).forEach(s => {
        totalSections++;
        totalPhrases += (s.phrases || []).length;
      });
    });

    const pEl = document.getElementById('stat-places');
    const sEl = document.getElementById('stat-sections');
    const phEl = document.getElementById('stat-phrases');
    const vEl = document.getElementById('stat-vocab');
    const mEl = document.getElementById('stat-mastered');

    if (pEl) pEl.textContent = totalPlaces;
    if (sEl) sEl.textContent = totalSections;
    if (phEl) phEl.textContent = totalPhrases;
    if (vEl) vEl.textContent = this.vocab.length;
    if (mEl) mEl.textContent = this.masteredVocab.size;
  },

  renderAdminControls() {
    const adminPlaceBtn = document.getElementById('admin-add-place-btn');
    if (adminPlaceBtn) {
      adminPlaceBtn.style.display = (this.isAdmin && this.activeTab === 'places') ? 'inline-flex' : 'none';
    }
  },

  // ===== VIEW: PLACES GRID =====
  renderPlaces() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    let html = `
      <div class="en-places-header">
        ${this._getTabBarHtml()}
        <div class="en-search-wrap">
          <input type="text" id="place-search-input" class="en-search-input" placeholder="Mekan ara... (örn: Kafe, Taksi, Havalimanı)" oninput="EnglishApp.filterPlaces(this.value)">
          <span class="en-search-icon">🔍</span>
        </div>
      </div>

      <div class="en-places-grid" id="places-grid-container">
    `;

    this.places.forEach(place => {
      let phraseCount = 0;
      (place.sections || []).forEach(s => phraseCount += (s.phrases || []).length);
      const sectionCount = (place.sections || []).length;

      html += `
        <div class="en-place-card" onclick="EnglishApp.openPlace('${place.id}')">
          <div class="en-place-cover-wrap">
            <img src="${place.image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'}" alt="${place.title_tr}" class="en-place-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'">
            <div class="en-place-overlay"></div>
            <div class="en-place-tag">${place.tag || 'Mekan'}</div>
            <div class="en-place-icon-badge">${place.icon || '📍'}</div>
            ${this.isAdmin ? `
              <div class="en-card-admin-actions" onclick="event.stopPropagation()">
                <button class="en-mini-btn edit" title="Mekanı Düzenle" onclick="EnglishApp.editPlaceModal('${place.id}')">✏️</button>
                <button class="en-mini-btn delete" title="Mekanı Sil" onclick="EnglishApp.deletePlace('${place.id}')">🗑️</button>
              </div>
            ` : ''}
          </div>
          <div class="en-place-body">
            <div class="en-place-title-row">
              <h3 class="en-place-title">${place.title_tr}</h3>
            </div>
            <div class="en-place-sub">${place.title_en}</div>
            <p class="en-place-desc">${place.description_tr || place.description_en || ''}</p>
            <div class="en-place-footer">
              <span class="en-badge sections">📑 ${sectionCount} Bölüm</span>
              <span class="en-badge phrases">💬 ${phraseCount} Cümle</span>
              <span class="en-card-arrow">İncele →</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  filterPlaces(query) {
    const q = (query || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.en-place-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'flex' : 'none';
    });
  },

  // ===== VIEW: PLACE DETAIL & DIALOGUES =====
  openPlace(placeId) {
    this.activePlaceId = placeId;
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    this.activeSectionId = (place.sections && place.sections.length > 0) ? place.sections[0].id : null;
    this.activeTab = 'detail';
    this.allRevealed = false;
    this.render();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  },

  setSection(secId) {
    this.activeSectionId = secId;
    this.allRevealed = false;
    this.renderPlaceDetail();
  },

  toggleAllPhrases() {
    this.allRevealed = !this.allRevealed;
    const place = this.places.find(p => p.id === this.activePlaceId);
    if (!place) return;
    const section = (place.sections || []).find(s => s.id === this.activeSectionId);
    if (!section) return;

    (section.phrases || []).forEach(p => {
      const enEl = document.getElementById(`phrase-en-${p.id}`);
      const btnEl = document.getElementById(`btn-toggle-${p.id}`);
      if (enEl && btnEl) {
        if (this.allRevealed) {
          enEl.classList.add('revealed');
          btnEl.classList.add('active');
          btnEl.innerHTML = `<span>🙈</span> <span>İngilizceyi Gizle</span>`;
        } else {
          enEl.classList.remove('revealed');
          btnEl.classList.remove('active');
          btnEl.innerHTML = `<span>👁️</span> <span>İngilizceyi Göster</span>`;
        }
      }
    });

    const masterBtn = document.getElementById('master-toggle-btn');
    if (masterBtn) {
      if (this.allRevealed) {
        masterBtn.classList.add('active');
        masterBtn.innerHTML = `<span>🙈</span> <span>Tüm İngilizce Cümleleri Gizle</span>`;
      } else {
        masterBtn.classList.remove('active');
        masterBtn.innerHTML = `<span>👁️</span> <span>Tüm İngilizce Cümleleri Göster</span>`;
      }
    }
  },

  toggleSinglePhrase(phraseId) {
    const enEl = document.getElementById(`phrase-en-${phraseId}`);
    const btnEl = document.getElementById(`btn-toggle-${phraseId}`);
    if (!enEl || !btnEl) return;

    const isShown = enEl.classList.contains('revealed');
    if (isShown) {
      enEl.classList.remove('revealed');
      btnEl.classList.remove('active');
      btnEl.innerHTML = `<span>👁️</span> <span>İngilizceyi Göster</span>`;
    } else {
      enEl.classList.add('revealed');
      btnEl.classList.add('active');
      btnEl.innerHTML = `<span>🙈</span> <span>İngilizceyi Gizle</span>`;
    }
  },

  renderPlaceDetail() {
    const container = document.getElementById('main-view-container');
    const place = this.places.find(p => p.id === this.activePlaceId);
    if (!container || !place) {
      this.activeTab = 'places';
      this.render();
      return;
    }

    const sections = place.sections || [];
    const activeSection = sections.find(s => s.id === this.activeSectionId) || sections[0];
    const phrases = (activeSection && activeSection.phrases) ? activeSection.phrases : [];

    let html = `
      <div class="en-breadcrumb-bar">
        <button class="en-back-btn" onclick="EnglishApp.setTab('places')">← Mekanlara Dön</button>
        <span class="en-breadcrumb-sep">/</span>
        <span class="en-breadcrumb-current">${place.icon || '📍'} ${place.title_tr}</span>
      </div>

      <div class="en-place-hero-banner" style="background: ${place.gradient || 'linear-gradient(135deg, #1e293b, #0f172a)'}">
        <div class="en-hero-content">
          <div class="en-hero-icon">${place.icon || '☕'}</div>
          <div>
            <h2 class="en-hero-title">${place.title_tr} <span class="en-hero-en-title">(${place.title_en})</span></h2>
            <p class="en-hero-desc">${place.description_tr || place.description_en || ''}</p>
          </div>
        </div>
        ${this.isAdmin ? `
          <div class="en-hero-admin-actions">
            <button class="en-btn btn-sm btn-primary" onclick="EnglishApp.addSectionModal('${place.id}')">＋ Yeni Bölüm Ekle</button>
          </div>
        ` : ''}
      </div>

      <!-- Sections Tab Pills -->
      <div class="en-sections-tabs-wrap">
        <div class="en-sections-tabs">
    `;

    sections.forEach((sec, idx) => {
      const isCur = sec.id === this.activeSectionId;
      const badgeClass = sec.level_badge || 'beginner';
      html += `
        <button class="en-sec-tab-btn ${isCur ? 'active' : ''}" onclick="EnglishApp.setSection('${sec.id}')">
          <span class="en-sec-badge ${badgeClass}">${sec.level || `Bölüm ${idx + 1}`}</span>
          <span class="en-sec-name">${sec.title_tr}</span>
          ${this.isAdmin ? `
            <span class="en-sec-admin-icons" onclick="event.stopPropagation()">
              <span title="Bölümü Düzenle" onclick="EnglishApp.editSectionModal('${place.id}', '${sec.id}')">✏️</span>
              <span title="Bölümü Sil" onclick="EnglishApp.deleteSection('${place.id}', '${sec.id}')">🗑️</span>
            </span>
          ` : ''}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    if (!activeSection) {
      html += `
        <div class="en-empty-state">
          <div class="en-empty-icon">📑</div>
          <h3>Bu mekanda henüz bölüm bulunmuyor.</h3>
          ${this.isAdmin ? `<button class="en-btn btn-primary" onclick="EnglishApp.addSectionModal('${place.id}')">＋ İlk Bölümü Ekle</button>` : ''}
        </div>
      `;
      container.innerHTML = html;
      return;
    }

    // Active Section Card
    html += `
      <div class="en-active-section-card">
        <div class="en-sec-header-row">
          <div>
            <div class="en-sec-level-badge ${activeSection?.level_badge || 'beginner'}">${activeSection?.level || 'A1'}</div>
            <h3 class="en-sec-title">${activeSection?.title_tr || ''}</h3>
            <p class="en-sec-desc">${activeSection?.desc_tr || ''}</p>
          </div>
          
          <div class="en-sec-actions">
            <!-- Global Master Toggle Button (Requested by User) -->
            <button id="master-toggle-btn" class="en-btn btn-accent ${this.allRevealed ? 'active' : ''}" onclick="EnglishApp.toggleAllPhrases()">
              <span>${this.allRevealed ? '🙈' : '👁️'}</span>
              <span>${this.allRevealed ? 'Tüm İngilizce Cümleleri Gizle' : `Tüm İngilizce Cümleleri Göster (${phrases.length} Cümle)`}</span>
            </button>

            <button class="en-btn btn-glass" title="Bölümdeki tüm cümleleri sırayla dinle" onclick="EnglishApp.playAllSectionAudio()">
              <span>🔊</span> <span>Sırayla Dinle</span>
            </button>

            ${this.isAdmin ? `
              <button class="en-btn btn-primary" onclick="EnglishApp.addPhraseModal('${place.id}', '${activeSection.id}')">
                <span>＋</span> <span>Yeni Cümle Ekle</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Phrases Container (Messaging App Style) -->
        <div class="en-phrases-list">
    `;

    if (phrases.length === 0) {
      html += `
        <div class="en-empty-state">
          <div class="en-empty-icon">💬</div>
          <h3>Bu bölüme henüz diyalog/cümle eklenmemiş.</h3>
          ${this.isAdmin ? `<button class="en-btn btn-primary" onclick="EnglishApp.addPhraseModal('${place.id}', '${activeSection.id}')">＋ İlk Cümleyi Ekle</button>` : ''}
        </div>
      `;
    } else {
      phrases.forEach((phrase) => {
        const isFav = this.favoritePhrases.has(phrase.id);
        const roleClass = phrase.role === 'staff' ? 'staff-role' : 'customer-role';

        html += `
          <div class="en-phrase-card ${roleClass}" id="phrase-card-${phrase.id}">
            <div class="en-phrase-header">
              <div class="en-speaker-badge">
                <span class="en-speaker-icon">${phrase.role === 'staff' ? '🏢' : '👤'}</span>
                <span class="en-speaker-name">${phrase.speaker || (phrase.role === 'staff' ? 'Görevli' : 'Müşteri')}</span>
              </div>
              <div class="en-phrase-actions">
                <button class="en-icon-action-btn ${isFav ? 'starred' : ''}" title="Favorilere Ekle/Çıkar" onclick="EnglishApp.toggleFavoritePhrase('${phrase.id}')">
                  ${isFav ? '⭐' : '☆'}
                </button>
                <button class="en-icon-action-btn" title="Cümleyi Kopyala" onclick="EnglishApp.copyPhrase('${phrase.tr}', '${phrase.en}')">
                  📋
                </button>
                ${this.isAdmin ? `
                  <button class="en-icon-action-btn" title="Düzenle" onclick="EnglishApp.editPhraseModal('${place.id}', '${activeSection.id}', '${phrase.id}')">
                    ✏️
                  </button>
                  <button class="en-icon-action-btn danger" title="Sil" onclick="EnglishApp.deletePhrase('${place.id}', '${activeSection.id}', '${phrase.id}')">
                    🗑️
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Turkish Sentence (Always Visible First) -->
            <div class="en-phrase-tr-row">
              <span class="en-lang-flag">🇹🇷</span>
              <div class="en-sentence-tr">${phrase.tr}</div>
            </div>

            <!-- Individual Sentence Toggle Button -->
            <div class="en-phrase-toggle-row">
              <button id="btn-toggle-${phrase.id}" class="en-toggle-en-btn ${this.allRevealed ? 'active' : ''}" onclick="EnglishApp.toggleSinglePhrase('${phrase.id}')">
                <span>${this.allRevealed ? '🙈' : '👁️'}</span>
                <span>${this.allRevealed ? 'İngilizceyi Gizle' : 'İngilizceyi Göster'}</span>
              </button>

              <button class="en-audio-btn" title="İngilizce Telaffuzu Dinle" onclick="EnglishApp.speak('${phrase.en.replace(/'/g, "\\'")}')">
                <span>🔊</span> <span>Telaffuz</span>
              </button>
            </div>

            <!-- English Sentence Box -->
            <div id="phrase-en-${phrase.id}" class="en-phrase-en-box ${this.allRevealed ? 'revealed' : ''}">
              <div class="en-phrase-en-content">
                <span class="en-lang-flag">🇬🇧</span>
                <div class="en-sentence-en">${phrase.en}</div>
              </div>
              ${phrase.note ? `
                <div class="en-phrase-note">
                  <span class="en-note-icon">💡</span>
                  <span class="en-note-text">${phrase.note}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  playAllSectionAudio() {
    const place = this.places.find(p => p.id === this.activePlaceId);
    if (!place) return;
    const section = (place.sections || []).find(s => s.id === this.activeSectionId);
    if (!section || !section.phrases || section.phrases.length === 0) return;

    const texts = section.phrases.map(p => p.en);
    this.toast(`${texts.length} cümle sırayla seslendiriliyor...`, 'info');
    this.speakSequential(texts, 0);
  },

  // ===== VIEW: VOCABULARY BANK =====
  renderVocab() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    const categories = ['all', 'mastered', 'unlearned', ...new Set(this.vocab.map(v => v.cat).filter(Boolean))];

    const filteredVocab = this.vocab.filter(v => {
      let matchCat = true;
      if (this.vocabFilter === 'mastered') {
        matchCat = this.masteredVocab.has(v.id);
      } else if (this.vocabFilter === 'unlearned') {
        matchCat = !this.masteredVocab.has(v.id);
      } else if (this.vocabFilter !== 'all') {
        matchCat = v.cat === this.vocabFilter;
      }

      const matchLvl = this.vocabLevelFilter === 'all' || v.level === this.vocabLevelFilter;
      const q = (this.vocabSearchQuery || '').toLowerCase().trim();
      const matchQuery = !q || v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q) || (v.ex_en && v.ex_en.toLowerCase().includes(q));
      return matchCat && matchLvl && matchQuery;
    });

    let html = `
      <div class="en-places-header">
        ${this._getTabBarHtml()}
      </div>

      <div class="en-vocab-header-card">
        <div class="en-vocab-top-row">
          <div>
            <h2 class="en-vocab-title">📚 İngilizce Kelime Defteri & Pratik</h2>
            <p class="en-vocab-desc">Mekanlara göre kategorize edilmiş kelimeler, okunuşları (IPA), örnek cümleleri ve sesli telaffuzları.</p>
          </div>
          <div class="en-vocab-view-switcher">
            <button class="en-view-mode-btn ${this.vocabViewMode === 'list' ? 'active' : ''}" onclick="EnglishApp.setVocabViewMode('list')">📋 Liste Görünümü</button>
            <button class="en-view-mode-btn ${this.vocabViewMode === 'flashcard' ? 'active' : ''}" onclick="EnglishApp.setVocabViewMode('flashcard')">🃏 Flashcard (Kart Çevirme)</button>
            ${this.isAdmin ? `
              <button class="en-btn btn-primary" onclick="EnglishApp.addVocabModal()">＋ Yeni Kelime Ekle</button>
            ` : ''}
          </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="en-vocab-controls-row">
          <div class="en-vocab-search-wrap">
            <input type="text" id="vocab-search-input" class="en-search-input" value="${this.vocabSearchQuery}" placeholder="Kelime veya Türkçe anlam ara..." oninput="EnglishApp.onVocabSearch(this.value)">
            <span class="en-search-icon">🔍</span>
          </div>

          <!-- Category Pills -->
          <div class="en-filter-pills-row">
            ${categories.map(cat => {
              let label = cat;
              if (cat === 'all') label = 'Tüm Kategoriler';
              else if (cat === 'mastered') label = `🎓 Ezberlediklerim (${this.masteredVocab.size})`;
              else if (cat === 'unlearned') label = `⏳ Öğrenilecekler (${this.vocab.length - this.masteredVocab.size})`;
              return `
                <button class="en-filter-pill ${this.vocabFilter === cat ? 'active' : ''}" onclick="EnglishApp.setVocabFilter('${cat}')">
                  ${label}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    if (this.vocabViewMode === 'flashcard') {
      // FLASHCARD MODE
      if (filteredVocab.length === 0) {
        html += `<div class="en-empty-state"><div class="en-empty-icon">🔍</div><h3>Filtrenize uygun kelime bulunamadı.</h3></div>`;
      } else {
        const curIdx = Math.min(this.flashcardIndex, filteredVocab.length - 1);
        const card = filteredVocab[curIdx];
        const isMastered = this.masteredVocab.has(card.id);

        html += `
          <div class="en-flashcard-wrapper">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; max-width:480px; margin-bottom:12px;">
              <div class="en-flashcard-counter">Kart ${curIdx + 1} / ${filteredVocab.length}</div>
              <button class="en-mastered-btn ${isMastered ? 'mastered' : ''}" onclick="event.stopPropagation(); EnglishApp.toggleMasteredVocab('${card.id}')">
                🎓 ${isMastered ? 'Ezberlendi ✅' : 'Ezberledim'}
              </button>
            </div>
            
            <div class="en-flashcard-3d ${this.flashcardFlipped ? 'flipped' : ''}" onclick="EnglishApp.flipFlashcard()">
              <!-- Front Side -->
              <div class="en-flashcard-side front">
                <div class="en-fc-tag">${card.cat || 'Genel'} · <span class="en-fc-lvl">${card.level || 'A1'}</span></div>
                <div class="en-fc-word">${card.word}</div>
                ${card.pron ? `<div class="en-fc-pron">${card.pron}</div>` : ''}
                <button class="en-fc-audio-btn" onclick="event.stopPropagation(); EnglishApp.speak('${card.word.replace(/'/g, "\\'")}')">
                  🔊 Telaffuzu Dinle
                </button>
                <div class="en-fc-hint">💡 Çevirmek için karta tıklayın</div>
              </div>

              <!-- Back Side -->
              <div class="en-flashcard-side back">
                <div class="en-fc-tag">Türkçe Anlamı</div>
                <div class="en-fc-meaning">${card.meaning}</div>
                ${card.ex_en ? `
                  <div class="en-fc-example-box">
                    <div class="en-fc-ex-en">🇬🇧 ${card.ex_en}</div>
                    <div class="en-fc-ex-tr">🇹🇷 ${card.ex_tr || ''}</div>
                  </div>
                ` : ''}
                <div class="en-fc-hint">🔄 Kartı geri çevirmek için tıklayın</div>
              </div>
            </div>

            <!-- Flashcard Nav Controls -->
            <div class="en-flashcard-controls">
              <button class="en-btn btn-glass" onclick="EnglishApp.prevFlashcard(${filteredVocab.length})">← Önceki</button>
              <button class="en-btn btn-accent" onclick="EnglishApp.flipFlashcard()">🔄 Kartı Çevir</button>
              <button class="en-btn btn-glass" onclick="EnglishApp.nextFlashcard(${filteredVocab.length})">Sonraki →</button>
            </div>
          </div>
        `;
      }
    } else {
      // LIST MODE
      html += `
        <div class="en-vocab-grid">
      `;

      if (filteredVocab.length === 0) {
        html += `<div class="en-empty-state" style="grid-column: 1/-1;"><div class="en-empty-icon">🔍</div><h3>Filtrenize uygun kelime bulunamadı.</h3></div>`;
      } else {
        filteredVocab.forEach(item => {
          const isFav = this.favoriteVocab.has(item.id);
          const isMastered = this.masteredVocab.has(item.id);

          html += `
            <div class="en-vocab-card ${isMastered ? 'is-mastered' : ''}">
              <div class="en-vocab-card-header">
                <div class="en-vocab-word-row">
                  <h4 class="en-vocab-word">${item.word}</h4>
                  ${item.pron ? `<span class="en-vocab-pron">${item.pron}</span>` : ''}
                </div>
                <div class="en-vocab-header-actions">
                  <button class="en-mastered-btn ${isMastered ? 'mastered' : ''}" title="Ezberledim / Öğrendim" onclick="EnglishApp.toggleMasteredVocab('${item.id}')">
                    🎓 ${isMastered ? 'Ezberlendi ✅' : 'Ezberledim'}
                  </button>
                  <button class="en-icon-action-btn ${isFav ? 'starred' : ''}" title="Favorile" onclick="EnglishApp.toggleFavoriteVocab('${item.id}')">
                    ${isFav ? '⭐' : '☆'}
                  </button>
                  <button class="en-icon-action-btn" title="Telaffuz" onclick="EnglishApp.speak('${item.word.replace(/'/g, "\\'")}')">
                    🔊
                  </button>
                  ${this.isAdmin ? `
                    <button class="en-icon-action-btn" title="Düzenle" onclick="EnglishApp.editVocabModal('${item.id}')">✏️</button>
                    <button class="en-icon-action-btn danger" title="Sil" onclick="EnglishApp.deleteVocab('${item.id}')">🗑️</button>
                  ` : ''}
                </div>
              </div>

              <div class="en-vocab-meaning-row">
                <span class="en-vocab-meaning-label">Anlamı:</span>
                <span class="en-vocab-meaning">${item.meaning}</span>
              </div>

              ${item.ex_en ? `
                <div class="en-vocab-ex-box">
                  <div class="en-vex-en">🇬🇧 ${item.ex_en}</div>
                  <div class="en-vex-tr">🇹🇷 ${item.ex_tr || ''}</div>
                </div>
              ` : ''}

              <div class="en-vocab-footer">
                <span class="en-vpill cat">${item.cat || 'Genel'}</span>
                <span class="en-vpill lvl">${item.level || 'A1'}</span>
                ${isMastered ? `<span class="en-vpill" style="background:rgba(16,185,129,0.2); color:#34d399; font-weight:700; margin-left:auto;">✓ Öğrenildi</span>` : ''}
              </div>
            </div>
          `;
        });
      }

      html += `</div>`;
    }

    container.innerHTML = html;
  },

  // ===== VIEW: MASTERED VOCABULARY (DEDICATED VIEW) =====
  renderMastered() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    const masteredList = this.vocab.filter(v => this.masteredVocab.has(v.id));
    const percent = this.vocab.length > 0 ? Math.round((masteredList.length / this.vocab.length) * 100) : 0;

    let html = `
      <div class="en-places-header">
        ${this._getTabBarHtml()}
      </div>

      <div class="en-vocab-header-card" style="border-color: rgba(16, 185, 129, 0.3); background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), var(--bg-card));">
        <div class="en-vocab-top-row">
          <div>
            <h2 class="en-vocab-title">🎓 Ezberlediğim Kelimeler Havuzu</h2>
            <p class="en-vocab-desc">Öğrenip hafızanıza kaydettiğiniz tüm kelimeler. İlerlemenizi takip edin ve bu kelimelerle özel yazma/dinleme testleri yapın.</p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="en-btn btn-primary" onclick="EnglishApp.startMasteredQuiz()">🧠 Bu Kelimelerle Test Yap</button>
            <button class="en-btn btn-glass" onclick="EnglishApp.setTab('vocab')">📚 Yeni Kelimeler Ekle</button>
          </div>
        </div>

        <!-- Progress Overview -->
        <div style="margin-top: 20px; background: rgba(0,0,0,0.2); border-radius: var(--radius-lg); padding: 16px 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:13px; font-weight:700; color:var(--text-primary);">Kelime Havuzu Hakimiyeti</span>
            <span style="font-size:14px; font-weight:800; color:#34d399;">%${percent} (${masteredList.length} / ${this.vocab.length} Kelime)</span>
          </div>
          <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 5px; transition: width 0.4s ease;"></div>
          </div>
        </div>
      </div>
    `;

    if (masteredList.length === 0) {
      html += `
        <div class="en-empty-state">
          <div class="en-empty-icon">🎓</div>
          <h3>Henüz ezberlenen kelimeniz bulunmuyor.</h3>
          <p style="color:var(--text-muted); max-width:450px; margin:0 auto 18px;">
            Kelime Defteri'ne giderek öğrendiğiniz kelimeleri "🎓 Ezberledim" butonuyla buraya ekleyebilirsiniz.
          </p>
          <button class="en-btn btn-primary" onclick="EnglishApp.setTab('vocab')">📚 Kelime Defterine Git</button>
        </div>
      `;
    } else {
      html += `
        <div class="en-vocab-grid">
      `;
      masteredList.forEach(item => {
        html += `
          <div class="en-vocab-card is-mastered">
            <div class="en-vocab-card-header">
              <div class="en-vocab-word-row">
                <h4 class="en-vocab-word">${item.word}</h4>
                ${item.pron ? `<span class="en-vocab-pron">${item.pron}</span>` : ''}
              </div>
              <div class="en-vocab-header-actions">
                <button class="en-mastered-btn mastered" title="Ezberlenenlerden Çıkar" onclick="EnglishApp.toggleMasteredVocab('${item.id}')">
                  🎓 Ezberlendi ✓
                </button>
                <button class="en-icon-action-btn" title="Telaffuz" onclick="EnglishApp.speak('${item.word.replace(/'/g, "\\'")}')">
                  🔊
                </button>
              </div>
            </div>
            <div class="en-vocab-meaning-row">
              <span class="en-vocab-meaning-label">Anlamı:</span>
              <span class="en-vocab-meaning">${item.meaning}</span>
            </div>
            ${item.ex_en ? `
              <div class="en-vocab-ex-box">
                <div class="en-vex-en">🇬🇧 ${item.ex_en}</div>
                <div class="en-vex-tr">🇹🇷 ${item.ex_tr || ''}</div>
              </div>
            ` : ''}
            <div class="en-vocab-footer">
              <span class="en-vpill cat">${item.cat || 'Genel'}</span>
              <span class="en-vpill lvl">${item.level || 'A1'}</span>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  },

  startMasteredQuiz() {
    this.quizSource = 'mastered';
    this.quizMode = 'mixed';
    this.activeTab = 'quiz';
    this.generateQuiz();
  },

  onVocabSearch(val) {
    this.vocabSearchQuery = val;
    this.renderVocab();
  },

  setVocabFilter(cat) {
    this.vocabFilter = cat;
    this.flashcardIndex = 0;
    this.renderVocab();
  },

  setVocabViewMode(mode) {
    this.vocabViewMode = mode;
    this.flashcardFlipped = false;
    this.renderVocab();
  },

  flipFlashcard() {
    this.flashcardFlipped = !this.flashcardFlipped;
    const el = document.querySelector('.en-flashcard-3d');
    if (el) el.classList.toggle('flipped', this.flashcardFlipped);
  },

  nextFlashcard(maxLen) {
    this.flashcardIndex = (this.flashcardIndex + 1) % maxLen;
    this.flashcardFlipped = false;
    this.renderVocab();
  },

  prevFlashcard(maxLen) {
    this.flashcardIndex = (this.flashcardIndex - 1 + maxLen) % maxLen;
    this.flashcardFlipped = false;
    this.renderVocab();
  },

  toggleFavoriteVocab(id) {
    if (this.favoriteVocab.has(id)) {
      this.favoriteVocab.delete(id);
      this.toast('Kelime favorilerden çıkarıldı.', 'info');
    } else {
      this.favoriteVocab.add(id);
      this.toast('Kelime favorilere eklendi! ⭐', 'success');
    }
    this._saveFavorites();
    this.render();
  },

  // ===== VIEW: MIXED INTERACTIVE QUIZ MODE =====
  renderQuiz() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    if (!this.quizQuestions || this.quizQuestions.length === 0) {
      this.generateQuiz();
    }

    const q = this.quizQuestions[this.quizCurrentIndex || 0];

    let html = `
      <div class="en-places-header">
        ${this._getTabBarHtml()}
      </div>

      <!-- Quiz Setup & Source Configuration -->
      <div class="en-quiz-config-bar">
        <div class="en-quiz-config-group">
          <span class="en-quiz-config-label">📖 Soru Havuzu:</span>
          <select class="en-quiz-select" id="quiz-source-select" onchange="EnglishApp.onQuizConfigChange()">
            <option value="all" ${this.quizSource === 'all' ? 'selected' : ''}>🎲 Karışık (Tüm Kelimeler & Cümleler)</option>
            <option value="mastered" ${this.quizSource === 'mastered' ? 'selected' : ''}>🎓 Sadece Ezberlediklerim (${this.masteredVocab.size})</option>
            <option value="vocab" ${this.quizSource === 'vocab' ? 'selected' : ''}>📚 Tüm Kelime Defteri (${this.vocab.length})</option>
            <option value="phrases" ${this.quizSource === 'phrases' ? 'selected' : ''}>💬 Mekan Cümleleri & Diyaloglar</option>
          </select>
        </div>

        <div class="en-quiz-config-group">
          <span class="en-quiz-config-label">🎯 Soru Formatı:</span>
          <select class="en-quiz-select" id="quiz-mode-select" onchange="EnglishApp.onQuizConfigChange()">
            <option value="mixed" ${this.quizMode === 'mixed' ? 'selected' : ''}>🎲 Karışık Mod (Yazma + Dinleme + Seçmeli)</option>
            <option value="type_tr" ${this.quizMode === 'type_tr' ? 'selected' : ''}>✍️ Türkçe Anlamını Yaz (Type Meaning)</option>
            <option value="type_en" ${this.quizMode === 'type_en' ? 'selected' : ''}>✍️ İngilizce Karşılığını Yaz (Type English)</option>
            <option value="audio_listen" ${this.quizMode === 'audio_listen' ? 'selected' : ''}>🎧 Sesli Dinle & Yaz (Listening Quiz)</option>
            <option value="choice" ${this.quizMode === 'choice' ? 'selected' : ''}>🔘 Çoktan Seçmeli Test</option>
          </select>
        </div>

        <button class="en-btn btn-sm btn-accent" onclick="EnglishApp.generateQuiz()">🔄 Yeniden Başlat</button>
      </div>

      <div class="en-quiz-card">
    `;

    if (this.quizFinished) {
      const percentage = Math.round((this.quizScore / this.quizQuestions.length) * 100);
      html += `
        <div class="en-quiz-results">
          <div class="en-quiz-trophy">${percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}</div>
          <h2 class="en-quiz-res-title">Pratik Testi Tamamlandı!</h2>
          <div class="en-quiz-res-score">Doğru Sayısı: ${this.quizScore} / ${this.quizQuestions.length} (%${percentage})</div>
          <p class="en-quiz-res-desc">
            ${percentage === 100 ? 'Harika bir performans! Tüm soruları başarıyla bildiniz.' : percentage >= 60 ? 'Tebrikler, güzel bir pratik oldu!' : 'Biraz daha pratik yaparak kelimelerinizi pekiştirebilirsiniz.'}
          </p>
          <div style="display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap;">
            <button class="en-btn btn-primary" onclick="EnglishApp.generateQuiz()">🔄 Tekrar Test Çöz</button>
            <button class="en-btn btn-accent" onclick="EnglishApp.setTab('mastered')">🎓 Ezberlediklerim Alanı</button>
            <button class="en-btn btn-glass" onclick="EnglishApp.setTab('vocab')">📚 Kelime Defterine Dön</button>
          </div>
        </div>
      `;
    } else if (q) {
      html += `
        <div class="en-quiz-header">
          <span class="en-quiz-badge">Soru ${(this.quizCurrentIndex || 0) + 1} / ${this.quizQuestions.length} · ${q.typeLabel}</span>
          <span class="en-quiz-score-live">Puan: ${this.quizScore || 0} / ${(this.quizCurrentIndex || 0)}</span>
        </div>
      `;

      if (q.type === 'type_tr') {
        // TYPE TR MEANING
        html += `
          <div class="en-quiz-prompt">
            <div class="en-quiz-label">Aşağıdaki İngilizce kelimenin Türkçe anlamını yazınız:</div>
            <div class="en-quiz-question-text" style="color:var(--accent-light);">🇬🇧 "${q.prompt}"</div>
            <button class="en-fc-audio-btn" style="margin-top:8px;" onclick="EnglishApp.speak('${q.prompt.replace(/'/g, "\\'")}')">🔊 Telaffuzu Dinle</button>
          </div>

          <div class="en-quiz-type-box">
            <div class="en-quiz-type-input-wrap">
              <input type="text" id="quiz-typed-input" class="en-quiz-type-input" placeholder="Türkçe anlamını buraya yazın..." autocomplete="off" onkeydown="if(event.key==='Enter') EnglishApp.submitTypedAnswer()">
              <button class="en-btn btn-primary" onclick="EnglishApp.submitTypedAnswer()">Cevapla</button>
            </div>
          </div>
        `;
      } else if (q.type === 'type_en') {
        // TYPE ENGLISH
        html += `
          <div class="en-quiz-prompt">
            <div class="en-quiz-label">Aşağıdaki Türkçe ifadenin İngilizce karşılığını yazınız:</div>
            <div class="en-quiz-question-text">🇹🇷 "${q.prompt}"</div>
          </div>

          <div class="en-quiz-type-box">
            <div class="en-quiz-type-input-wrap">
              <input type="text" id="quiz-typed-input" class="en-quiz-type-input" placeholder="İngilizce karşılığını yazın..." autocomplete="off" onkeydown="if(event.key==='Enter') EnglishApp.submitTypedAnswer()">
              <button class="en-btn btn-primary" onclick="EnglishApp.submitTypedAnswer()">Cevapla</button>
            </div>
          </div>
        `;
      } else if (q.type === 'audio_listen') {
        // AUDIO LISTENING TEST
        html += `
          <div class="en-quiz-prompt" style="text-align:center;">
            <div class="en-quiz-label">Kulaklığınızı takın veya hoparlörünüzü açın. Duyduğunuz ifadenin İngilizce yazılışını veya Türkçe anlamını yazın:</div>
            <div>
              <button class="en-audio-prompt-btn" onclick="EnglishApp.speak('${q.audioText.replace(/'/g, "\\'")}')">
                <span style="font-size:22px;">🔊</span> <span>Sesi Tekrar Dinle</span>
              </button>
            </div>
          </div>

          <div class="en-quiz-type-box">
            <div class="en-quiz-type-input-wrap">
              <input type="text" id="quiz-typed-input" class="en-quiz-type-input" placeholder="Duyduğunuz kelimeyi veya Türkçe anlamını yazın..." autocomplete="off" onkeydown="if(event.key==='Enter') EnglishApp.submitTypedAnswer()">
              <button class="en-btn btn-primary" onclick="EnglishApp.submitTypedAnswer()">Cevapla</button>
            </div>
          </div>
        `;
      } else {
        // MULTIPLE CHOICE
        html += `
          <div class="en-quiz-prompt">
            <div class="en-quiz-label">Aşağıdaki Türkçe cümlenin / kelimenin doğru İngilizce karşılığı hangisidir?</div>
            <div class="en-quiz-question-text">🇹🇷 "${q.question}"</div>
          </div>

          <div class="en-quiz-options">
            ${q.options.map((opt, oIdx) => `
              <button class="en-quiz-opt-btn" id="quiz-opt-${oIdx}" onclick="EnglishApp.answerQuiz(${oIdx})">
                <span class="en-opt-letter">${String.fromCharCode(65 + oIdx)}</span>
                <span class="en-opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
        `;
      }

      html += `
        <div id="quiz-feedback-box" class="en-quiz-feedback" style="display:none;"></div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Auto-focus typing input if present and play audio if listening test
    setTimeout(() => {
      const input = document.getElementById('quiz-typed-input');
      if (input) input.focus();

      if (q && q.type === 'audio_listen' && !this.quizAnswered) {
        this.speak(q.audioText);
      }
    }, 100);
  },

  onQuizConfigChange() {
    const srcEl = document.getElementById('quiz-source-select');
    const modeEl = document.getElementById('quiz-mode-select');
    if (srcEl) this.quizSource = srcEl.value;
    if (modeEl) this.quizMode = modeEl.value;
    this.generateQuiz();
  },

  _normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/['’".,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/[\s]+/g, ' ')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  },

  _isAnswerMatching(userText, targetText) {
    const u = this._normalizeText(userText);
    if (!u) return false;
    
    const targets = targetText.split(/[,/;|]/).map(t => this._normalizeText(t)).filter(Boolean);
    targets.push(this._normalizeText(targetText));

    for (const t of targets) {
      if (u === t) return true;
      if (t.includes(u) && u.length >= 3) return true;
      if (u.includes(t) && t.length >= 3) return true;
    }
    return false;
  },

  generateQuiz() {
    this.quizScore = 0;
    this.quizCurrentIndex = 0;
    this.quizFinished = false;
    this.quizAnswered = false;

    let itemsPool = [];

    // Filter by Source
    if (this.quizSource === 'mastered') {
      itemsPool = this.vocab.filter(v => this.masteredVocab.has(v.id)).map(v => ({
        id: v.id,
        word: v.word,
        meaning: v.meaning,
        isVocab: true
      }));
      if (itemsPool.length === 0) {
        this.toast('Ezberlenmiş kelimeniz bulunmadığından tüm kelime havuzu yüklendi.', 'warning');
        itemsPool = this.vocab.map(v => ({ id: v.id, word: v.word, meaning: v.meaning, isVocab: true }));
      }
    } else if (this.quizSource === 'vocab') {
      itemsPool = this.vocab.map(v => ({ id: v.id, word: v.word, meaning: v.meaning, isVocab: true }));
    } else if (this.quizSource === 'phrases') {
      this.places.forEach(p => {
        (p.sections || []).forEach(s => {
          (s.phrases || []).forEach(ph => {
            itemsPool.push({ id: ph.id, word: ph.en, meaning: ph.tr, isVocab: false });
          });
        });
      });
    } else {
      // All
      this.vocab.forEach(v => itemsPool.push({ id: v.id, word: v.word, meaning: v.meaning, isVocab: true }));
      this.places.forEach(p => {
        (p.sections || []).forEach(s => {
          (s.phrases || []).forEach(ph => {
            itemsPool.push({ id: ph.id, word: ph.en, meaning: ph.tr, isVocab: false });
          });
        });
      });
    }

    // Shuffle pool
    itemsPool.sort(() => 0.5 - Math.random());
    const selected = itemsPool.slice(0, 5);

    const questionTypes = ['type_tr', 'type_en', 'audio_listen', 'choice'];

    this.quizQuestions = selected.map((item, idx) => {
      let qType = this.quizMode;
      if (qType === 'mixed') {
        qType = questionTypes[idx % questionTypes.length];
      }

      let typeLabel = 'Çoktan Seçmeli';
      if (qType === 'type_tr') typeLabel = '✍️ Türkçe Anlamını Yaz';
      else if (qType === 'type_en') typeLabel = '✍️ İngilizce Yaz';
      else if (qType === 'audio_listen') typeLabel = '🎧 Sesli Dinleme Testi';

      // For multiple choice distractors
      const wrong = itemsPool.filter(w => w.word !== item.word).sort(() => 0.5 - Math.random()).slice(0, 3).map(x => x.word);
      while (wrong.length < 3) {
        wrong.push("Alternative choice " + (wrong.length + 1));
      }
      const options = [item.word, ...wrong].sort(() => 0.5 - Math.random());

      return {
        id: item.id,
        isVocab: item.isVocab,
        type: qType,
        typeLabel: typeLabel,
        prompt: qType === 'type_tr' ? item.word : item.meaning,
        question: item.meaning,
        answer: item.word,
        meaning: item.meaning,
        audioText: item.word,
        options: options
      };
    });

    this.render();
  },

  submitTypedAnswer() {
    const q = this.quizQuestions[this.quizCurrentIndex];
    if (!q || this.quizAnswered) return;

    const input = document.getElementById('quiz-typed-input');
    if (!input) return;
    const userVal = input.value.trim();
    if (!userVal) {
      this.toast('Lütfen bir cevap yazın.', 'warning');
      return;
    }

    this.quizAnswered = true;
    let isCorrect = false;

    if (q.type === 'type_tr') {
      isCorrect = this._isAnswerMatching(userVal, q.meaning);
    } else if (q.type === 'type_en') {
      isCorrect = this._isAnswerMatching(userVal, q.answer);
    } else if (q.type === 'audio_listen') {
      isCorrect = this._isAnswerMatching(userVal, q.answer) || this._isAnswerMatching(userVal, q.meaning);
    }

    if (isCorrect) this.quizScore++;

    input.disabled = true;
    input.classList.add(isCorrect ? 'correct' : 'wrong');

    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) {
      feedbackBox.style.display = 'flex';
      feedbackBox.className = `en-quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
      feedbackBox.innerHTML = `
        <div style="flex:1;">
          <div>${isCorrect ? '🎉 Harika! Doğru cevap.' : `❌ Yanlış. Doğru cevap: <b>${q.type === 'type_tr' ? q.meaning : q.answer}</b>`}</div>
          ${q.isVocab && !this.masteredVocab.has(q.id) ? `
            <button class="en-mastered-btn" style="margin-top:6px;" onclick="EnglishApp.toggleMasteredVocab('${q.id}')">🎓 Ezberlediklerime Ekle</button>
          ` : ''}
        </div>
        <button class="en-btn btn-sm btn-primary" style="margin-left:auto;" onclick="EnglishApp.nextQuizQuestion()">
          ${this.quizCurrentIndex + 1 >= this.quizQuestions.length ? 'Sonuçları Gör' : 'Sonraki Soru →'}
        </button>
      `;
    }
  },

  answerQuiz(selectedOptIdx) {
    const q = this.quizQuestions[this.quizCurrentIndex];
    if (!q || this.quizAnswered) return;
    this.quizAnswered = true;

    const selectedText = q.options[selectedOptIdx];
    const isCorrect = selectedText === q.answer;

    if (isCorrect) this.quizScore++;

    const buttons = document.querySelectorAll('.en-quiz-opt-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (q.options[idx] === q.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedOptIdx) {
        btn.classList.add('wrong');
      }
    });

    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) {
      feedbackBox.style.display = 'flex';
      feedbackBox.className = `en-quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
      feedbackBox.innerHTML = `
        <div style="flex:1;">
          <div>${isCorrect ? '🎉 Tebrikler! Doğru cevap.' : `❌ Yanlış. Doğru cevap: <b>${q.answer}</b>`}</div>
          ${q.isVocab && !this.masteredVocab.has(q.id) ? `
            <button class="en-mastered-btn" style="margin-top:6px;" onclick="EnglishApp.toggleMasteredVocab('${q.id}')">🎓 Ezberlediklerime Ekle</button>
          ` : ''}
        </div>
        <button class="en-btn btn-sm btn-primary" style="margin-left:auto;" onclick="EnglishApp.nextQuizQuestion()">
          ${this.quizCurrentIndex + 1 >= this.quizQuestions.length ? 'Sonuçları Gör' : 'Sonraki Soru →'}
        </button>
      `;
    }
  },

  nextQuizQuestion() {
    this.quizAnswered = false;
    this.quizCurrentIndex++;
    if (this.quizCurrentIndex >= this.quizQuestions.length) {
      this.quizFinished = true;
    }
    this.renderQuiz();
  },

  // ===== VIEW: FAVORITES =====
  renderFavorites() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    const favPhrasesList = [];
    this.places.forEach(p => {
      (p.sections || []).forEach(s => {
        (s.phrases || []).forEach(ph => {
          if (this.favoritePhrases.has(ph.id)) {
            favPhrasesList.push({ ...ph, placeTitle: p.title_tr, sectionTitle: s.title_tr });
          }
        });
      });
    });

    const favVocabList = this.vocab.filter(v => this.favoriteVocab.has(v.id));

    let html = `
      <div class="en-places-header">
        ${this._getTabBarHtml()}
      </div>

      <div class="en-favs-section">
        <h3 class="en-section-title">💬 Yıldızladığınız Cümleler (${favPhrasesList.length})</h3>
    `;

    if (favPhrasesList.length === 0) {
      html += `<div class="en-empty-state"><div class="en-empty-icon">☆</div><p>Henüz yıldızlanmış cümleniz yok.</p></div>`;
    } else {
      favPhrasesList.forEach(phrase => {
        html += `
          <div class="en-phrase-card customer-role" style="margin-bottom:12px;">
            <div class="en-phrase-header">
              <span class="en-speaker-badge">📍 ${phrase.placeTitle} › ${phrase.sectionTitle}</span>
              <button class="en-icon-action-btn starred" onclick="EnglishApp.toggleFavoritePhrase('${phrase.id}')">⭐</button>
            </div>
            <div class="en-phrase-tr-row"><span class="en-lang-flag">🇹🇷</span><div class="en-sentence-tr">${phrase.tr}</div></div>
            <div class="en-phrase-en-box revealed" style="margin-top:8px;">
              <div class="en-phrase-en-content">
                <span class="en-lang-flag">🇬🇧</span>
                <div class="en-sentence-en">${phrase.en}</div>
                <button class="en-audio-btn" style="margin-left:auto;" onclick="EnglishApp.speak('${phrase.en.replace(/'/g, "\\'")}')">🔊 Dinle</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `
        <h3 class="en-section-title" style="margin-top:36px;">📚 Yıldızladığınız Kelimeler (${favVocabList.length})</h3>
    `;

    if (favVocabList.length === 0) {
      html += `<div class="en-empty-state"><div class="en-empty-icon">☆</div><p>Henüz yıldızlanmış kelimeniz yok.</p></div>`;
    } else {
      html += `<div class="en-vocab-grid">`;
      favVocabList.forEach(item => {
        html += `
          <div class="en-vocab-card">
            <div class="en-vocab-card-header">
              <h4 class="en-vocab-word">${item.word}</h4>
              <button class="en-icon-action-btn starred" onclick="EnglishApp.toggleFavoriteVocab('${item.id}')">⭐</button>
            </div>
            <div class="en-vocab-meaning">${item.meaning}</div>
            ${item.ex_en ? `<div class="en-vocab-ex-box"><div class="en-vex-en">🇬🇧 ${item.ex_en}</div></div>` : ''}
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  // ===== ADMIN MODALS & CRUD =====
  openModal(htmlContent) {
    let modal = document.getElementById('en-global-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'en-global-modal';
      modal.className = 'en-modal-backdrop';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="en-modal-dialog">
        ${htmlContent}
      </div>
    `;
    modal.classList.add('open');
  },

  closeModal() {
    const modal = document.getElementById('en-global-modal');
    if (modal) modal.classList.remove('open');
  },

  addPlaceModal() {
    if (!this.isAdmin) return;
    this.openModal(`
      <div class="en-modal-header">
        <h3>✨ Yeni Mekan Ekle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.savePlaceForm(event)" class="en-form">
        <div class="en-form-group">
          <label>Mekan Adı (Türkçe) *</label>
          <input type="text" name="title_tr" required placeholder="Örn: Tren İstasyonu & Metro">
        </div>
        <div class="en-form-group">
          <label>Mekan Adı (İngilizce) *</label>
          <input type="text" name="title_en" required placeholder="Örn: Train Station & Metro">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Emoji / İkon *</label>
            <input type="text" name="icon" required value="🚆" style="text-align:center;">
          </div>
          <div class="en-form-group" style="flex:2;">
            <label>Kategori Etiketi</label>
            <input type="text" name="tag" value="Ulaşım">
          </div>
        </div>
        <div class="en-form-group">
          <label>Kapak Görseli URL</label>
          <input type="url" name="image" placeholder="https://images.unsplash.com/...">
        </div>
        <div class="en-form-group">
          <label>Açıklama (Türkçe)</label>
          <textarea name="description_tr" rows="2" placeholder="Bilet alma, peron sorma diyalogları..."></textarea>
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Kaydet</button>
        </div>
      </form>
    `);
  },

  editPlaceModal(placeId) {
    if (!this.isAdmin) return;
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;

    this.openModal(`
      <div class="en-modal-header">
        <h3>✏️ Mekanı Düzenle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.savePlaceForm(event, '${place.id}')" class="en-form">
        <div class="en-form-group">
          <label>Mekan Adı (Türkçe) *</label>
          <input type="text" name="title_tr" required value="${place.title_tr}">
        </div>
        <div class="en-form-group">
          <label>Mekan Adı (İngilizce) *</label>
          <input type="text" name="title_en" required value="${place.title_en}">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Emoji / İkon *</label>
            <input type="text" name="icon" required value="${place.icon || '📍'}" style="text-align:center;">
          </div>
          <div class="en-form-group" style="flex:2;">
            <label>Kategori Etiketi</label>
            <input type="text" name="tag" value="${place.tag || 'Mekan'}">
          </div>
        </div>
        <div class="en-form-group">
          <label>Kapak Görseli URL</label>
          <input type="url" name="image" value="${place.image || ''}">
        </div>
        <div class="en-form-group">
          <label>Açıklama (Türkçe)</label>
          <textarea name="description_tr" rows="2">${place.description_tr || ''}</textarea>
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Güncelle</button>
        </div>
      </form>
    `);
  },

  async savePlaceForm(e, editId) {
    e.preventDefault();
    const form = e.target;
    const data = {
      title_tr: form.title_tr.value.trim(),
      title_en: form.title_en.value.trim(),
      icon: form.icon.value.trim() || '📍',
      tag: form.tag.value.trim() || 'Mekan',
      image: form.image.value.trim() || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      description_tr: form.description_tr.value.trim(),
    };

    if (editId) {
      const idx = this.places.findIndex(p => p.id === editId);
      if (idx !== -1) {
        this.places[idx] = { ...this.places[idx], ...data };
        this.toast('Mekan güncellendi!', 'success');
      }
    } else {
      const newPlace = {
        id: 'place_' + Date.now(),
        ...data,
        gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        sections: []
      };
      this.places.unshift(newPlace);
      this.toast('Yeni mekan eklendi!', 'success');
    }

    this.closeModal();
    await this.savePlaces();
    this.render();
  },

  async deletePlace(placeId) {
    if (!this.isAdmin) return;
    if (!confirm('Bu mekanı ve içindeki tüm bölümleri silmek istediğinizden emin misiniz?')) return;
    this.places = this.places.filter(p => p.id !== placeId);
    await this.savePlaces();
    this.toast('Mekan silindi.', 'info');
    this.render();
  },

  // Sections CRUD
  addSectionModal(placeId) {
    if (!this.isAdmin) return;
    this.openModal(`
      <div class="en-modal-header">
        <h3>📑 Yeni Bölüm Ekle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.saveSectionForm(event, '${placeId}')" class="en-form">
        <div class="en-form-group">
          <label>Bölüm Başlığı (Türkçe) *</label>
          <input type="text" name="title_tr" required placeholder="Örn: Bölüm 1: Bilet Alma">
        </div>
        <div class="en-form-group">
          <label>Bölüm Başlığı (İngilizce) *</label>
          <input type="text" name="title_en" required placeholder="Örn: Section 1: Buying Tickets">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Zorluk / Seviye *</label>
            <select name="level_badge">
              <option value="beginner">🟢 A1-A2 Başlangıç</option>
              <option value="intermediate">🟡 B1-B2 Orta</option>
              <option value="advanced">🔴 C1 İleri</option>
            </select>
          </div>
        </div>
        <div class="en-form-group">
          <label>Bölüm Açıklaması</label>
          <textarea name="desc_tr" rows="2" placeholder="Bu bölümde geçecek konuşmalar hakkında kısa bilgi..."></textarea>
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Ekle</button>
        </div>
      </form>
    `);
  },

  editSectionModal(placeId, secId) {
    if (!this.isAdmin) return;
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    const sec = (place.sections || []).find(s => s.id === secId);
    if (!sec) return;

    this.openModal(`
      <div class="en-modal-header">
        <h3>✏️ Bölümü Düzenle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.saveSectionForm(event, '${placeId}', '${secId}')" class="en-form">
        <div class="en-form-group">
          <label>Bölüm Başlığı (Türkçe) *</label>
          <input type="text" name="title_tr" required value="${sec.title_tr}">
        </div>
        <div class="en-form-group">
          <label>Bölüm Başlığı (İngilizce) *</label>
          <input type="text" name="title_en" required value="${sec.title_en}">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Zorluk / Seviye *</label>
            <select name="level_badge">
              <option value="beginner" ${sec.level_badge === 'beginner' ? 'selected' : ''}>🟢 A1-A2 Başlangıç</option>
              <option value="intermediate" ${sec.level_badge === 'intermediate' ? 'selected' : ''}>🟡 B1-B2 Orta</option>
              <option value="advanced" ${sec.level_badge === 'advanced' ? 'selected' : ''}>🔴 C1 İleri</option>
            </select>
          </div>
        </div>
        <div class="en-form-group">
          <label>Bölüm Açıklaması</label>
          <textarea name="desc_tr" rows="2">${sec.desc_tr || ''}</textarea>
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Güncelle</button>
        </div>
      </form>
    `);
  },

  async saveSectionForm(e, placeId, editSecId) {
    e.preventDefault();
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    if (!place.sections) place.sections = [];

    const form = e.target;
    const badge = form.level_badge.value;
    const levelLabel = badge === 'beginner' ? 'A1-A2 Başlangıç' : badge === 'intermediate' ? 'B1-B2 Orta' : 'C1 İleri';

    const secData = {
      title_tr: form.title_tr.value.trim(),
      title_en: form.title_en.value.trim(),
      level: levelLabel,
      level_badge: badge,
      desc_tr: form.desc_tr.value.trim(),
    };

    if (editSecId) {
      const sIdx = place.sections.findIndex(s => s.id === editSecId);
      if (sIdx !== -1) {
        place.sections[sIdx] = { ...place.sections[sIdx], ...secData };
        this.toast('Bölüm güncellendi!', 'success');
      }
    } else {
      const newSec = {
        id: 'sec_' + Date.now(),
        ...secData,
        phrases: []
      };
      place.sections.push(newSec);
      this.activeSectionId = newSec.id;
      this.toast('Yeni bölüm eklendi!', 'success');
    }

    this.closeModal();
    await this.savePlaces();
    this.render();
  },

  async deleteSection(placeId, secId) {
    if (!this.isAdmin) return;
    if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
    const place = this.places.find(p => p.id === placeId);
    if (!place || !place.sections) return;
    place.sections = place.sections.filter(s => s.id !== secId);
    this.activeSectionId = place.sections.length > 0 ? place.sections[0].id : null;
    await this.savePlaces();
    this.toast('Bölüm silindi.', 'info');
    this.render();
  },

  // Phrases CRUD
  addPhraseModal(placeId, secId) {
    if (!this.isAdmin) return;
    this.openModal(`
      <div class="en-modal-header">
        <h3>💬 Yeni Cümle / Diyalog Ekle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.savePhraseForm(event, '${placeId}', '${secId}')" class="en-form">
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Konuşmacı Rolü *</label>
            <select name="role">
              <option value="customer">👤 Müşteri / Yolcu / Ziyaretçi</option>
              <option value="staff">🏢 Görevli / Garson / Şoför / Memur</option>
            </select>
          </div>
          <div class="en-form-group" style="flex:2;">
            <label>Konuşmacı Adı</label>
            <input type="text" name="speaker" placeholder="Örn: Müşteri 👤">
          </div>
        </div>
        <div class="en-form-group">
          <label>Türkçe Cümle *</label>
          <textarea name="tr" required rows="2" placeholder="Örn: İki adet yetişkin bileti alabilir miyim lütfen?"></textarea>
        </div>
        <div class="en-form-group">
          <label>İngilizce Cümle *</label>
          <textarea name="en" required rows="2" placeholder="Örn: Could I have two adult tickets, please?"></textarea>
        </div>
        <div class="en-form-group">
          <label>İpucu / Dil Bilgisi Notu (Opsiyonel)</label>
          <input type="text" name="note" placeholder="Örn: 'Could I have...' kibarca sipariş verirken en yaygın kalıptır.">
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Kaydet</button>
        </div>
      </form>
    `);
  },

  editPhraseModal(placeId, secId, phraseId) {
    if (!this.isAdmin) return;
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    const sec = (place.sections || []).find(s => s.id === secId);
    if (!sec) return;
    const ph = (sec.phrases || []).find(p => p.id === phraseId);
    if (!ph) return;

    this.openModal(`
      <div class="en-modal-header">
        <h3>✏️ Cümleyi Düzenle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.savePhraseForm(event, '${placeId}', '${secId}', '${phraseId}')" class="en-form">
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Konuşmacı Rolü *</label>
            <select name="role">
              <option value="customer" ${ph.role === 'customer' ? 'selected' : ''}>👤 Müşteri / Yolcu / Ziyaretçi</option>
              <option value="staff" ${ph.role === 'staff' ? 'selected' : ''}>🏢 Görevli / Garson / Şoför / Memur</option>
            </select>
          </div>
          <div class="en-form-group" style="flex:2;">
            <label>Konuşmacı Adı</label>
            <input type="text" name="speaker" value="${ph.speaker || ''}">
          </div>
        </div>
        <div class="en-form-group">
          <label>Türkçe Cümle *</label>
          <textarea name="tr" required rows="2">${ph.tr}</textarea>
        </div>
        <div class="en-form-group">
          <label>İngilizce Cümle *</label>
          <textarea name="en" required rows="2">${ph.en}</textarea>
        </div>
        <div class="en-form-group">
          <label>İpucu / Dil Bilgisi Notu</label>
          <input type="text" name="note" value="${ph.note || ''}">
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Güncelle</button>
        </div>
      </form>
    `);
  },

  async savePhraseForm(e, placeId, secId, editPhraseId) {
    e.preventDefault();
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    const sec = (place.sections || []).find(s => s.id === secId);
    if (!sec) return;
    if (!sec.phrases) sec.phrases = [];

    const form = e.target;
    const phData = {
      role: form.role.value,
      speaker: form.speaker.value.trim() || (form.role.value === 'staff' ? 'Görevli 🏢' : 'Müşteri 👤'),
      tr: form.tr.value.trim(),
      en: form.en.value.trim(),
      note: form.note.value.trim()
    };

    if (editPhraseId) {
      const pIdx = sec.phrases.findIndex(p => p.id === editPhraseId);
      if (pIdx !== -1) {
        sec.phrases[pIdx] = { ...sec.phrases[pIdx], ...phData };
        this.toast('Cümle güncellendi!', 'success');
      }
    } else {
      const newPh = {
        id: 'ph_' + Date.now(),
        ...phData
      };
      sec.phrases.push(newPh);
      this.toast('Yeni cümle eklendi!', 'success');
    }

    this.closeModal();
    await this.savePlaces();
    this.render();
  },

  async deletePhrase(placeId, secId, phraseId) {
    if (!this.isAdmin) return;
    if (!confirm('Bu cümleyi silmek istediğinize emin misiniz?')) return;
    const place = this.places.find(p => p.id === placeId);
    if (!place) return;
    const sec = (place.sections || []).find(s => s.id === secId);
    if (!sec || !sec.phrases) return;

    sec.phrases = sec.phrases.filter(p => p.id !== phraseId);
    await this.savePlaces();
    this.toast('Cümle silindi.', 'info');
    this.render();
  },

  // Vocab CRUD
  addVocabModal() {
    if (!this.isAdmin) return;
    this.openModal(`
      <div class="en-modal-header">
        <h3>📚 Yeni Kelime Ekle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.saveVocabForm(event)" class="en-form">
        <div class="en-form-group">
          <label>İngilizce Kelime / Kalıp *</label>
          <input type="text" name="word" required placeholder="Örn: Decaf">
        </div>
        <div class="en-form-group">
          <label>Türkçe Anlamı *</label>
          <input type="text" name="meaning" required placeholder="Örn: Kafeinsiz">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Okunuş / IPA</label>
            <input type="text" name="pron" placeholder="Örn: [ˈdiː.kæf]">
          </div>
          <div class="en-form-group">
            <label>Seviye</label>
            <select name="level">
              <option value="A1">A1 Başlangıç</option>
              <option value="A2">A2 Temel</option>
              <option value="B1">B1 Orta</option>
              <option value="B2">B2 İyi</option>
              <option value="C1">C1 İleri</option>
            </select>
          </div>
        </div>
        <div class="en-form-group">
          <label>Kategori</label>
          <select name="cat">
            <option value="Kafe & Yeme İçme">Kafe & Yeme İçme</option>
            <option value="Seyahat & Havalimanı">Seyahat & Havalimanı</option>
            <option value="Taksi & Ulaşım">Taksi & Ulaşım</option>
            <option value="Sokak & Yol Tarifi">Sokak & Yol Tarifi</option>
            <option value="Alışveriş & Mağaza">Alışveriş & Mağaza</option>
            <option value="Otel & Konaklama">Otel & Konaklama</option>
            <option value="Eczane & Sağlık">Eczane & Sağlık</option>
            <option value="Genel">Genel & Günlük</option>
          </select>
        </div>
        <div class="en-form-group">
          <label>Örnek Cümle (İngilizce)</label>
          <input type="text" name="ex_en" placeholder="Örn: Do you have decaf coffee?">
        </div>
        <div class="en-form-group">
          <label>Örnek Cümle (Türkçe)</label>
          <input type="text" name="ex_tr" placeholder="Örn: Kafeinsiz kahveniz var mı?">
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Kaydet</button>
        </div>
      </form>
    `);
  },

  editVocabModal(vocabId) {
    if (!this.isAdmin) return;
    const item = this.vocab.find(v => v.id === vocabId);
    if (!item) return;

    this.openModal(`
      <div class="en-modal-header">
        <h3>✏️ Kelimeyi Düzenle</h3>
        <button class="en-modal-close" onclick="EnglishApp.closeModal()">✕</button>
      </div>
      <form onsubmit="EnglishApp.saveVocabForm(event, '${item.id}')" class="en-form">
        <div class="en-form-group">
          <label>İngilizce Kelime / Kalıp *</label>
          <input type="text" name="word" required value="${item.word}">
        </div>
        <div class="en-form-group">
          <label>Türkçe Anlamı *</label>
          <input type="text" name="meaning" required value="${item.meaning}">
        </div>
        <div class="en-form-row">
          <div class="en-form-group">
            <label>Okunuş / IPA</label>
            <input type="text" name="pron" value="${item.pron || ''}">
          </div>
          <div class="en-form-group">
            <label>Seviye</label>
            <select name="level">
              <option value="A1" ${item.level === 'A1' ? 'selected' : ''}>A1 Başlangıç</option>
              <option value="A2" ${item.level === 'A2' ? 'selected' : ''}>A2 Temel</option>
              <option value="B1" ${item.level === 'B1' ? 'selected' : ''}>B1 Orta</option>
              <option value="B2" ${item.level === 'B2' ? 'selected' : ''}>B2 İyi</option>
              <option value="C1" ${item.level === 'C1' ? 'selected' : ''}>C1 İleri</option>
            </select>
          </div>
        </div>
        <div class="en-form-group">
          <label>Kategori</label>
          <select name="cat">
            <option value="Kafe & Yeme İçme" ${item.cat === 'Kafe & Yeme İçme' ? 'selected' : ''}>Kafe & Yeme İçme</option>
            <option value="Seyahat & Havalimanı" ${item.cat === 'Seyahat & Havalimanı' ? 'selected' : ''}>Seyahat & Havalimanı</option>
            <option value="Taksi & Ulaşım" ${item.cat === 'Taksi & Ulaşım' ? 'selected' : ''}>Taksi & Ulaşım</option>
            <option value="Sokak & Yol Tarifi" ${item.cat === 'Sokak & Yol Tarifi' ? 'selected' : ''}>Sokak & Yol Tarifi</option>
            <option value="Alışveriş & Mağaza" ${item.cat === 'Alışveriş & Mağaza' ? 'selected' : ''}>Alışveriş & Mağaza</option>
            <option value="Otel & Konaklama" ${item.cat === 'Otel & Konaklama' ? 'selected' : ''}>Otel & Konaklama</option>
            <option value="Eczane & Sağlık" ${item.cat === 'Eczane & Sağlık' ? 'selected' : ''}>Eczane & Sağlık</option>
            <option value="Genel" ${item.cat === 'Genel' ? 'selected' : ''}>Genel & Günlük</option>
          </select>
        </div>
        <div class="en-form-group">
          <label>Örnek Cümle (İngilizce)</label>
          <input type="text" name="ex_en" value="${item.ex_en || ''}">
        </div>
        <div class="en-form-group">
          <label>Örnek Cümle (Türkçe)</label>
          <input type="text" name="ex_tr" value="${item.ex_tr || ''}">
        </div>
        <div class="en-modal-actions">
          <button type="button" class="en-btn btn-glass" onclick="EnglishApp.closeModal()">İptal</button>
          <button type="submit" class="en-btn btn-primary">Güncelle</button>
        </div>
      </form>
    `);
  },

  async saveVocabForm(e, editId) {
    e.preventDefault();
    const form = e.target;
    const vData = {
      word: form.word.value.trim(),
      meaning: form.meaning.value.trim(),
      pron: form.pron.value.trim(),
      level: form.level.value,
      cat: form.cat.value,
      ex_en: form.ex_en.value.trim(),
      ex_tr: form.ex_tr.value.trim()
    };

    if (editId) {
      const idx = this.vocab.findIndex(v => v.id === editId);
      if (idx !== -1) {
        this.vocab[idx] = { ...this.vocab[idx], ...vData };
        this.toast('Kelime güncellendi!', 'success');
      }
    } else {
      const newV = {
        id: 'v_' + Date.now(),
        ...vData
      };
      this.vocab.unshift(newV);
      this.toast('Yeni kelime eklendi!', 'success');
    }

    this.closeModal();
    await this.saveVocab();
    this.render();
  },

  async deleteVocab(vocabId) {
    if (!this.isAdmin) return;
    if (!confirm('Bu kelimeyi silmek istediğinize emin misiniz?')) return;
    this.vocab = this.vocab.filter(v => v.id !== vocabId);
    await this.saveVocab();
    this.toast('Kelime silindi.', 'info');
    this.render();
  },

  _attachEvents() {
    // Escape key closes modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });
  }
};

window.EnglishApp = EnglishApp;
document.addEventListener('DOMContentLoaded', () => {
  EnglishApp.init();
});
