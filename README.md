# Osmanlıca Okuma Atölyesi

Belgeni (JPEG/PNG/WEBP/PDF) yükle → Gemini sayfayı **satırlara ayırıp işaretler** → her satırın altına **okunuşunu yaz** → **doğru / kısmen / yanlış** denir, sözcük sözcük hatalarını düzeltir. Matbu ve Rik'a ayrımı yapılır. **Harfler** sekmesinde her harfin tek/başta/ortada/sonda yazılışı matbu ve Rik'a olarak bulunur.

## Çalıştırma
Node.js 18+ gerekir. Başka paket kurmak gerekmez (PDF.js ve yazı tipleri `vendor/` ve `fonts/` içinde).

    # PowerShell
    $env:GEMINI_API_KEY = "ANAHTARIN"
    node server.js
    # sonra http://127.0.0.1:3000

Anahtarı Google AI Studio'dan al. Anahtar yalnızca sunucuda kalır.

Ortam değişkenleri: `GEMINI_MODEL` (okunuş kontrolü, varsayılan gemini-3.6-flash), `GEMINI_FALLBACK_MODEL` (gemini-3.1-flash-lite), `GEMINI_OCR_MODEL` (satır bulma; varsayılan GEMINI_MODEL), `GEMINI_OCR_FALLBACK_MODEL`, `PORT`, `GEMINI_TEMPERATURE` (isteğe bağlı). Model adı 404 verirse AI Studio'daki güncel adı yaz.

## Nasıl kullanılır
1. **Ana sayfa**: dosyayı seç, kaydet.
2. **Okuma masası → Satırları bul**. Yazı türünü biliyorsan "ipucu"ndan seç. Sayfa görselinde satır kutuları, sağda satır kartları çıkar. Her kartta satırın kırpılmış görüntüsü vardır; yazılı (OCR) hâli "Yazılı hâli" altında gizlidir, yanlışsa düzeltebilirsin.
3. Okunuşunu yaz (â î û ñ düğmeleri var), **Kontrol et** (Ctrl+Enter) veya tüm kartlar için **Yazdıklarımı kontrol et**. Takıldığında **Doğrusunu göster**.
4. Sonuçta her sözcük yeşil/kırmızı/sarı görünür; doğru okunuş ve günümüz imlası verilir; çalışılacak harflere tıklayınca Harfler tablosunda o harf vurgulanır.
5. **Tekrar** sekmesi zorlandığın satırları, yanlış okunan sözcükleri ve harfleri toplar; satırı doğru okuyunca listeden düşer.

## Bilmen gerekenler
- Gemini satır aktarımında ve Rik'a'da hata yapabilir. Kontrol sırasında satırın **görüntüsü de** gönderilir ve görüntü esas alınır; yine de sonuçlar öneridir, kesin paleografik doğrulama değildir.
- Puan sözcük sonuçlarından sunucuda hesaplanır (≥%90 doğru, ≥%50 kısmen). Büyük/küçük harf, â î û işareti, kesme işareti, tarihî/günümüz okunuşu farkı hata sayılmaz.
- Sunucu Gemini'nin `generateContent` uç noktasını kullanır; model kotası veya yoğunluk hatasında yedek modele geçer.
- Harf tablosunda Rik'a sütunu, Rik'a üslubuna dayalı Aref Ruqaa yazı tipidir (el yazısı değil). Rik'a ipuçları genel eğilimlerdir.
- Ücretsiz Gemini katmanında gönderilen içerik Google tarafından ürün geliştirmede kullanılabilir; gizli belge göndermeden önce koşulları incele.
- Belgeler ve ilerleme tarayıcının IndexedDB'sindedir (eski sürümdeki belgeler de görünür; eski denemeler kullanılmaz). Tarayıcı verisini silmek hepsini siler.
- Sunucu yalnızca 127.0.0.1'de dinler ve yalnızca kendi sayfasından gelen istekleri kabul eder.

Lisanslar: Noto Naskh Arabic ve Aref Ruqaa (SIL OFL 1.1), PDF.js 3.11.174 (Apache 2.0).

## v10: toplu hazırlık ve anında kontrol
- Belge yüklenince (veya açılınca) arka planda **tüm sayfalar bir kez** okunur: satırlar bulunur, her satır için doğru okunuş, sözcük alternatifleri, sözcük anlamları ve **Türkçe çeviri** hazırlanır. Üstteki çubuk ilerlemeyi gösterir; önce açık sayfa hazırlanır. Yarıda kalırsa "Hazırlığı sürdür" ile kaldığı yerden devam eder.
- Hazırlanmış satırlarda **Kontrol et Gemini'ye gitmez, anında** yerelde çalışır. Karşılaştırma sözcük hizalamalıdır (atlanan sözcük diğerlerini bozmaz, "kitab ı" gibi bölünmüş yazım birleştirilir, â/î/û işaretsiz ve alternatif yazımlar kabul edilir).
- Hazırlık cevabı da Gemini'nin okumasıdır; geçerli ama farklı bir okunuşu yanlış sayabilir. Böyle durumda sonuçtaki **İkinci görüş (Gemini)** düğmesi satırı görüntüden yeniden değerlendirir.
- Çeviri her kartta "Çeviriyi göster" ile (kontrolden sonra otomatik), tüm sayfa için de "Sayfanın tam çevirisi" bölümünde görünür.
- Hazırlık Gemini kotası harcar (sayfa başına bir analiz + satır grupları başına bir çağrı). Büyük PDF'lerde "Durdur" ile bırakıp sonra sürdürebilirsin.
- ⚙ Ayarlar'dan girilen anahtar artık ortam değişkeni olmadan da çalışır.

## v10.1: satır kutularını görüntüye oturtma
Gemini'nin verdiği satır kutuları kayabiliyor ve iki satırı birden kapsayabiliyor. Artık sayfa analiz edilince kutular, görüntüdeki gerçek metin bantlarına (satırların mürekkep izine) yerelde oturtulur; kırpılan satır görüntüleri de buna göre alınır. Gemini bir satırı atlamış ya da kutuları hep aynı yöne kaydırmışsa bu da hesaba katılır. Daha önce analiz edilmiş sayfalar açılınca bir kez otomatik hizalanır; kutular değiştiyse o sayfanın cevap anahtarı ve çevirisi yanlış kırpılmış görüntüden hazırlanmış olabileceği için yeniden hazırlanır.
Satır tanıma kötü kalırsa daha güçlü bir model dene: `$env:GEMINI_OCR_MODEL = "model-adı"`.


## İnternette yayınlama (iPhone + Android)
Bu paket Render Web Service olarak dağıtılmaya hazırdır.
1. ZIP'i bilgisayarında klasöre çıkar.
2. GitHub'da yeni, private bir repository oluşturup klasör içeriğini yükle.
3. Render.com → New → Web Service → GitHub repository'ni seç.
4. Build Command: `echo Build gerekmiyor` ; Start Command: `npm start`
5. Deploy tamamlanınca Render'ın verdiği `https://...onrender.com` adresini aç.
6. Uygulama içindeki ⚙ Ayarlar bölümüne kendi Gemini API anahtarını gir ve kaydet.

iPhone: Safari → paylaş simgesi → Ana Ekrana Ekle.
Android: Chrome → ⋮ → Uygulamayı yükle / Ana ekrana ekle.

Not: Render ücretsiz planında servis bir süre kullanılmayınca uykuya geçebilir; ilk açılışta bekleme olabilir.
API anahtarını GitHub'a veya kod dosyalarına yazma. Her kullanıcı kendi anahtarını uygulama Ayarları'ndan girmelidir.
