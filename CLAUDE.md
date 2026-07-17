# KPSS Tarih Eşleştirme — Proje Notları

## Bu proje ne yapıyor
Bir eşleştirme oyunu (Ders → Bölüm → Oyun). GitHub Pages'te barınıyor
(`index.html` + `data.json`, repo kökünde). Android tarafı `apk-kabuk/`
içinde bir Capacitor kabuğu — o kabuk hiçbir veri taşımıyor, açıldığında
doğrudan GitHub Pages'teki canlı sayfayı yüklüyor. Yani `index.html` ya da
`data.json` değiştiği anda, APK'sı telefonda kurulu olan herkes bir sonraki
açılışta güncel içeriği görüyor.

## Veri yapısı (data.json)
`dersler[]` → her ders `bolumler[]` içerir. Bölümler şu modlarda çalışır:
- `mod: "havuz"` — sabit bir `ust[]` listesi (örn. 6 padişah) + büyük bir
  `havuz[]` listesi (örn. 50+ madde). Ekranda üstte sabit N kart, altta aynı
  anda sadece N kart görünür; doğru eşleşince havuzdan otomatik yenisi gelir.
  Her `havuz` öğesi bir `ustId` ile hangi `ust` öğesine ait olduğunu belirtir.
- `mod: "cift-havuz"` — `havuz` gibi ama `ust[]` de (bir yazarın tüm eserleri
  gibi) kendi içinde döner; hem üstte hem altta aynı anda birkaç kart görünür.
  1:1 eşleşen listelerde (örn. Antlaşmalar) bile bunu kullan, "N sabit / N
  değişen havuz" görünümü verir.
- `mod: "liste"` — klasik tam liste eşleştirme, `pairs[]` (`left`/`right`).
  Artık kullanılmıyor, yeni bölüm eklerken tercih etme — `havuz` her zaman
  daha iyi bir oyun deneyimi verir.
- `mod: "harita"` — Türkiye anahat haritasında nokta eşleştirme, `noktalar[]`.

Bir bölüme opsiyonel `"kategori": "..."` alanı eklenirse, bölüm seçim
ekranında aynı `kategori` değerine sahip bölümler açılır/kapanır (accordion)
bir başlık altında gruplanır (bkz. Tarih ve Vatandaşlık dersleri). Az sayıda
bölümü olan bir derste (örn. Güncel Bilgiler) kategori kullanmaya gerek yok.

## ÖNEMLİ: Her değişiklikten sonra otomatik commit + push yap

Bu depo doğrudan GitHub Pages'i besliyor. `index.html` veya `data.json`
üzerinde bir değişiklik tamamladığında — özellikle Ensar'la birlikte yeni
bir dönem/madde eklerken — **ekstra sorulmadan** şunu çalıştır:

```
git add -A
git commit -m "<değişikliği özetleyen kısa Türkçe mesaj>"
git push
```

Örnek commit mesajları: "Yükselme dönemi padişahları eklendi",
"Eser-Yazar modülü dolduruldu", "Antlaşmalar bölümüne 2 madde eklendi".

Push başarısız olursa (auth hatası, çakışma vb.) sessizce geçme — Ensar'a
net şekilde ne olduğunu söyle ve nasıl çözüleceğini öner.

## Veri eklerken dikkat edilecekler
- `data.json` her zaman geçerli JSON olmalı — commit'ten önce mutlaka
  `python3 -m json.tool data.json` gibi bir yöntemle doğrula.
- `havuz` modunda yeni madde eklerken `id` alanı benzersiz olmalı
  (örn. bir sonraki dönem için `i54, i55, ...` gibi devam et, `i1`'den
  başlama — çakışma olursa oyun bozulur).
- Ensar Türkçe konuşuyor ve teknik terimlere aşina değil; git/GitHub
  adımlarını sadeleştirerek anlat, gerekirse adım adım.

## Güncel Bilgiler dersi — periyodik güncelleme gerekir
Diğer derslerin (Tarih, Coğrafya, Vatandaşlık) aksine "Güncel Bilgiler"
dersinin içeriği (`dersler[].id: "guncel-bilgiler"`) zamanla eskir — KPSS'nin
"Güncel Bilgiler" sorularının kaynağı son 1-2 yılın olaylarıdır. Bu bölümü
**en az 3 ayda bir** gözden geçir: WebSearch ile yeni gelişmeleri araştır,
eskimiş/artık "güncel" sayılmayan maddeleri çıkar. İçerik eklerken sadece
birden fazla kaynakta tutarlı şekilde doğrulanan olguları kullan; kaynaklar
çelişiyorsa (örn. iki farklı şehrin aynı unvanı aldığını söylemesi gibi) o
maddeyi hiç ekleme.
