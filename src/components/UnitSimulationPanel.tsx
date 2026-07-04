import { useEffect, useState } from "react";
import { getUnitMeta } from "@/data/appContent";

type LocalizedText = {
  id: string;
  en: string;
};

type MetricSet = {
  sustainability: number;
  practicality: number;
  learning: number;
};

type SimulationOption = {
  value: string;
  label: LocalizedText;
  hint: LocalizedText;
  metrics: MetricSet;
};

type SimulationControl = {
  id: string;
  label: LocalizedText;
  options: SimulationOption[];
};

type SimulationConfig = {
  title: LocalizedText;
  prompt: LocalizedText;
  facts: LocalizedText[];
  controls: SimulationControl[];
  summaries: {
    strong: LocalizedText;
    balanced: LocalizedText;
    needsWork: LocalizedText;
  };
};

const pickText = (isId: boolean, text: LocalizedText) => (isId ? text.id : text.en);

const simulationConfigs: Record<number, SimulationConfig> = {
  1: {
    title: {
      id: "Simulasi Gerobak Jamblang",
      en: "Jamblang Cart Simulation",
    },
    prompt: {
      id: "Susun pilihan kemasan yang paling masuk akal untuk pedagang pagi yang ingin tetap tradisional dan efisien.",
      en: "Build the most sensible packaging choice for a morning vendor who wants to stay traditional and efficient.",
    },
    facts: [
      { id: "Daun jati cepat terurai", en: "Teak leaves decompose quickly" },
      { id: "Plastik paling praktis, tapi berisiko tinggi", en: "Plastic is practical, but high risk" },
      { id: "Harga tetap memengaruhi pelanggan", en: "Price still affects customers" },
    ],
    controls: [
      {
        id: "packaging",
        label: { id: "Jenis kemasan", en: "Packaging type" },
        options: [
          {
            value: "teak",
            label: { id: "Daun jati", en: "Teak leaf" },
            hint: {
              id: "Pilihan ini menjaga aroma, sirkulasi udara, dan citra tradisional.",
              en: "This keeps aroma, airflow, and traditional identity.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "paper",
            label: { id: "Kertas food grade", en: "Food-grade paper" },
            hint: {
              id: "Lebih modern, tetapi nuansa khasnya berkurang.",
              en: "More modern, but less distinctive.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "plastic",
            label: { id: "Plastik tipis", en: "Thin plastic" },
            hint: {
              id: "Murah dan praktis, tapi dampak limbahnya paling berat.",
              en: "Cheap and practical, but the waste impact is heaviest.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 1 },
          },
        ],
      },
      {
        id: "sourcing",
        label: { id: "Sumber bahan", en: "Material source" },
        options: [
          {
            value: "local",
            label: { id: "Petani lokal", en: "Local growers" },
            hint: {
              id: "Pasokan lokal memperkuat rantai pendek dan cerita produk.",
              en: "Local sourcing strengthens short supply chains and product storytelling.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "mixed",
            label: { id: "Campuran pasar", en: "Mixed market supply" },
            hint: {
              id: "Masih aman, tetapi konsistensi kualitas bisa naik turun.",
              en: "Still workable, but quality consistency may vary.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "bulk",
            label: { id: "Stok massal", en: "Bulk stock" },
            hint: {
              id: "Mudah didapat, tetapi nilai lokalnya makin tipis.",
              en: "Easy to get, but the local value becomes thinner.",
            },
            metrics: { sustainability: 2, practicality: 4, learning: 2 },
          },
        ],
      },
      {
        id: "pricing",
        label: { id: "Strategi harga", en: "Pricing strategy" },
        options: [
          {
            value: "fair",
            label: { id: "Harga pas", en: "Fair price" },
            hint: {
              id: "Menjaga keterjangkauan tanpa mengorbankan kualitas utama.",
              en: "Keeps products affordable without sacrificing core quality.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "premium",
            label: { id: "Sedikit premium", en: "Slightly premium" },
            hint: {
              id: "Bisa menutup biaya bahan alami jika komunikasinya jelas.",
              en: "Can cover natural material costs if the message is clear.",
            },
            metrics: { sustainability: 4, practicality: 3, learning: 4 },
          },
          {
            value: "lowest",
            label: { id: "Paling murah", en: "Lowest price" },
            hint: {
              id: "Cepat menarik pembeli, tapi rawan mendorong pilihan kemasan yang buruk.",
              en: "Attracts buyers fast, but can push poor packaging choices.",
            },
            metrics: { sustainability: 2, practicality: 4, learning: 2 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Racikanmu terasa realistis: tradisi tetap kuat, operasional masih masuk akal, dan dampak lingkungannya rendah.",
        en: "Your mix feels realistic: tradition stays strong, operations remain practical, and the environmental impact stays low.",
      },
      balanced: {
        id: "Pilihanmu sudah cukup aman, tetapi masih ada kompromi antara biaya, identitas budaya, dan keberlanjutan.",
        en: "Your choices are fairly safe, but there is still a trade-off between cost, cultural identity, and sustainability.",
      },
      needsWork: {
        id: "Skema ini terlalu menekan sisi lingkungan atau nilai tradisi. Coba ubah kemasan atau sumber bahan.",
        en: "This setup puts too much pressure on sustainability or tradition. Try changing the packaging or material source.",
      },
    },
  },
  2: {
    title: {
      id: "Simulasi Dapur Terasi",
      en: "Shrimp Paste Workshop",
    },
    prompt: {
      id: "Atur proses fermentasi supaya aman, gurih, dan tetap menghargai kondisi laut pesisir.",
      en: "Set the fermentation process so it stays safe, savory, and respectful to the coastal ecosystem.",
    },
    facts: [
      { id: "Fermentasi menekan bakteri berbahaya", en: "Fermentation reduces harmful bacteria" },
      { id: "Garam dan kebersihan sangat menentukan", en: "Salt and hygiene matter a lot" },
      { id: "Ketersediaan rebon bergantung pada laut sehat", en: "Rebon shrimp depend on a healthy sea" },
    ],
    controls: [
      {
        id: "salt",
        label: { id: "Kadar garam", en: "Salt level" },
        options: [
          {
            value: "ideal",
            label: { id: "Pas", en: "Balanced" },
            hint: {
              id: "Kadar garam yang tepat membantu keamanan sekaligus menjaga fermentasi berjalan stabil.",
              en: "The right salt level supports safety while keeping fermentation stable.",
            },
            metrics: { sustainability: 4, practicality: 5, learning: 5 },
          },
          {
            value: "low",
            label: { id: "Terlalu rendah", en: "Too low" },
            hint: {
              id: "Rasa bisa ringan, tetapi risiko mikroba berbahaya meningkat.",
              en: "Flavor may be lighter, but harmful microbes become more risky.",
            },
            metrics: { sustainability: 2, practicality: 3, learning: 2 },
          },
          {
            value: "high",
            label: { id: "Terlalu tinggi", en: "Too high" },
            hint: {
              id: "Lebih aman, tapi karakter rasa bisa jadi terlalu tajam.",
              en: "Safer, but the flavor may become too harsh.",
            },
            metrics: { sustainability: 3, practicality: 3, learning: 3 },
          },
        ],
      },
      {
        id: "drying",
        label: { id: "Penjemuran", en: "Drying" },
        options: [
          {
            value: "steady",
            label: { id: "Cukup dan merata", en: "Steady and even" },
            hint: {
              id: "Pengeringan yang stabil membantu hasil fermentasi lebih konsisten.",
              en: "Stable drying helps fermentation results stay consistent.",
            },
            metrics: { sustainability: 4, practicality: 4, learning: 5 },
          },
          {
            value: "short",
            label: { id: "Terlalu singkat", en: "Too short" },
            hint: {
              id: "Proses jadi cepat, tetapi keamanan dan rasa bisa belum matang.",
              en: "The process becomes faster, but safety and flavor may stay underdeveloped.",
            },
            metrics: { sustainability: 2, practicality: 4, learning: 2 },
          },
          {
            value: "long",
            label: { id: "Terlalu lama", en: "Too long" },
            hint: {
              id: "Mutu bisa turun jika panas dan kelembapan tidak terkontrol.",
              en: "Quality can drop if heat and humidity are not controlled.",
            },
            metrics: { sustainability: 3, practicality: 2, learning: 3 },
          },
        ],
      },
      {
        id: "catching",
        label: { id: "Pola tangkap udang", en: "Shrimp harvesting" },
        options: [
          {
            value: "responsible",
            label: { id: "Bijak dan musiman", en: "Responsible and seasonal" },
            hint: {
              id: "Stok bahan baku lebih lestari untuk produksi jangka panjang.",
              en: "The raw material stock stays healthier for long-term production.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "normal",
            label: { id: "Biasa", en: "Standard" },
            hint: {
              id: "Masih berjalan, tetapi belum memberi perlindungan kuat pada populasi rebon.",
              en: "Still workable, but not strongly protective of shrimp populations.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "intensive",
            label: { id: "Sangat intensif", en: "Highly intensive" },
            hint: {
              id: "Produksi naik cepat, tapi tekanan pada ekosistem pesisir ikut melonjak.",
              en: "Production rises quickly, but pressure on coastal ecosystems also climbs.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 2 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Batch ini paling meyakinkan: rasa, keamanan, dan keberlanjutan bahan baku saling mendukung.",
        en: "This batch feels strongest: flavor, safety, and source sustainability support each other.",
      },
      balanced: {
        id: "Sudah cukup baik, tetapi salah satu tahap proses masih bisa mengganggu mutu atau stok bahan baku.",
        en: "This is fairly good, but one stage may still weaken quality or raw material availability.",
      },
      needsWork: {
        id: "Skema ini terlalu berisiko. Coba benahi kadar garam, pengeringan, atau pola tangkap udang.",
        en: "This setup is too risky. Try improving the salt level, drying, or shrimp harvesting pattern.",
      },
    },
  },
  3: {
    title: {
      id: "Simulasi Dapur Empal Gentong",
      en: "Empal Gentong Kitchen Lab",
    },
    prompt: {
      id: "Atur alat dan cara memasak untuk mencari titik tengah antara rasa, energi, dan tradisi.",
      en: "Tune the cookware and cooking style to find a middle point between flavor, energy, and tradition.",
    },
    facts: [
      { id: "Tanah liat menahan panas lebih baik", en: "Clay retains heat better" },
      { id: "Api terlalu besar bikin boros", en: "Too much heat wastes energy" },
      { id: "Masak pelan sering lebih stabil", en: "Slow cooking is often more stable" },
    ],
    controls: [
      {
        id: "pot",
        label: { id: "Jenis wadah", en: "Cookware" },
        options: [
          {
            value: "clay",
            label: { id: "Gentong tanah liat", en: "Clay pot" },
            hint: {
              id: "Retensi panasnya tinggi dan karakter masak tradisionalnya tetap terasa.",
              en: "Heat retention is high and the traditional cooking feel stays intact.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "hybrid",
            label: { id: "Panci tebal", en: "Heavy pot" },
            hint: {
              id: "Masih cukup efisien, tetapi konteks tradisionalnya berkurang.",
              en: "Still fairly efficient, but less rooted in tradition.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "thin",
            label: { id: "Panci tipis", en: "Thin metal pot" },
            hint: {
              id: "Cepat panas, namun lebih mudah kehilangan panas kembali.",
              en: "Heats up fast, but loses heat more easily.",
            },
            metrics: { sustainability: 2, practicality: 4, learning: 2 },
          },
        ],
      },
      {
        id: "heat",
        label: { id: "Besar panas", en: "Heat level" },
        options: [
          {
            value: "steady",
            label: { id: "Sedang dan stabil", en: "Steady medium" },
            hint: {
              id: "Panas stabil membantu kuah matang merata tanpa terlalu boros.",
              en: "Steady heat helps the broth cook evenly without wasting too much energy.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "high",
            label: { id: "Tinggi", en: "High" },
            hint: {
              id: "Waktu masak terasa cepat, tetapi energi yang terpakai naik.",
              en: "Cooking feels faster, but energy use increases.",
            },
            metrics: { sustainability: 2, practicality: 4, learning: 2 },
          },
          {
            value: "low",
            label: { id: "Terlalu kecil", en: "Too low" },
            hint: {
              id: "Bisa hemat, tetapi prosesnya berisiko terlalu lama.",
              en: "It may save energy, but the process risks becoming too slow.",
            },
            metrics: { sustainability: 3, practicality: 2, learning: 3 },
          },
        ],
      },
      {
        id: "batch",
        label: { id: "Skala masak", en: "Batch size" },
        options: [
          {
            value: "planned",
            label: { id: "Sesuai kebutuhan", en: "Planned batch" },
            hint: {
              id: "Jumlah produksi pas membantu menekan pemborosan energi dan bahan.",
              en: "A planned batch helps reduce wasted energy and ingredients.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "large",
            label: { id: "Besar", en: "Large batch" },
            hint: {
              id: "Efisien untuk ramai pembeli, tetapi rawan sisa jika prediksi meleset.",
              en: "Efficient for crowds, but risky if demand is overestimated.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "small",
            label: { id: "Kecil", en: "Small batch" },
            hint: {
              id: "Minim sisa, tapi perlu pemanasan ulang lebih sering.",
              en: "Reduces leftovers, but requires more reheating.",
            },
            metrics: { sustainability: 3, practicality: 3, learning: 3 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Pilihanmu enak dibayangkan di dapur sungguhan: rasa, efisiensi panas, dan nilai tradisi saling menguatkan.",
        en: "Your choices feel right for a real kitchen: flavor, heat efficiency, and tradition reinforce each other.",
      },
      balanced: {
        id: "Masih cukup masuk akal, tetapi ada bagian yang membuat proses memasak kurang stabil atau kurang hemat.",
        en: "Still sensible, but one part makes the cooking process less stable or less efficient.",
      },
      needsWork: {
        id: "Kombinasi ini belum optimal. Coba perbaiki jenis wadah atau besar panasnya.",
        en: "This combination is not optimal yet. Try improving the cookware or heat level.",
      },
    },
  },
  4: {
    title: {
      id: "Simulasi Goreng Kerupuk Melarat",
      en: "Kerupuk Melarat Frying Simulation",
    },
    prompt: {
      id: "Pilih cara produksi yang menjaga kerenyahan tanpa membuat proses jadi boros.",
      en: "Choose a production style that keeps the crackers crisp without making the process wasteful.",
    },
    facts: [
      { id: "Pasir bisa dipakai ulang", en: "Sand can be reused" },
      { id: "Goreng minyak menaikkan lemak", en: "Oil frying raises fat content" },
      { id: "Suhu berpengaruh ke kerenyahan", en: "Temperature affects crispness" },
    ],
    controls: [
      {
        id: "medium",
        label: { id: "Media goreng", en: "Frying medium" },
        options: [
          {
            value: "sand",
            label: { id: "Pasir panas", en: "Hot sand" },
            hint: {
              id: "Khas, hemat minyak, dan tetap kuat sebagai identitas lokal.",
              en: "Distinctive, oil-saving, and strong as a local identity marker.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "mixed",
            label: { id: "Pasir + sedikit minyak", en: "Sand + a little oil" },
            hint: {
              id: "Jalan tengah yang masih menarik, walau tidak sebersih metode asli.",
              en: "A middle path that still works, though it is not as clean as the original method.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "oil",
            label: { id: "Minyak penuh", en: "Full oil frying" },
            hint: {
              id: "Praktis untuk sebagian dapur, tapi meninggalkan jejak lemak dan limbah lebih tinggi.",
              en: "Practical for some kitchens, but leaves a higher fat and waste footprint.",
            },
            metrics: { sustainability: 1, practicality: 4, learning: 1 },
          },
        ],
      },
      {
        id: "temperature",
        label: { id: "Suhu kerja", en: "Working temperature" },
        options: [
          {
            value: "controlled",
            label: { id: "Stabil", en: "Controlled" },
            hint: {
              id: "Suhu stabil memberi hasil renyah lebih konsisten.",
              en: "Stable heat gives more consistent crispness.",
            },
            metrics: { sustainability: 4, practicality: 5, learning: 5 },
          },
          {
            value: "too-hot",
            label: { id: "Terlalu panas", en: "Too hot" },
            hint: {
              id: "Cepat matang, tetapi risiko gosong dan boros energi naik.",
              en: "Cooks fast, but the risk of burning and wasting energy rises.",
            },
            metrics: { sustainability: 2, practicality: 3, learning: 2 },
          },
          {
            value: "too-low",
            label: { id: "Kurang panas", en: "Too low" },
            hint: {
              id: "Proses lebih lama dan kerenyahannya bisa tidak merata.",
              en: "The process takes longer and crispness may become uneven.",
            },
            metrics: { sustainability: 3, practicality: 2, learning: 3 },
          },
        ],
      },
      {
        id: "reuse",
        label: { id: "Pengelolaan bahan", en: "Material handling" },
        options: [
          {
            value: "clean-reuse",
            label: { id: "Disaring dan dipakai ulang", en: "Filtered and reused" },
            hint: {
              id: "Cara ini paling hemat dan rapi untuk produksi berulang.",
              en: "This is the most efficient and tidy approach for repeated production.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "limited",
            label: { id: "Dipakai ulang terbatas", en: "Limited reuse" },
            hint: {
              id: "Masih cukup baik, tetapi belum maksimal menekan limbah.",
              en: "Still fairly good, but not the strongest at reducing waste.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "discard",
            label: { id: "Langsung dibuang", en: "Discarded immediately" },
            hint: {
              id: "Mudah dikelola, namun kurang efisien untuk jangka panjang.",
              en: "Easy to handle, but inefficient over time.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 2 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Setelan ini paling terasa seperti produksi kerupuk melarat yang cerdas: renyah, hemat, dan tetap khas.",
        en: "This setup feels smartest for kerupuk melarat: crisp, efficient, and still distinctive.",
      },
      balanced: {
        id: "Hasilnya masih oke, tetapi ada satu keputusan yang membuat proses kurang hemat atau kurang konsisten.",
        en: "The result is still okay, but one decision makes the process less efficient or less consistent.",
      },
      needsWork: {
        id: "Kombinasi ini membuat produksi mudah boros atau kurang sehat. Coba ubah media goreng dan pengelolaan bahan.",
        en: "This combination can make production wasteful or less healthy. Try changing the frying medium and material handling.",
      },
    },
  },
  5: {
    title: {
      id: "Simulasi Tape Ketan Bakung",
      en: "Tape Ketan Bakung Simulation",
    },
    prompt: {
      id: "Rancang proses fermentasi yang bikin tape tetap wangi, aman, dan minim sampah.",
      en: "Design a fermentation process that keeps tape fragrant, safe, and low-waste.",
    },
    facts: [
      { id: "Suhu 25–30°C cenderung ideal", en: "25–30°C tends to be ideal" },
      { id: "Kemasan daun bantu kurangi plastik", en: "Leaf packaging reduces plastic" },
      { id: "Fermentasi terlalu lama bikin terlalu asam", en: "Too much fermentation makes it too sour" },
    ],
    controls: [
      {
        id: "temperature",
        label: { id: "Suhu fermentasi", en: "Fermentation temperature" },
        options: [
          {
            value: "ideal",
            label: { id: "Hangat stabil", en: "Steady warm" },
            hint: {
              id: "Kondisi ini paling mendukung mikroba bekerja seimbang.",
              en: "This condition best supports balanced microbial activity.",
            },
            metrics: { sustainability: 4, practicality: 5, learning: 5 },
          },
          {
            value: "cold",
            label: { id: "Terlalu dingin", en: "Too cool" },
            hint: {
              id: "Fermentasi lambat dan rasa bisa kurang berkembang.",
              en: "Fermentation slows down and flavor may stay underdeveloped.",
            },
            metrics: { sustainability: 3, practicality: 2, learning: 2 },
          },
          {
            value: "hot",
            label: { id: "Terlalu panas", en: "Too warm" },
            hint: {
              id: "Proses cepat, tetapi kualitas bisa tidak stabil.",
              en: "The process becomes fast, but quality can turn unstable.",
            },
            metrics: { sustainability: 2, practicality: 3, learning: 2 },
          },
        ],
      },
      {
        id: "duration",
        label: { id: "Lama fermentasi", en: "Fermentation time" },
        options: [
          {
            value: "24-48",
            label: { id: "24-48 jam", en: "24-48 hours" },
            hint: {
              id: "Ini rentang yang paling aman untuk rasa dan tekstur.",
              en: "This is the safest range for flavor and texture.",
            },
            metrics: { sustainability: 4, practicality: 5, learning: 5 },
          },
          {
            value: "too-short",
            label: { id: "Kurang dari 24 jam", en: "Under 24 hours" },
            hint: {
              id: "Aroma belum terbentuk penuh.",
              en: "The aroma has not fully developed yet.",
            },
            metrics: { sustainability: 3, practicality: 3, learning: 2 },
          },
          {
            value: "too-long",
            label: { id: "Lebih dari 48 jam", en: "Over 48 hours" },
            hint: {
              id: "Produk berisiko terlalu asam dan cepat ditolak pembeli.",
              en: "The product risks becoming too sour and less appealing to buyers.",
            },
            metrics: { sustainability: 2, practicality: 2, learning: 2 },
          },
        ],
      },
      {
        id: "wrap",
        label: { id: "Kemasan", en: "Packaging" },
        options: [
          {
            value: "leaf",
            label: { id: "Daun alami", en: "Natural leaf" },
            hint: {
              id: "Pilihan paling nyambung dengan karakter tape tradisional.",
              en: "This choice fits the traditional character of tape best.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "paper",
            label: { id: "Kertas", en: "Paper" },
            hint: {
              id: "Masih cukup baik, walau sensasi tradisionalnya tidak sekuat daun.",
              en: "Still fairly good, though the traditional feel is weaker than leaf wrapping.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "plastic",
            label: { id: "Plastik", en: "Plastic" },
            hint: {
              id: "Mudah, tetapi paling lemah untuk sisi keberlanjutan.",
              en: "Easy to use, but the weakest option for sustainability.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Racikanmu terasa matang: fermentasinya pas, kemasannya cocok, dan limbahnya tetap rendah.",
        en: "Your setup feels mature: fermentation is on point, packaging fits well, and waste stays low.",
      },
      balanced: {
        id: "Sudah cukup rapi, tapi ada keputusan yang membuat mutu tape atau jejak lingkungannya kurang maksimal.",
        en: "This is fairly tidy, but one decision still weakens tape quality or environmental performance.",
      },
      needsWork: {
        id: "Skema ini perlu diulang. Coba perbaiki lama fermentasi atau pilih kemasan yang lebih alami.",
        en: "This setup needs another pass. Try adjusting the fermentation time or choosing more natural packaging.",
      },
    },
  },
  6: {
    title: {
      id: "Simulasi Pesisir Mangrove",
      en: "Mangrove Coast Simulation",
    },
    prompt: {
      id: "Tentukan strategi pesisir yang paling kuat untuk menahan abrasi dan tetap menghidupi warga.",
      en: "Choose the coastal strategy that best resists erosion while still supporting the local community.",
    },
    facts: [
      { id: "Mangrove redam energi gelombang", en: "Mangroves reduce wave energy" },
      { id: "Akar mangrove menjebak sedimen", en: "Mangrove roots trap sediment" },
      { id: "Tutupan tinggi dukung ikan dan kepiting", en: "Higher cover supports fish and crabs" },
    ],
    controls: [
      {
        id: "cover",
        label: { id: "Tutupan mangrove", en: "Mangrove cover" },
        options: [
          {
            value: "high",
            label: { id: "Diperluas", en: "Expanded cover" },
            hint: {
              id: "Tutupan yang luas paling kuat menahan abrasi dan banjir pesisir.",
              en: "Wider cover is strongest against erosion and coastal flooding.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "medium",
            label: { id: "Dipertahankan", en: "Maintained" },
            hint: {
              id: "Masih cukup baik, asalkan tidak terus berkurang.",
              en: "Still fairly good, as long as it does not keep shrinking.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "low",
            label: { id: "Berkurang", en: "Reduced cover" },
            hint: {
              id: "Risiko abrasi dan kehilangan habitat meningkat.",
              en: "The risk of erosion and habitat loss increases.",
            },
            metrics: { sustainability: 1, practicality: 2, learning: 1 },
          },
        ],
      },
      {
        id: "community",
        label: { id: "Peran warga", en: "Community role" },
        options: [
          {
            value: "active",
            label: { id: "Aktif menanam dan merawat", en: "Active care and planting" },
            hint: {
              id: "Keterlibatan warga membuat perlindungan pesisir lebih tahan lama.",
              en: "Community involvement makes coastal protection more durable.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "limited",
            label: { id: "Sekadar ikut program", en: "Minimal participation" },
            hint: {
              id: "Masih membantu, tetapi dampaknya tidak terlalu dalam.",
              en: "It still helps, but the effect is not very deep.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "none",
            label: { id: "Pasif", en: "Passive" },
            hint: {
              id: "Tanpa dukungan warga, rehabilitasi mudah berhenti di tengah jalan.",
              en: "Without community support, rehabilitation often stalls.",
            },
            metrics: { sustainability: 1, practicality: 2, learning: 2 },
          },
        ],
      },
      {
        id: "shoreUse",
        label: { id: "Pemanfaatan pesisir", en: "Coastal use" },
        options: [
          {
            value: "zoned",
            label: { id: "Zonasi hati-hati", en: "Careful zoning" },
            hint: {
              id: "Kegiatan ekonomi tetap jalan, tapi area inti pesisir terlindungi.",
              en: "Economic activity continues, but core coastal areas stay protected.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "mixed",
            label: { id: "Campuran tanpa aturan kuat", en: "Loose mixed use" },
            hint: {
              id: "Bisa berjalan sebentar, tetapi tekanan ke pesisir sulit dikendalikan.",
              en: "It may work for a while, but coastal pressure becomes hard to control.",
            },
            metrics: { sustainability: 2, practicality: 3, learning: 2 },
          },
          {
            value: "exploitative",
            label: { id: "Eksploitasi cepat", en: "Rapid exploitation" },
            hint: {
              id: "Untung jangka pendek naik, namun fungsi ekosistem turun tajam.",
              en: "Short-term gains rise, but ecosystem function drops sharply.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Desainmu paling kuat untuk pesisir: perlindungan alam, ekonomi warga, dan masa depan perikanan bisa jalan bareng.",
        en: "Your design is strongest for the coast: ecological protection, local livelihoods, and future fisheries can move together.",
      },
      balanced: {
        id: "Arahmu sudah benar, tetapi masih ada celah yang bisa mempercepat abrasi atau mengurangi hasil perikanan.",
        en: "Your direction is good, but there is still a gap that may speed up erosion or weaken fisheries.",
      },
      needsWork: {
        id: "Strategi ini terlalu rapuh untuk pesisir. Coba naikkan tutupan mangrove dan peran warga.",
        en: "This strategy is too fragile for the coast. Try increasing mangrove cover and community involvement.",
      },
    },
  },
  7: {
    title: {
      id: "Simulasi Kampung Nadran",
      en: "Nadran Community Simulation",
    },
    prompt: {
      id: "Padukan tradisi syukuran laut dengan praktik yang benar-benar menjaga ekosistem.",
      en: "Combine the sea thanksgiving tradition with practices that genuinely protect the marine ecosystem.",
    },
    facts: [
      { id: "Tradisi bisa menguatkan kepedulian", en: "Tradition can strengthen awareness" },
      { id: "Pengelolaan limbah memengaruhi kualitas air", en: "Waste handling affects water quality" },
      { id: "Penangkapan bijak bantu stok ikan", en: "Responsible fishing supports fish stocks" },
    ],
    controls: [
      {
        id: "festival",
        label: { id: "Format acara", en: "Festival format" },
        options: [
          {
            value: "educative",
            label: { id: "Ritual + edukasi laut", en: "Ritual + marine education" },
            hint: {
              id: "Perayaan jadi lebih hidup dan pesannya nyambung ke aksi nyata.",
              en: "The celebration becomes richer and its message connects to real action.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "ritual-only",
            label: { id: "Ritual saja", en: "Ritual only" },
            hint: {
              id: "Tradisinya kuat, tetapi dampak perubahan perilakunya lebih terbatas.",
              en: "The tradition stays strong, but behavior change is more limited.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "show",
            label: { id: "Sekadar hiburan", en: "Entertainment only" },
            hint: {
              id: "Ramai, tetapi isi pesannya cepat hilang.",
              en: "Crowded and lively, but the message fades quickly.",
            },
            metrics: { sustainability: 1, practicality: 4, learning: 1 },
          },
        ],
      },
      {
        id: "fishing",
        label: { id: "Aturan tangkap", en: "Fishing practice" },
        options: [
          {
            value: "responsible",
            label: { id: "Alat tangkap bijak", en: "Responsible gear" },
            hint: {
              id: "Stok ikan dan habitat laut lebih aman dalam jangka panjang.",
              en: "Fish stocks and marine habitats stay safer in the long term.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "mixed",
            label: { id: "Campuran", en: "Mixed practice" },
            hint: {
              id: "Sebagian baik, tetapi belum cukup rapi untuk menjaga populasi ikan.",
              en: "Partly good, but not organized enough to protect fish populations.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "exploitative",
            label: { id: "Tangkapan berlebihan", en: "Overfishing" },
            hint: {
              id: "Hasil sesaat bisa naik, tapi laut cepat kehilangan daya pulih.",
              en: "Short-term catches may rise, but the sea quickly loses resilience.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 1 },
          },
        ],
      },
      {
        id: "waste",
        label: { id: "Limbah pesisir", en: "Coastal waste" },
        options: [
          {
            value: "managed",
            label: { id: "Dikelola bersama", en: "Managed together" },
            hint: {
              id: "Pantai lebih bersih dan pesan syukur terasa konsisten.",
              en: "The coast stays cleaner and the gratitude message feels consistent.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "partial",
            label: { id: "Sebagian terkelola", en: "Partially managed" },
            hint: {
              id: "Membantu, tapi kualitas air masih bisa terganggu.",
              en: "Helpful, but water quality can still be disturbed.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "ignored",
            label: { id: "Diabaikan", en: "Ignored" },
            hint: {
              id: "Acara kehilangan makna saat sampah tetap mencemari laut.",
              en: "The event loses meaning when waste still pollutes the sea.",
            },
            metrics: { sustainability: 1, practicality: 2, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Format Nadran ini terasa paling hidup: budaya dijaga, warga terlibat, dan laut ikut terlindungi.",
        en: "This Nadran format feels most alive: culture is preserved, the community is involved, and the sea is better protected.",
      },
      balanced: {
        id: "Tradisinya masih terasa, tapi ada sisi pengelolaan laut yang belum sepenuhnya kuat.",
        en: "The tradition still feels present, but one side of marine stewardship is not fully strong yet.",
      },
      needsWork: {
        id: "Versi ini terlalu dangkal untuk menjaga laut. Coba benahi aturan tangkap atau pengelolaan limbah.",
        en: "This version is too weak to protect the sea. Try improving fishing rules or waste management.",
      },
    },
  },
  8: {
    title: {
      id: "Simulasi Bengkel Rotan",
      en: "Rattan Workshop Simulation",
    },
    prompt: {
      id: "Atur panen, penanaman, dan limbah produksi supaya industri rotan tetap jalan lama.",
      en: "Set harvesting, replanting, and production waste handling so the rattan industry can last longer.",
    },
    facts: [
      { id: "Panen berlebih tekan biodiversitas", en: "Overharvesting pressures biodiversity" },
      { id: "Penanaman ulang kunci pasokan", en: "Replanting is key to supply" },
      { id: "Limbah bisa jadi nilai tambah", en: "Waste can become added value" },
    ],
    controls: [
      {
        id: "harvest",
        label: { id: "Tingkat panen", en: "Harvest rate" },
        options: [
          {
            value: "balanced",
            label: { id: "Seimbang", en: "Balanced" },
            hint: {
              id: "Pasokan tetap ada tanpa menekan hutan terlalu keras.",
              en: "Supply stays available without putting too much stress on the forest.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "low",
            label: { id: "Rendah", en: "Low" },
            hint: {
              id: "Aman untuk hutan, tetapi kapasitas usaha bisa terbatas.",
              en: "Safe for the forest, but business capacity may stay limited.",
            },
            metrics: { sustainability: 4, practicality: 2, learning: 3 },
          },
          {
            value: "high",
            label: { id: "Terlalu tinggi", en: "Too high" },
            hint: {
              id: "Pesanan bisa dikejar cepat, tetapi risiko kerusakan hutan ikut naik.",
              en: "Orders can be met fast, but forest damage risk also rises.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 1 },
          },
        ],
      },
      {
        id: "replant",
        label: { id: "Penanaman kembali", en: "Replanting" },
        options: [
          {
            value: "active",
            label: { id: "Aktif", en: "Active" },
            hint: {
              id: "Ini penyangga utama agar bahan baku tidak cepat habis.",
              en: "This is the main buffer that prevents raw materials from running out too quickly.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "seasonal",
            label: { id: "Musiman", en: "Seasonal" },
            hint: {
              id: "Masih membantu, tetapi belum cukup jika panen terus tinggi.",
              en: "Still helps, but not enough if harvesting stays high.",
            },
            metrics: { sustainability: 3, practicality: 3, learning: 3 },
          },
          {
            value: "none",
            label: { id: "Tidak ada", en: "None" },
            hint: {
              id: "Bengkel mungkin sibuk sekarang, namun stok masa depan rapuh.",
              en: "The workshop may stay busy now, but future supply becomes fragile.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 1 },
          },
        ],
      },
      {
        id: "waste",
        label: { id: "Sisa produksi", en: "Production waste" },
        options: [
          {
            value: "reuse",
            label: { id: "Diolah jadi produk kecil", en: "Turned into small products" },
            hint: {
              id: "Sisa rotan bisa jadi aksen, suvenir, atau bahan pelengkap.",
              en: "Rattan leftovers can become accents, souvenirs, or secondary materials.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "partial",
            label: { id: "Dipilah sebagian", en: "Partially sorted" },
            hint: {
              id: "Masih cukup baik, tetapi nilai tambahnya belum maksimal.",
              en: "Still fairly good, but the added value is not maximized.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "dump",
            label: { id: "Langsung dibuang", en: "Thrown away" },
            hint: {
              id: "Cepat selesai, tapi peluang ekonomi dan efisiensinya hilang.",
              en: "Quick to handle, but the economic and efficiency opportunity disappears.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Bengkelmu terasa siap jangka panjang: pasokan, hutan, dan nilai tambah produksi bisa sama-sama tumbuh.",
        en: "Your workshop feels built for the long run: supply, forests, and product value can grow together.",
      },
      balanced: {
        id: "Masih aman, tetapi ada keputusan yang bisa bikin usaha atau hutan sama-sama cepat lelah.",
        en: "Still safe enough, but one decision may tire out either the business or the forest too quickly.",
      },
      needsWork: {
        id: "Skema ini terlalu agresif atau terlalu boros. Coba turunkan panen atau aktifkan penanaman kembali.",
        en: "This setup is too aggressive or too wasteful. Try lowering harvest pressure or adding replanting.",
      },
    },
  },
  9: {
    title: {
      id: "Simulasi Produksi Batik Trusmi",
      en: "Batik Trusmi Production Simulation",
    },
    prompt: {
      id: "Susun proses batik yang tetap layak produksi tapi tidak membebani sungai.",
      en: "Arrange a batik process that stays productive without overloading the river.",
    },
    facts: [
      { id: "Pewarna sintetis cenderung berisiko tinggi", en: "Synthetic dyes tend to be higher risk" },
      { id: "Pengolahan limbah sangat menentukan", en: "Wastewater treatment is critical" },
      { id: "Hemat air bantu tekan beban pencemaran", en: "Water efficiency lowers pollution pressure" },
    ],
    controls: [
      {
        id: "dye",
        label: { id: "Jenis pewarna", en: "Dye type" },
        options: [
          {
            value: "natural",
            label: { id: "Alami", en: "Natural" },
            hint: {
              id: "Bukan berarti bebas risiko, tetapi beban kimianya cenderung lebih ringan jika dikelola baik.",
              en: "It is not risk-free, but its chemical load is usually lighter when handled well.",
            },
            metrics: { sustainability: 4, practicality: 3, learning: 5 },
          },
          {
            value: "hybrid",
            label: { id: "Campuran", en: "Hybrid" },
            hint: {
              id: "Bisa menjaga warna tertentu, tetapi tetap perlu kontrol limbah ketat.",
              en: "Can maintain certain colors, but still needs tight wastewater control.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "synthetic",
            label: { id: "Sintetis penuh", en: "Fully synthetic" },
            hint: {
              id: "Warna kuat dan konsisten, namun tekanan ke perairan lebih berat.",
              en: "Color stays strong and consistent, but water pressure becomes heavier.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 2 },
          },
        ],
      },
      {
        id: "treatment",
        label: { id: "Pengolahan limbah", en: "Wastewater treatment" },
        options: [
          {
            value: "full",
            label: { id: "Penuh", en: "Full treatment" },
            hint: {
              id: "Pilihan paling kuat untuk menjaga kualitas air sekitar produksi.",
              en: "This is the strongest option for protecting surrounding water quality.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "partial",
            label: { id: "Sebagian", en: "Partial treatment" },
            hint: {
              id: "Sudah membantu, tetapi beberapa residu masih bisa lolos.",
              en: "Helpful, but some residues may still pass through.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "none",
            label: { id: "Tidak ada", en: "None" },
            hint: {
              id: "Produksi terasa ringan di awal, tetapi risiko ekologinya paling besar.",
              en: "Production feels simpler at first, but ecological risk is highest.",
            },
            metrics: { sustainability: 1, practicality: 5, learning: 1 },
          },
        ],
      },
      {
        id: "water",
        label: { id: "Pemakaian air", en: "Water use" },
        options: [
          {
            value: "efficient",
            label: { id: "Hemat air", en: "Efficient use" },
            hint: {
              id: "Semakin sedikit air terpakai, semakin kecil beban limbah yang harus diolah.",
              en: "The less water used, the smaller the wastewater load to treat.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 4 },
          },
          {
            value: "standard",
            label: { id: "Biasa", en: "Standard use" },
            hint: {
              id: "Masih bisa diterima jika pengolahan limbahnya kuat.",
              en: "Still acceptable if wastewater treatment is strong.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "wasteful",
            label: { id: "Boros", en: "Wasteful" },
            hint: {
              id: "Beban pencemaran naik dan biaya air ikut membengkak.",
              en: "Pollution load rises and water costs also grow.",
            },
            metrics: { sustainability: 1, practicality: 2, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Rancangan ini terasa paling sehat untuk industri batik: produksi jalan, warna tetap terjaga, dan sungai lebih aman.",
        en: "This plan feels healthiest for the batik industry: production continues, colors stay reliable, and the river is safer.",
      },
      balanced: {
        id: "Masih cukup seimbang, tetapi ada bagian yang bisa menaikkan beban limbah atau biaya produksi.",
        en: "Still reasonably balanced, but one part may raise wastewater pressure or production costs.",
      },
      needsWork: {
        id: "Skema ini terlalu berat untuk perairan sekitar. Coba perbaiki pengolahan limbah atau pemakaian air.",
        en: "This setup is too heavy for nearby waterways. Try improving wastewater treatment or water use.",
      },
    },
  },
  10: {
    title: {
      id: "Simulasi Warung Tahu Gejrot",
      en: "Tahu Gejrot Stall Simulation",
    },
    prompt: {
      id: "Pilih desain warung yang bikin tahu gejrot tetap lokal, terjangkau, dan tidak meninggalkan limbah berat.",
      en: "Choose a stall design that keeps tahu gejrot local, affordable, and low in waste.",
    },
    facts: [
      { id: "Protein nabati cenderung lebih ringan tekanannya", en: "Plant-based protein tends to have a lighter footprint" },
      { id: "Bahan lokal bantu rantai pasok pendek", en: "Local ingredients support shorter supply chains" },
      { id: "Limbah cair tahu wajib diolah", en: "Tofu wastewater needs treatment" },
    ],
    controls: [
      {
        id: "protein",
        label: { id: "Sumber protein utama", en: "Main protein source" },
        options: [
          {
            value: "plant",
            label: { id: "Nabati", en: "Plant-based" },
            hint: {
              id: "Pilihan ini paling cocok dengan tema tahu gejrot dan umumnya lebih ringan tekanannya.",
              en: "This option best matches tahu gejrot and generally carries a lighter footprint.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "mixed",
            label: { id: "Campuran", en: "Mixed" },
            hint: {
              id: "Bisa memperluas menu, tetapi jejak sumber dayanya ikut naik.",
              en: "It can broaden the menu, but the resource footprint also rises.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "animal",
            label: { id: "Hewani dominan", en: "Mostly animal-based" },
            hint: {
              id: "Kurang selaras dengan karakter lokal tahu gejrot dan menambah tekanan lingkungan.",
              en: "Less aligned with tahu gejrot's local identity and adds environmental pressure.",
            },
            metrics: { sustainability: 1, practicality: 4, learning: 1 },
          },
        ],
      },
      {
        id: "distance",
        label: { id: "Asal bahan", en: "Ingredient distance" },
        options: [
          {
            value: "local",
            label: { id: "Lokal", en: "Local" },
            hint: {
              id: "Bahan dekat memperkuat produsen sekitar dan logistik lebih pendek.",
              en: "Nearby ingredients strengthen local producers and shorten logistics.",
            },
            metrics: { sustainability: 5, practicality: 5, learning: 4 },
          },
          {
            value: "regional",
            label: { id: "Regional", en: "Regional" },
            hint: {
              id: "Masih cukup wajar, tetapi jejak distribusinya lebih besar.",
              en: "Still reasonable, but the distribution footprint grows.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "far",
            label: { id: "Jauh / non-lokal", en: "Far / non-local" },
            hint: {
              id: "Pilihan ini membuat rantai pasok panjang dan lebih rapuh.",
              en: "This makes the supply chain longer and more fragile.",
            },
            metrics: { sustainability: 1, practicality: 3, learning: 1 },
          },
        ],
      },
      {
        id: "wastewater",
        label: { id: "Pengolahan limbah cair", en: "Wastewater handling" },
        options: [
          {
            value: "full",
            label: { id: "Penuh", en: "Full treatment" },
            hint: {
              id: "Pilihan paling aman untuk menekan BOD dan COD.",
              en: "This is the safest choice for lowering BOD and COD.",
            },
            metrics: { sustainability: 5, practicality: 4, learning: 5 },
          },
          {
            value: "partial",
            label: { id: "Sebagian", en: "Partial treatment" },
            hint: {
              id: "Sudah membantu, tetapi belum seaman pengolahan penuh.",
              en: "Helpful, but not as safe as full treatment.",
            },
            metrics: { sustainability: 3, practicality: 4, learning: 3 },
          },
          {
            value: "none",
            label: { id: "Tidak ada", en: "No treatment" },
            hint: {
              id: "Biaya awal mungkin rendah, tapi risikonya paling besar untuk lingkungan sekitar.",
              en: "Initial costs may be low, but the environmental risk is highest.",
            },
            metrics: { sustainability: 1, practicality: 4, learning: 1 },
          },
        ],
      },
    ],
    summaries: {
      strong: {
        id: "Warungmu terasa paling kuat: tetap khas Cirebon, operasionalnya realistis, dan dampak lingkungannya rendah.",
        en: "Your stall feels strongest: it stays rooted in Cirebon, remains realistic to run, and keeps environmental impact low.",
      },
      balanced: {
        id: "Desainnya masih cukup baik, tetapi ada keputusan yang membuat sistem pangan lokalnya kurang rapat.",
        en: "The design is fairly good, but one decision makes the local food system less robust.",
      },
      needsWork: {
        id: "Konsep ini terlalu berat untuk lingkungan atau identitas lokal. Coba benahi asal bahan atau limbah cairnya.",
        en: "This concept is too heavy on the environment or weak on local identity. Try improving ingredient sourcing or wastewater handling.",
      },
    },
  },
};

const getInitialSelections = (unit: number) => {
  const config = simulationConfigs[unit];
  return config.controls.reduce<Record<string, string>>((acc, control) => {
    acc[control.id] = control.options[0].value;
    return acc;
  }, {});
};

type SharedProps = {
  unit: number;
  isId: boolean;
};

export function UnitMediaShowcase({ unit, isId }: SharedProps) {
  const meta = getUnitMeta(unit);
  const hasVideo = Boolean(meta.videoUrl);
  const hasImage = Boolean(meta.imageUrl);
  const [view, setView] = useState<"video" | "image">(hasVideo ? "video" : "image");
  const config = simulationConfigs[unit];

  useEffect(() => {
    setView(hasVideo ? "video" : "image");
  }, [unit, hasVideo]);

  return (
    <div className="my-6 overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {isId ? "Galeri Unit" : "Unit Gallery"}
          </p>
          <p className="text-sm text-foreground/80">
            {isId ? "Lihat visual asli unit lalu lanjut eksplorasi." : "See the real unit visuals, then continue exploring."}
          </p>
        </div>
        <div className="flex gap-2">
          {hasVideo && (
            <button
              type="button"
              onClick={() => setView("video")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                view === "video"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {isId ? "Video" : "Video"}
            </button>
          )}
          {hasImage && (
            <button
              type="button"
              onClick={() => setView("image")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                view === "image"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {isId ? "Foto" : "Photo"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-muted/20 p-4">
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-black/5">
          {view === "video" && hasVideo ? (
            <video
              src={meta.videoUrl}
              controls
              playsInline
              className="aspect-video w-full bg-black object-cover"
            />
          ) : hasImage ? (
            <img
              src={meta.imageUrl}
              alt={meta.subtitle}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {isId ? "Media unit belum tersedia." : "Unit media is not available yet."}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {config.facts.map((fact) => (
            <span
              key={fact.id}
              className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-foreground/80"
            >
              {pickText(isId, fact)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UnitSimulationPanel({ unit, isId }: SharedProps) {
  const config = simulationConfigs[unit];
  const [selections, setSelections] = useState<Record<string, string>>(() => getInitialSelections(unit));

  useEffect(() => {
    setSelections(getInitialSelections(unit));
  }, [unit]);

  const selectedOptions = config.controls.map((control) => {
    return control.options.find((option) => option.value === selections[control.id]) ?? control.options[0];
  });

  const calculateMetric = (key: keyof MetricSet) => {
    const total = selectedOptions.reduce((sum, option) => sum + option.metrics[key], 0);
    return Math.round((total / selectedOptions.length) * 20);
  };

  const sustainability = calculateMetric("sustainability");
  const practicality = calculateMetric("practicality");
  const learning = calculateMetric("learning");
  const overall = Math.round((sustainability + practicality + learning) / 3);

  const summary =
    overall >= 80
      ? config.summaries.strong
      : overall >= 60
        ? config.summaries.balanced
        : config.summaries.needsWork;

  const statusLabel =
    overall >= 80
      ? isId
        ? "Paling solid"
        : "Strongest setup"
      : overall >= 60
        ? isId
          ? "Masih seimbang"
          : "Reasonably balanced"
        : isId
          ? "Perlu dibenahi"
          : "Needs adjustment";

  const metricLabels = [
    { key: "sustainability", label: isId ? "Dampak lingkungan" : "Environmental impact", value: sustainability },
    { key: "practicality", label: isId ? "Kepraktisan" : "Practicality", value: practicality },
    { key: "learning", label: isId ? "Nilai pembelajaran" : "Learning value", value: learning },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm">
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/20 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {isId ? "Simulasi Cepat" : "Quick Simulation"}
            </p>
            <h3 className="mt-1 text-base font-semibold text-foreground">{pickText(isId, config.title)}</h3>
            <p className="mt-1 text-sm leading-relaxed text-foreground/75">{pickText(isId, config.prompt)}</p>
          </div>
          <div className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm">
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {config.controls.map((control) => (
          <div key={control.id}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{pickText(isId, control.label)}</p>
              <p className="text-[11px] text-muted-foreground">
                {pickText(
                  isId,
                  control.options.find((option) => option.value === selections[control.id])?.label ?? control.options[0].label,
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {control.options.map((option) => {
                const active = selections[control.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSelections((prev) => ({
                        ...prev,
                        [control.id]: option.value,
                      }))
                    }
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60 hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{pickText(isId, option.label)}</span>
                      <span
                        className={`mt-0.5 h-4 w-4 rounded-full border ${
                          active ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pickText(isId, option.hint)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{isId ? "Ringkasan hasil" : "Result summary"}</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              {overall}%
            </span>
          </div>

          <div className="space-y-3">
            {metricLabels.map((metric) => (
              <div key={metric.key}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-foreground/80">{metric.label}</span>
                  <span className="text-muted-foreground">{metric.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{pickText(isId, summary)}</p>

          <div className="mt-4 space-y-2">
            {selectedOptions.map((option) => (
              <div key={option.value} className="rounded-xl bg-white px-3 py-2 text-xs text-foreground/75">
                {pickText(isId, option.hint)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
