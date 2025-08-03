<p align="center">
  <img src="./SprintThreeFiles/FocusFlowLogo.jpg" alt="FocusFlow Logo" width="400"/>
</p>

# FocusFlow Sprint Raporu 3

---



**Sprint Tarihi:** 20.07.2025/03.08.2025 

**Kullanılan Araç:** **Trello** – [Trello Sprint Board](https://trello.com/b/rYb67cj1/kanban-template)  

**Sprint Hedefi:** Bu sprintte, kullanıcılarımızın **yapay zeka destekli üretkenlik ve öğrenme araçlarıyla deneyimlerini bir üst seviyeye taşımaya** odaklandık. Temel hedefimiz, kullanıcılarımıza özel, akıllı ve kişiselleştirilmiş destek sunarak öğrenme ve görev yönetimini daha verimli hale getirmekti. Ayrıca, önceki sprintten kalan **bazı backend ve frontend entegrasyonlarını** da tamamlamayı hedefledik. Bu hedefler doğrultusunda üzerinde çalıştığımız backlog öğeleri ise şunlardır:


- **PB-06: AI Çalışma İpuçları:** Yapay zeka destekli, kişiselleştirilmiş çalışma ve öğrenme ipuçları sunulması.
- **PB-08: Sprint Bazlı Planlama Motoru:** Sprint bazlı görev ve öğrenme planlamasını optimize eden bir motorun geliştirilmesi.
- **PB-09: AI Destekli Haftalık Retrospektif:** Yapay zeka ile haftalık retrospektif analizi yaparak iyileştirme alanlarının belirlenmesi.

---

## İçindekiler
- [Sprint Notları](#sprint-notları)
- [Tahmin Edilen Tamamlanacak Puan](#tahmin-edilen-tamamlanacak-puan)
- [Tahmin Mantığı](#tahmin-mantığı)
- [Daily Scrum Notları](#daily-scrum-notları)
- [Sprint Board Durumu](#sprint-board-durumu)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Sprint Review](#sprint-review)
- [Sprint Retrospective](#sprint-retrospective)
-----

### Sprint Notları

Bu sprintte, yapay zeka destekli yeni özelliklerin geliştirilmesi üzerine odaklanarak önemli ilerlemeler kaydettik. Her bir backlog maddesi için teknik detaylar ve kaydedilen başarılar aşağıda açıklanmaktadır. Genel olarak, fonksiyonların çoğu arka uçta tamamlanmış olup, ön uç entegrasyonları üzerinde son rötuşlar yapılmaktadır.

- **Önceki Sprint Entegrasyonları**

**Açıklama:** Günlük Görev Planlayıcısı için arayüzde görevlerin gün bazlı görüntülenmesi ve Takvim Entegrasyonu için ön uç ile arka uç arasındaki bağlantıların tamamlanması.

**Durum:** Günlük Görev Planlayıcısı'nda görevlerin arayüzde gün bazlı görselleştirilmesi başarılı bir şekilde tamamlandı. Kullanıcılar artık görevlerini daha düzenli bir takvim görünümünde takip edebiliyor. Ayrıca, Takvim Entegrasyonu için bekleyen ön uç ve arka uç entegrasyonları da bu sprintte eksiksiz olarak tamamlandı. Böylece, Google Takvim ile senkronizasyon sorunsuz bir şekilde çalışır hale geldi.

- **PB-06: AI Çalışma İpuçları**

**Açıklama:** Yapay zeka destekli, kişiselleştirilmiş çalışma ve öğrenme ipuçları sunulması.

**Durum:** Kullanıcının geçmiş performans verileri ve öğrenme alışkanlıklarına dayalı kişiselleştirilmiş ipuçları üreten AI modeli geliştirildi. Bu ipuçlarının kullanıcı arayüzünde gösterilmesi için gerekli API uçları hazırlandı ve entegrasyonlar tamamlandı. Kullanıcıların bu ipuçlarını değerlendirebileceği (beğenme/beğenmeme) bir geri bildirim mekanizması da eklendi. Ön uç entegrasyonu başarıyla tamamlanmış olup, tam fonksiyonellik sağlanmıştır.

- **PB-08: Sprint Planlama Motoru**

**Açıklama:** Sprint bazlı görev ve öğrenme planlamasını optimize eden bir motorun geliştirilmesi.

**Durum:** Kullanıcının belirlediği sprint hedeflerine göre görev dağılımını ve önceliklendirmeyi otomatik olarak yapan bir motor geliştirildi. Bu motor, geçmiş sprint verilerini analiz ederek daha gerçekçi ve optimize edilmiş sprint planları oluşturma yeteneğine sahiptir. Sprint oluşturma, düzenleme ve silme işlevleri arka uçta tamamlandı. Ön uçta sprintlerin görselleştirilmesi ve kullanıcıların manuel ayarlamalar yapabilmesi için arayüz geliştirme çalışmaları devam etmektedir. Arka uç entegrasyonu tamamlanmıştır, ön uç entegrasyonunun büyük bir kısmı bitmiş, küçük arayüz rötuşları kalmıştır.

- **PB-09: AI Destekli Haftalık Retrospektif**

**Açıklama:** Yapay zeka ile haftalık retrospektif analizi yaparak iyileştirme alanlarının belirlenmesi.

**Durum:** Kullanıcının haftalık görev tamamlama oranları, karşılaşılan zorluklar ve geçirilen süre gibi metrikleri analiz eden AI destekli retrospektif raporlama sistemi geliştirildi. Bu sistem, kullanıcılara güçlü ve zayıf yönlerini gösteren özetler sunmakta ve gelecek haftalar için kişiselleştirilmiş iyileştirme önerileri sunmaktadır. Raporların görselleştirilmesi ve kullanıcıların geri bildirimde bulunabileceği arayüzler tasarlanmıştır. Bu backlog maddesi eksiksiz bir şekilde tamamlanmıştır. Ön uç ve arka uç entegrasyonları sorunsuz çalışmaktadır.


---

### Tahmin Edilen Tamamlanacak Puan

| No    | Başlık                        | Açıklama                                                        | Öncelik | SP |
|-------|-------------------------------|------------------------------------------------------------------|---------|----|
| PB-01 | AI Eğitim Modülü          | Kişiselleştirilmiş modül yapısını AI ile oluşturma              | Yüksek  | 8  |
| PB-02 | Günlük Görev Planlayıcı   | AI destekli kullanıcı bazlı günlük planlama motoru              | Yüksek  | 5  |
| PB-03 | Takvim Entegrasyonu           | Google Calendar API ile entegrasyon                             | Orta    | 3  |
| PB-04 | Görev Hatırlatma Servisi      | E-posta ve bildirim sistemiyle hatırlatma                       | Orta    | 5  |
| PB-05 | İlerleme Ölçümü           | Görev tamamlama verilerine göre gelişim raporları               | Yüksek  | 8  |
| PB-06 | **AI Çalışma İpuçları**           | **Kullanıcıya odak artırıcı öneriler**                              | Orta    | **5**  |
| PB-07 | Kullanıcı Paneli        | Arayüz, görev yönetimi ve ilerleme ekranı                       | Yüksek  | 8  |
| PB-08 | **Sprint Planlama Motoru**        | **1 haftalık öğrenme sprintlerinin otomatik planlanması**           | Yüksek  | **5**  |
| PB-09 | **Haftalık Retrospektif**         | **AI ile sprint sonrası otomatik geri bildirim**                    | Düşük   | **3**  |
| PB-10 | Hedef Belirleyici             | AI ile kullanıcıdan hedef alıp öneri sunan yapı                 | Orta    | 3  |

Toplam hedeflenen puan: **13 Puan**

<details>
  <summary>Hedeflenen Backlog'lar</summary>

  ### PB-06
  ![PB-06](./SprintThreeFiles/PB-06.png)

  ### PB-08
  ![PB-08](./SprintThreeFiles/PB-08.png)
     
  ### PB-09
  ![PB-09](./SprintThreeFiles/PB-09.png)
  
  
</details>

> Ekibin kapasitesine göre planlama yapıldı. Önceki denemelerden elde edilen velocity değerine göre 13 puan hedeflendi.

---

### Tahmin Mantığı

Bu sprintteki Story Point tahminlerimiz, projemizin son aşamasına özel bir hassasiyetle belirlendi. Önceki sprintlerdeki deneyimlerimiz ve elde ettiğimiz velocity değerlerimiz, bu son backlog öğeleri için daha gerçekçi bir temel oluşturdu. Takımımızdan bir üyemizin ayrılmasıyla ortaya çıkan görev dağılımı ve iş yükü düzenlemeleri, tahmin sürecimize dahil edilerek olası etkileri minimize etmek adına gerekli ayarlamalar yapıldı.

Her bir kalan backlog öğesinin göreceli karmaşıklığı, tamamlanması gereken geliştirme eforu ve son olası belirsizlikler titizlikle değerlendirildi. Özellikle, tamamlanması gereken son ön uç ve arka uç entegrasyonlarının gerektireceği potansiyel ek iş yükü tahminlere dahil edildi. Takım içi tartışmalar ve detaylı teknik incelemeler sonucunda her bir görevin Story Point'leri belirlendi. Bu sayede, projemizin başarıyla tamamlanması için son ve en gerçekçi hedefleri belirleyebildik.

---

### Daily Scrum Notları

| Tarih | Gelişme |
|------|---------|
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |

---

### Sprint Board Durumu

Bu sprintte tamamlanan Ürün Backlog öğeleri ve bunların projeye katkıları.

| Blaclog ID | Başlık | Tahmini Efor |Durum |
|----------|-------------|-------------|-------------|
| PB-06 | AI Çalışma İpuçları | 5 | Tamamlandı |
| PB-08 | Sprint Planlama Motoru | 5 | Tamamlandı |
| PB-09 | AI Destekli Haftalık Retrospektif | 3 | Tamamlandı |
| **Toplam** | **13** |

### Ekran Görüntüleri

<details>
  <summary>Ekran Görüntüleri</summary>

   ### Etkinlik Ekleme Testi
  ![Kayıt Sayfası](./SprintTwoFiles/create_event_test.png)


  
</details>

---

### Sprint Review

Sprint İncelemesi toplantısında, paydaşlarımızla bir araya gelerek bu sprintte tamamladığımız temel fonksiyonları ve kaydettiğimiz ilerlemeleri canlı demolarla sunduk. Odak noktamız olan günlük görev planlayıcı, takvim entegrasyonu, görev hatırlatma servisi ve öğrenme ilerlemesi ölçümü modülleri ayrıntılı bir şekilde tanıtıldı.

- **Başarılar ve Öne Çıkanlar:**
  - **Takvim Entegrasyonu (PB-03):** Google Takvim ile sorunsuz entegrasyon ve görevlerin otomatik olarak takvime eklenmesi özelliği, uygulamanın kullanışlılığını artırması açısından olumlu geri bildirimler aldı.
   
  - **Görev Hatırlatma Servisi (PB-04):** Tamamen işlevsel olması ve kullanıcıların bildirim tercihlerini yönetebilmesi, paydaşlar tarafından büyük beğeniyle karşılandı.
    
  - **Öğrenme İlerlemesi Ölçümü (PB-05):** Gelişim çubukları ve otomatik AI yorumları gibi özellikler, kullanıcının motivasyonunu artırma potansiyeli nedeniyle takdir edildi.

- **Alınan Geri Bildirimler ve Öneriler:**
  - **Kullanıcı Arayüzü İyileştirmeleri:** Bazı arayüz elementlerinde küçük estetik dokunuşlar ve daha sezgisel akışlar üzerine öneriler alındı. Özellikle görev planlayıcının (PB-02) görsel sunumu konusunda daha fazla esneklik istendi.

  - **Performans Optimizasyonu:** Özellikle büyük veri setleriyle çalışıldığında takvim entegrasyonunun ve ilerleme ölçümünün yüklenme süreleri hakkında küçük endişeler dile getirildi. Bu, gelecek sprintlerde performans optimizasyonlarına odaklanma ihtiyacını ortaya koydu.

  - **AI Asistanı Entegrasyonu:** Bir önceki sprintte tasarımı yapılan AI Asistanı'nın, bu sprintte tamamlanan modüllerle daha derinlemesine nasıl entegre edilebileceği konusunda fikir alışverişinde bulunuldu. Özellikle görev planlama ve öğrenme tavsiyelerinde AI'ın rolünün artırılması önerildi.


---

### Sprint Retrospective

Bu sprintin sonunda, takım olarak kapsamlı bir retrospektif toplantısı gerçekleştirdik. Bu toplantıda, bu sprintte nelerin yolunda gittiğini, karşılaştığımız zorlukları ve gelecek sprintler için nasıl daha iyi bir performans sergileyebileceğimizi detaylı bir şekilde analiz ettik. Amacımız, sürekli öğrenen ve gelişen bir ekip olmak.

- **Neler İyi Gitti?**
  - **Net Odak ve Hedef Tamamlanması:** Bu sprintte belirlediğimiz görev planlayıcı, takvim entegrasyonu ve öğrenme takibi ana hedeflerine tam olarak ulaşabildik. Takımın tüm backlog maddelerine aynı anda odaklanabilmesi, verimli bir ilerleme sağladı.
  - **Güçlü Takım İçi İletişim:** Daily Scrum'lar ve sürekli iletişim kanalları, ekip üyeleri arasındaki bilgi akışını mükemmel düzeyde tuttu. Karşılaşılan engellerin anında paylaşılması ve çözüm önerilerinin birlikte geliştirilmesi, sprintin sorunsuz ilerlemesinde kilit rol oynadı.
  - **Teknik Borç Yönetimi:** Entegrasyon süreçlerinde ortaya çıkan bazı küçük teknik borçları anında ele alıp çözümleyerek, projenin sağlamlığını koruduk. Bu, gelecekte ortaya çıkabilecek daha büyük sorunların önüne geçti.
  - **Kaliteye Odaklanma:** Teslim ettiğimiz her bir modülde (özellikle PB-04 ve PB-03) yüksek kalite standartlarını korumayı başardık. Hatasız ve kullanıcı dostu arayüzler sunmak, takımın önceliği oldu.

- **Neler Daha İyi Yapılabilirdi?**
  - **Geliştirme Ortamı İstikrarsızlığı:** Sprintin bazı dönemlerinde geliştirme ortamımızda beklenmedik istikrarsızlıklar (örneğin bağımlılık çakışmaları veya yerel kurulum sorunları) yaşandı. Bu durum, bazı takım üyelerinin başlangıçta zaman kaybetmesine neden oldu.
  - **Performans Testlerine Daha Fazla Odaklanma:** Modüllerin fonksiyonel olarak çalışması sağlanırken, özellikle yüksek veri hacimlerinde performans testlerine yeterince zaman ayrılamadı. Bu, gelecekte potansiyel performans darboğazlarına yol açabilir.
  - **Takım Kadrosu Değişikliği:** Sprintin sonlarına doğru takım üyelerimizden birinin katılım eksikliği nedeniyle ekipten ayrılması, gelecek sprintler için mevcut takım kapasitemizi etkileyecek bir durumdur. Bu durum, takımın kalan üyeleri üzerindeki potansiyel iş yükünü artırabilir ve yeni bir denge kurulmasını gerektirebilir.


---
 
