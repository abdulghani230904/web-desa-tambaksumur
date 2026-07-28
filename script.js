// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", () => {
  // 1. PAGE LOADING ANIMATION
  const loader = document.getElementById("page-loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 500);
    }, 600);
  }

  // 2. LIVE DATE SYSTEM
  const dateContainer = document.getElementById("live-date");
  if (dateContainer) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateContainer.innerText = new Date().toLocaleDateString("id-ID", options);
  }

  // 3. HERO SLIDER AUTOMATIC CYCLE
  initHeroSlider();

  // 4. DARK MODE TOGGLE & LOCAL STORAGE
  const darkToggleBtn = document.getElementById("dark-mode-toggle");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (darkToggleBtn) darkToggleBtn.innerText = "☀️";
  }

  if (darkToggleBtn) {
    darkToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      darkToggleBtn.innerText = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // 4.5 HAMBURGER MENU MOBILE TOGGLE & AUTO-CLOSE
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");
  const navItems = document.querySelectorAll(".nav-item");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle("active");
      hamburgerBtn.classList.toggle("active");
      hamburgerBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    // Sembunyikan menu saat item navigasi diklik
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburgerBtn.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Sembunyikan menu saat mengklik di luar area navigasi
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navMenu.classList.remove("active");
        hamburgerBtn.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 4.6 UNIVERSAL SMOOTH SCROLL DENGAN OFFSET NAVBAR PRESI
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Sembunyikan mobile menu drawer jika terbuka
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          if (hamburgerBtn) {
            hamburgerBtn.classList.remove("active");
            hamburgerBtn.setAttribute("aria-expanded", "false");
          }
        }
      }
    });
  });

  // 5. STICKY NAVBAR, BACK TO TOP, & BREADCRUMB DYNAMIC TRACKER
  const navbar = document.querySelector(".navbar");
  const backToTopBtn = document.getElementById("back-to-top");
  const breadcrumbSec = document.getElementById("breadcrumb-current-section");

  const sections = document.querySelectorAll("section, header");
  const secNames = {
    home: "Beranda Utama",
    perangkat: "Struktur Pamong Desa",
    demografi: "Statistik Kependudukan",
    potensi: "Komoditas & Potensi Bumi",
    artikel: "Artikel & Kabar Desa",
    kegiatan: "Galeri Warga Tani",
    "maps-location": "Geografis & Peta",
    aduan: "Layanan Aduan Warga",
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("sticky-active");
    } else {
      navbar.classList.remove("sticky-active");
    }

    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }

    // Melacak posisi seksi yang aktif di layar
    let currentSec = "home";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 150;
      if (window.scrollY >= top) {
        currentSec = sec.getAttribute("id");
      }
    });

    if (breadcrumbSec && secNames[currentSec]) {
      breadcrumbSec.innerText = secNames[currentSec];
    }

    // Update status aktif pada Mobile Floating Bottom Dock
    const dockItems = document.querySelectorAll(".mobile-bottom-dock .dock-item");
    if (dockItems.length > 0) {
      dockItems.forEach((item) => {
        const targetDock = item.getAttribute("data-dock");
        if (
          currentSec === targetDock ||
          (targetDock === "potensi" && (currentSec === "demografi" || currentSec === "potensi"))
        ) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. COUNTER ANIMATION (Intersection Observer)
  const counters = document.querySelectorAll(".counter-init");
  const targetSection = document.getElementById("demografi");

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const speed = target / 100;
      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  if (targetSection) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCounters();
          obs.unobserve(targetSection);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(targetSection);
  }

  // 7. FILTER SEKTOR POTENSI
  const filterBtns = document.querySelectorAll(".filter-btn");
  const filterCards = document.querySelectorAll(
    ".potensi-flex-layout .potensi-card-complex",
  );

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");

      filterCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || category === cardCat) {
          card.style.display = "block";
          card.classList.remove("filtered-in");
          void card.offsetWidth;
          card.classList.add("filtered-in");
        } else {
          card.style.display = "none";
          card.classList.remove("filtered-in");
        }
      });

      closePotensiDetail();
    });
  });

  // 8. FILTER & SEARCH GALERI WARGA INTERAKTIF
  const galBtns = document.querySelectorAll(".filter-btn-gal");
  const galItems = document.querySelectorAll(".gallery-item-wrapper");
  const inputSearchGaleri = document.getElementById("input-search-galeri");
  const btnClearGaleri = document.getElementById("btn-clear-galeri");

  let activeGalFilter = "all";

  function filterGaleri() {
    const keyword = inputSearchGaleri ? inputSearchGaleri.value.toLowerCase().trim() : "";

    if (btnClearGaleri) {
      if (keyword.length > 0) {
        btnClearGaleri.classList.remove("display-none");
      } else {
        btnClearGaleri.classList.add("display-none");
      }
    }

    galItems.forEach((item) => {
      const cat = item.getAttribute("data-cat");
      const text = (item.innerText + " " + (item.querySelector("img")?.getAttribute("alt") || "")).toLowerCase();

      const matchCategory = activeGalFilter === "all" || activeGalFilter === cat;
      const matchKeyword = keyword === "" || text.includes(keyword);

      if (matchCategory && matchKeyword) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  galBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      galBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeGalFilter = btn.getAttribute("data-gal");
      filterGaleri();
    });
  });

  if (inputSearchGaleri) {
    inputSearchGaleri.addEventListener("input", filterGaleri);
  }

  if (btnClearGaleri) {
    btnClearGaleri.addEventListener("click", () => {
      inputSearchGaleri.value = "";
      filterGaleri();
      inputSearchGaleri.focus();
    });
  }

  // 9. ARTIKEL SYSTEM: SEARCH, SKELETON & PAGINATION
  initArtikelSystem();

  // 10. FORM ADUAN WHATSAPP
  const aduanForm = document.getElementById("real-aduan-form");
  if (aduanForm) {
    aduanForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const noWhatsApp = "6285782699984";
      const nama = document.getElementById("aduan-nama").value;
      const kontak = document.getElementById("aduan-kontak").value;
      const pesan = document.getElementById("aduan-pesan").value;

      const teksPesan = `*PENGADUAN WARGA - TAMBAKSUMUR*\n\n• *Nama:* ${nama}\n• *Kontak:* ${kontak}\n• *Isi Aduan:* ${pesan}`;
      window.location.href = `https://api.whatsapp.com/send?phone=${noWhatsApp}&text=${encodeURIComponent(teksPesan)}`;
      aduanForm.reset();
    });
  }

  // 11. INISIALISASI FITUR BARU: LAYANAN SURAT
  switchLayananTab("tani");
});

// HERO SLIDER CONTROLLER
let currentHeroSlide = 0;
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % slides.length;
    setHeroSlide(currentHeroSlide);
  }, 4000);
}

function setHeroSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  currentHeroSlide = index;
  slides[currentHeroSlide].classList.add("active");
  if (dots[currentHeroSlide]) dots[currentHeroSlide].classList.add("active");
}

// DATA ARTIKEL DESA (2 DATA UNGGULAN)
const dataArtikel = [
  {
    judul: "Optimalisasi Sistem Irigasi Tersier di Blok Sawah Teratai",
    tanggal: "20 Juli 2026",
    kategori: "Pertanian",
    gambar: "asset/Foto Sawah.jpg",
    isi: "Pemdes Tambaksumur bersama Dinas Pertanian Karawang melakukan perbaikan penuh pada saluran irigasi tersier di kawasan Blok Teratai guna menjamin pasokan air sawah tetap terjaga.",
  },
  {
    judul: "Peningkatan Pelayanan Publik & Sarana Gedung Kantor Desa",
    tanggal: "18 Juli 2026",
    kategori: "Pemerintahan",
    gambar: "asset/Foto depan Kantor Desa.jpg",
    isi: "Pemerintah Desa Tambaksumur terus membenahi kualitas sarana prasarana serta mengintegrasikan sistem layanan administrasi digital demi kenyamanan seluruh warga.",
  },
];

let currentPage = 1;
const itemsPerPage = 2;
let filteredArtikel = [...dataArtikel];

// 9. ARTIKEL SYSTEM: SEARCH, SKELETON, QUICK TAGS & PAGINATION
function initArtikelSystem() {
  const searchInput = document.getElementById("input-search-artikel");
  const clearBtn = document.getElementById("btn-clear-search");
  const quickTagBtns = document.querySelectorAll(".quick-tag-btn");

  // Helper untuk memicu filter artikel
  const triggerSearch = (keyword) => {
    showSkeleton();
    setTimeout(() => {
      filteredArtikel = dataArtikel.filter(
        (a) =>
          a.judul.toLowerCase().includes(keyword) ||
          a.isi.toLowerCase().includes(keyword) ||
          a.kategori.toLowerCase().includes(keyword),
      );
      currentPage = 1;
      renderArtikel();
      hideSkeleton();
    }, 300);
  };

  if (searchInput) {
    // Event Input saat mengetik
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase().trim();

      // Tampilkan/sembunyikan tombol hapus (X)
      if (clearBtn) {
        if (keyword.length > 0) {
          clearBtn.classList.remove("display-none");
        } else {
          clearBtn.classList.add("display-none");
        }
      }

      // Reset style aktif pada quick tags jika mengetik manual
      quickTagBtns.forEach((btn) => btn.classList.remove("active"));

      triggerSearch(keyword);
    });
  }

  // Event Tombol Clear (X)
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.classList.add("display-none");
      quickTagBtns.forEach((btn) => btn.classList.remove("active"));
      triggerSearch("");
      searchInput.focus();
    });
  }

  // Event Tombol Quick Tags (Irigasi, Tambak, Pupuk, dll)
  quickTagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const keyword = btn.getAttribute("data-keyword").toLowerCase();

      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        searchInput.value = "";
        if (clearBtn) clearBtn.classList.add("display-none");
        triggerSearch("");
      } else {
        quickTagBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        searchInput.value = btn.getAttribute("data-keyword");
        if (clearBtn) clearBtn.classList.remove("display-none");
        triggerSearch(keyword);
      }
    });
  });

  renderArtikel();
}

function showSkeleton() {
  document
    .getElementById("skeleton-container")
    .classList.remove("display-none");
  document.getElementById("artikel-render-grid").classList.add("display-none");
}

function hideSkeleton() {
  document.getElementById("skeleton-container").classList.add("display-none");
  document
    .getElementById("artikel-render-grid")
    .classList.remove("display-none");
}

function renderArtikel() {
  const grid = document.getElementById("artikel-render-grid");
  const pagination = document.getElementById("pagination-container");
  if (!grid) return;

  grid.innerHTML = "";
  pagination.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = filteredArtikel.slice(start, end);

  if (paginatedItems.length === 0) {
    grid.innerHTML = `<p class="text-center" style="grid-column: 1/-1; color: #64748b;">Artikel tidak ditemukan.</p>`;
    return;
  }

  paginatedItems.forEach((art) => {
    const originalIndex = dataArtikel.indexOf(art);
    const card = document.createElement("div");
    card.className = "potensi-card-complex";
    card.onclick = () => openArtikelModal(originalIndex);
    card.innerHTML = `
      <div class="potensi-badge bg-green-tag">${art.kategori}</div>
      <div class="potensi-img-zoom"><img src="${art.gambar}" alt="${art.judul}" loading="lazy"></div>
      <div class="potensi-body-complex">
        <span class="date-tag">${art.tanggal}</span>
        <h3>${art.judul}</h3>
        <p>${art.isi.substring(0, 90)}...</p>
        <button class="btn-card-action">Baca Artikel &rarr;</button>
      </div>
    `;
    grid.appendChild(card);
  });

  const totalPages = Math.ceil(filteredArtikel.length / itemsPerPage);
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
      btn.innerText = i;
      btn.onclick = () => {
        currentPage = i;
        renderArtikel();
        document
          .getElementById("artikel")
          .scrollIntoView({ behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
  }
}

// MODAL ARTIKEL & SHARE
function openArtikelModal(index) {
  const modal = document.getElementById("artikel-modal");
  const artikel = dataArtikel[index];
  if (!modal || !artikel) return;

  document.getElementById("art-modal-title").innerText = artikel.judul;
  document.getElementById("art-modal-date").innerText = "📅 " + artikel.tanggal;
  document.getElementById("art-modal-category").innerText = artikel.kategori;
  document.getElementById("art-modal-img").src = artikel.gambar;
  document.getElementById("art-modal-content").innerText = artikel.isi;

  const currentUrl = window.location.href;
  document.getElementById("btn-share-wa").onclick = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(artikel.judul + " " + currentUrl)}`,
      "_blank",
    );
  };
  document.getElementById("btn-share-fb").onclick = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      "_blank",
    );
  };

  modal.classList.remove("display-none");
}

function closeArtikelModal() {
  document.getElementById("artikel-modal").classList.add("display-none");
}

// MODAL PERANGKAT DESA
function openPerangkatModal(name, role, description, imgSrc, phone) {
  const modal = document.getElementById("perangkat-modal");
  if (!modal) return;
  document.getElementById("p-modal-name").innerText = name;
  document.getElementById("p-modal-desc").innerText = description;
  const imgEl = document.getElementById("p-modal-img");
  if (imgEl) {
    if (imgSrc && imgSrc.trim() !== "") {
      imgEl.src = imgSrc;
      imgEl.style.display = "block";
    } else {
      imgEl.src = "";
      imgEl.style.display = "none";
    }
  }
  document.getElementById("p-modal-role").innerText = role;

  const phoneEl = document.getElementById("p-modal-phone");
  if (phoneEl) {
    if (phone && phone.trim() !== "") {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      phoneEl.innerHTML = `<a href="https://wa.me/${waPhone}" target="_blank" class="modal-wa-btn" style="display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; padding: 10px 18px; background: #25d366; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13.5px;"><span style="font-size:16px;">💬</span> Hubungi via WA (${phone})</a>`;
      phoneEl.style.display = "block";
    } else {
      phoneEl.innerHTML = "";
      phoneEl.style.display = "none";
    }
  }

  modal.classList.remove("display-none");
}

function closePerangkatModal() {
  document.getElementById("perangkat-modal").classList.add("display-none");
}

// LIGHTBOX GALERI
function openLightbox(src, caption) {
  const modal = document.getElementById("lightbox-modal");
  if (!modal) return;
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox-caption").innerText = caption;
  modal.classList.remove("display-none");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.classList.add("display-none");
  document.body.style.overflow = "";
}

function showPotensiDetail(sektor) {
  const outputBox = document.getElementById("potensi-dynamic-output");
  if (!outputBox) return;
  outputBox.classList.remove("display-none");

  if (sektor === "sawah") {
    outputBox.innerHTML = `
      <div class="potensi-output-header">
        <h3>🌾 Analisis Sektor Lahan Sawah & Pertanian Padi</h3>
        <button class="btn-close-potensi" onclick="closePotensiDetail()">✕ Tutup Analisis</button>
      </div>
      <div class="potensi-stats-grid">
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">🌾</div>
          <div class="potensi-stat-value">1.000 Hektar</div>
          <div class="potensi-stat-label">Total Luas Lahan Sawah Aktif</div>
        </div>
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">📈</div>
          <div class="potensi-stat-value">7,8 Ton / Ha</div>
          <div class="potensi-stat-label">Rata-rata Produktivitas Panen</div>
        </div>
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">💧</div>
          <div class="potensi-stat-value">100% Tersier</div>
          <div class="potensi-stat-label">Cakupan Irigasi Teknis Desa</div>
        </div>
      </div>
      <div class="potensi-detail-desc">
        <strong>📋 Ringkasan Analisis Usaha Tani:</strong><br>
        Klaster pertanian sawah Desa Tambaksumur ditopang oleh aliran irigasi tersier terintegrasi dari jaringan Tirtajaya. Varietas utama yang dikembangkan adalah <em>Ciherang & Inpari 32</em> dengan masa panen 2-3 kali setahun, menghasilkan pasokan gabah kering panen berkategori premium untuk distribusi pasar Karawang & Jabodetabek.
      </div>
    `;
  } else {
    outputBox.innerHTML = `
      <div class="potensi-output-header">
        <h3>🐟 Analisis Sektor Budidaya Pesisir & Tambak Muara</h3>
        <button class="btn-close-potensi" onclick="closePotensiDetail()">✕ Tutup Analisis</button>
      </div>
      <div class="potensi-stats-grid">
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">🌊</div>
          <div class="potensi-stat-value">70 Hektar</div>
          <div class="potensi-stat-label">Luas Kawasan Tambak Payau</div>
        </div>
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">🦐</div>
          <div class="potensi-stat-value">12,5 Ton</div>
          <div class="potensi-stat-label">Estimasi Hasil Panen / Siklus</div>
        </div>
        <div class="potensi-stat-card">
          <div class="potensi-stat-icon">🏷️</div>
          <div class="potensi-stat-value">Bandeng & Udang</div>
          <div class="potensi-stat-label">Komoditas Ekspor & Pasar Lokal</div>
        </div>
      </div>
      <div class="potensi-detail-desc">
        <strong>📋 Ringkasan Analisis Tambak Pesisir:</strong><br>
        Sektor tambak Desa Tambaksumur memanfaatkan perairan payau alami pesisir Karawang. Komoditas unggulan <em>Bandeng Salin & Udang Vaname</em> dibudidayakan secara berkelanjutan dengan menerapkan aerasi bertenaga surya untuk menjaga keseimbangan ekosistem muara dan mengoptimalkan keuntungan petambak.
      </div>
    `;
  }

  outputBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closePotensiDetail() {
  const outputBox = document.getElementById("potensi-dynamic-output");
  if (outputBox) outputBox.classList.add("display-none");
}

// DATA & LOGIKA FITUR 2A: LAYANAN SURAT WARGA ONLINE
const dataLayananSurat = {
  tani: {
    judul: "Surat Keterangan Usaha Tani / Petambak",
    deskripsi: "Digunakan oleh petani atau petambak untuk pengajuan alokasi pupuk bersubsidi, bantuan benih, permodalan bank, atau bantuan alat pertanian.",
    waktu: "⚡ 1 Hari Kerja (Gratis)",
    syarat: [
      "Fotokopi KTP Pemohon (Warga Desa Tambaksumur)",
      "Fotokopi Kartu Keluarga (KK)",
      "Surat Pengantar dari Ketua RT / RW Setempat",
      "Bukti Kepemilikan Lahan Sawah / Tambak atau Surat Perjanjian Sewa Lahan"
    ],
    waPesan: "Halo Admin Pemdes Tambaksumur, saya mau mengajukan Surat Keterangan Usaha Tani/Petambak."
  },
  ktp: {
    judul: "Surat Pengantar Pembuatan KTP / KK Baru",
    deskripsi: "Surat pengantar resmi dari Pemerintah Desa ke Kecamatan Tirtajaya untuk perekaman E-KTP baru, penerbitan KK baru, atau perubahan data anggota keluarga.",
    waktu: "⚡ Langsung Diterbitkan saat Jam Kerja",
    syarat: [
      "Fotokopi KK Lama / Surat Kehilangan dari Kepolisian (jika hilang)",
      "Fotokopi Akta Kelahiran / Ijazah Terakhir",
      "Surat Pengantar RT/RW Setempat",
      "Pas Foto Ukuran 3x4 (2 lembar)"
    ],
    waPesan: "Halo Admin Pemdes Tambaksumur, saya mau minta pengantar pembuatan E-KTP / KK baru."
  },
  domisili: {
    judul: "Surat Keterangan Domisili Warga / Usaha",
    deskripsi: "Surat keterangan bukti tempat tinggal resmi warga atau lokasi usaha aktif di wilayah hukum Desa Tambaksumur.",
    waktu: "⚡ 1 Hari Kerja",
    syarat: [
      "Fotokopi KTP & KK Pemohon",
      "Surat Pengantar RT/RW",
      "Foto Bangunan Tempat Tinggal / Tempat Usaha"
    ],
    waPesan: "Halo Admin Pemdes Tambaksumur, saya mau mengurus Surat Keterangan Domisili."
  },
  sktm: {
    judul: "Surat Keterangan Tidak Mampu (SKTM)",
    deskripsi: "Surat rujukan resmi untuk keringanan biaya rumah sakit (BPJS PBI), permohonan beasiswa pendidikan anak, atau bantuan sosial pemerintah.",
    waktu: "⚡ Langsung Diproses",
    syarat: [
      "Fotokopi KTP & Kartu Keluarga (KK)",
      "Surat Pengantar RT/RW yang menyatakan kondisi keluarga kurang mampu",
      "Kartu Indonesia Sehat (KIS) / BPJS jika ada"
    ],
    waPesan: "Halo Admin Pemdes Tambaksumur, saya mau minta pengurusan Surat SKTM."
  },
  nikah: {
    judul: "Surat Pengantar Pernikahan (Model N1 - N4)",
    deskripsi: "Dokumen kelengkapan persyaratan pendaftaran pernikahan resmi ke Kantor Urusan Agama (KUA) Tirtajaya.",
    waktu: "⚡ 1 - 2 Hari Kerja",
    syarat: [
      "Fotokopi KTP & KK Calon Mempelai & Orang Tua",
      "Fotokopi Akta Kelahiran & Ijazah Terakhir Calon Mempelai",
      "Pas Foto 2x3 & 3x4 Latar Belakang Biru (masing-masing 4 lembar)",
      "Surat Pengantar Pernikahan dari RT/RW",
      "Surat Akta Cerai / Kematian (apabila status Duda / Janda)"
    ],
    waPesan: "Halo Admin Pemdes Tambaksumur, saya mau berkonsultasi pengurusan Surat Pengantar Nikah (N1-N4)."
  }
};

function switchLayananTab(jenis) {
  const btns = document.querySelectorAll(".layanan-tab-btn");
  btns.forEach((btn) => btn.classList.remove("active"));

  const activeBtn = document.querySelector(`.layanan-tab-btn[onclick*="${jenis}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const data = dataLayananSurat[jenis];
  const box = document.getElementById("layanan-detail-box");
  if (!box || !data) return;

  const noWa = "6285782699984";
  const waUrl = `https://api.whatsapp.com/send?phone=${noWa}&text=${encodeURIComponent(data.waPesan)}`;

  box.innerHTML = `
    <div class="layanan-detail-header">
      <div class="layanan-header-text">
        <h3>${data.judul}</h3>
        <p>${data.deskripsi}</p>
      </div>
      <span class="waktu-badge">${data.waktu}</span>
    </div>
    
    <div class="layanan-syarat-body">
      <h4>📌 Dokumen Persyaratan Wajib:</h4>
      <ul class="syarat-list">
        ${data.syarat.map((s) => `<li><span class="check-icon">✓</span> ${s}</li>`).join("")}
      </ul>
    </div>

    <div class="layanan-action-footer">
      <a href="${waUrl}" target="_blank" class="btn-layanan-wa">💬 Minta Pengurusan via WhatsApp Pelayanan &rarr;</a>
    </div>
  `;
}


