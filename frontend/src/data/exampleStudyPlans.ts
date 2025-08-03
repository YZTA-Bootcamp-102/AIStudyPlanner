export interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'text' | 'number' | 'time';
  options?: string[];
  placeholder?: string;
  allowOther?: boolean;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const exampleStudyPlans: StudyPlan[] = [
  {
    id: 'yks-hazirlik',
    title: 'YKS Hazırlık Programı',
    description: 'Üniversite sınavına hazırlık için özelleştirilmiş, verimli çalışma programı',
    questions: [
      {
        id: 'current-grade',
        text: 'Hangi sınıftasın?',
        type: 'multiple',
        options: ['11. Sınıf', '12. Sınıf', 'Mezun'],
        allowOther: true
      },
      {
        id: 'target-department',
        text: 'Hedeflediğin bölüm nedir?',
        type: 'multiple',
        options: ['Tıp', 'Mühendislik', 'Hukuk', 'Diş Hekimliği', 'Mimarlık'],
        allowOther: true
      },
      {
        id: 'study-hours',
        text: 'Günde kaç saat çalışabilirsin?',
        type: 'number',
        placeholder: 'Örn: 6'
      },
      {
        id: 'weak-subjects',
        text: 'En çok zorlandığın dersler hangileri?',
        type: 'multiple',
        options: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Geometri', 'Türkçe', 'Tarih'],
        allowOther: true
      },
      {
        id: 'mock-exam-score',
        text: 'Son deneme sınavı puanın nedir?',
        type: 'text',
        placeholder: 'Örn: TYT: 85, AYT: 75'
      },
      {
        id: 'other-details',
        text: 'Eklemek istediğin başka detaylar var mı?',
        type: 'text',
        placeholder: 'Örn: Özel ders, dershane durumu, çalışma alışkanlıkları...'
      }
    ]
  },
  {
    id: 'dil-ogrenme',
    title: 'Dil Öğrenme Programı',
    description: 'Yabancı dil öğrenme sürecinizi hızlandıracak sistematik program',
    questions: [
      {
        id: 'target-language',
        text: 'Hangi dili öğrenmek istiyorsunuz?',
        type: 'multiple',
        options: ['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca', 'Japonca', 'Korece'],
        allowOther: true
      },
      {
        id: 'current-level',
        text: 'Mevcut dil seviyeniz nedir?',
        type: 'multiple',
        options: ['Başlangıç', 'Temel (A1-A2)', 'Orta (B1-B2)', 'İleri (C1-C2)'],
        allowOther: true
      },
      {
        id: 'learning-goal',
        text: 'Öğrenme hedefiniz nedir?',
        type: 'multiple',
        options: ['Sınav Hazırlık', 'İş/Kariyer', 'Akademik', 'Seyahat', 'Genel İletişim'],
        allowOther: true
      },
      {
        id: 'available-time',
        text: 'Günde ne kadar süre ayırabilirsiniz?',
        type: 'time',
        placeholder: 'Örn: 1 saat'
      },
      {
        id: 'target-exam',
        text: 'Hedeflediğiniz bir sınav var mı?',
        type: 'multiple',
        options: ['TOEFL', 'IELTS', 'YDS', 'TestDaF', 'DELF', 'DELE'],
        allowOther: true
      },
      {
        id: 'other-details',
        text: 'Eklemek istediğiniz başka detaylar var mı?',
        type: 'text',
        placeholder: 'Örn: Özel ders durumu, yurtdışı deneyimi...'
      }
    ]
  },
  {
    id: 'ders-calisma',
    title: 'Ders Çalışma Programı',
    description: 'Okul dersleriniz için verimli ve sistemli çalışma programı',
    questions: [
      {
        id: 'grade-level',
        text: 'Kaçıncı sınıftasın?',
        type: 'multiple',
        options: ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'],
        allowOther: true
      },
      {
        id: 'focus-subjects',
        text: 'Hangi derslere ağırlık vermek istiyorsun?',
        type: 'multiple',
        options: ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'İngilizce', 'Fizik', 'Kimya', 'Biyoloji'],
        allowOther: true
      },
      {
        id: 'study-time',
        text: 'Günde kaç saat çalışabilirsin?',
        type: 'number',
        placeholder: 'Örn: 3'
      },
      {
        id: 'learning-style',
        text: 'Nasıl öğrendiğinde daha başarılı oluyorsun?',
        type: 'multiple',
        options: ['Yazarak', 'Dinleyerek', 'Okuyarak', 'Uygulayarak', 'Video İzleyerek'],
        allowOther: true
      },
      {
        id: 'goals',
        text: 'Bu dönem hedeflediğin not ortalaması nedir?',
        type: 'text',
        placeholder: 'Örn: 90'
      },
      {
        id: 'other-details',
        text: 'Eklemek istediğin başka detaylar var mı?',
        type: 'text',
        placeholder: 'Örn: Özel ders durumu, kurs programı...'
      }
    ]
  }
];

export const customPlanTemplate: StudyPlan = {
  id: 'custom',
  title: 'Özel Çalışma Planı',
  description: 'Kendi hedeflerinize özel, kişiselleştirilmiş çalışma planı oluşturun',
  questions: [
    {
      id: 'goal-name',
      text: 'Hedefiniz için bir isim belirleyin',
      type: 'text',
      placeholder: 'Örn: Hedef 1'
    },
    {
      id: 'subject',
      text: 'Hangi konuda çalışma planı oluşturmak istiyorsunuz?',
      type: 'text',
      placeholder: 'Örn: Matematik, Yazılım, Dil öğrenimi...'
    },
    {
      id: 'duration',
      text: 'Ne kadar süre boyunca bu konuda çalışmayı planlıyorsunuz?',
      type: 'multiple',
      options: ['1 Ay', '3 Ay', '6 Ay', '1 Yıl'],
      allowOther: true
    },
    {
      id: 'daily-hours',
      text: 'Günde ortalama kaç saat ayırabilirsiniz?',
      type: 'number',
      placeholder: 'Örn: 2'
    },
    {
      id: 'learning-style',
      text: 'Tercih ettiğiniz öğrenme stili nedir?',
      type: 'multiple',
      options: ['Görsel', 'İşitsel', 'Okuyarak', 'Yazarak', 'Uygulayarak'],
      allowOther: true
    },
    {
      id: 'current-level',
      text: 'Bu konudaki mevcut seviyeniz nedir?',
      type: 'multiple',
      options: ['Başlangıç', 'Orta', 'İleri'],
      allowOther: true
    },
    {
      id: 'specific-goals',
      text: 'Bu çalışma sürecinde ulaşmak istediğiniz spesifik hedefler nelerdir?',
      type: 'text',
      placeholder: 'Örn: Belirli bir sertifika almak, bir proje tamamlamak...'
    }
  ]
}; 