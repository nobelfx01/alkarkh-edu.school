/* ===========================
   ثانوية الكرخ المهنية — JS
   =========================== */

/* ====== SCROLL REVEAL ====== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ====== NAVBAR ====== */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = window.scrollY > 50
    ? 'rgba(10,22,40,1)'
    : 'rgba(10,22,40,0.97)';
});

const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

/* ====== CONTACT FORM ====== */
function sendMsg() {
  const name = document.getElementById('contactName')?.value.trim();
  const msg  = document.getElementById('contactMessage')?.value.trim();
  if (!name || !msg) {
    alert('يرجى ملء الاسم والرسالة على الأقل.');
    return;
  }
  alert(`شكراً ${name}! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.`);
  document.getElementById('contactForm')?.reset();
}

/* ====== EXEMPTION CALCULATOR ====== */
(function () {
  let currentMode = 'partial';
  let subjectCount = 0;
  const defaultSubjects = ['الرياضيات', 'اللغة العربية', 'الفيزياء', 'الكيمياء', 'الانكليزية'];

  /* --- Switch mode --- */
  window.switchMode = function (mode) {
    currentMode = mode;
    const tPartial = document.getElementById('tab-partial');
    const tTotal   = document.getElementById('tab-total');
    const addBtn   = document.getElementById('add-btn-container');
    const descEl   = document.getElementById('mode-desc');

    document.getElementById('finalResult').style.display = 'none';
    document.getElementById('subjectsContainer').innerHTML = '';
    subjectCount = 0;

    if (mode === 'partial') {
      tPartial.className = 'tab-btn active-partial';
      tTotal.className   = 'tab-btn inactive';
      addBtn.style.display = 'none';
      descEl.innerHTML = `
        <div class="calc-mode-desc" style="background:rgba(232,160,32,0.07);border:1px solid rgba(232,160,32,0.3);">
          <div style="color:#e8a020;font-weight:900;margin-bottom:5px;">⭐ الإعفاء الفردي</div>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
            تحتاج إلى درجة سعي <strong style="color:#e8a020;">90% فأكثر</strong> في المادة الواحدة ليتم إعفاؤك منها.
          </p>
        </div>`;
      addSubject();
    } else {
      tTotal.className   = 'tab-btn active-total';
      tPartial.className = 'tab-btn inactive';
      addBtn.style.display = 'block';
      descEl.innerHTML = `
        <div class="calc-mode-desc" style="background:rgba(34,197,94,0.07);border:1px solid rgba(34,197,94,0.3);">
          <div style="color:#22c55e;font-weight:900;margin-bottom:5px;">🏅 الإعفاء العام</div>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
            يجب أن يكون معدلك العام <strong style="color:#22c55e;">85% فأكثر</strong>، وأقل درجة لا تقل عن <strong style="color:#22c55e;">75%</strong>.
          </p>
        </div>`;
      defaultSubjects.forEach(s => addSubject(s));
    }
  };

  /* --- Add subject row --- */
  window.addSubject = function (name) {
    subjectCount++;
    const id  = subjectCount;
    const row = document.createElement('div');
    row.id = 'row-' + id;
    row.className = 'subject-row';
    row.style.gridTemplateColumns = currentMode === 'total'
      ? '2fr 1fr 1fr 1fr 1fr 36px'
      : '2fr 1fr 1fr 1fr 1fr 0px';

    row.innerHTML = `
      <input type="text" class="calc-input-text" placeholder="المادة" value="${name || ''}">
      <input type="number" class="calc-input-num gr" placeholder="--" min="0" max="100">
      <input type="number" class="calc-input-num gr" placeholder="--" min="0" max="100">
      <input type="number" class="calc-input-num gr" placeholder="--" min="0" max="100">
      <div class="avg-display">--</div>
      ${currentMode === 'total'
        ? `<button class="remove-btn" onclick="removeRow(${id})" title="حذف">×</button>`
        : '<span></span>'}
    `;

    const inputs = row.querySelectorAll('.gr');
    const avgDiv = row.querySelector('.avg-display');

    inputs.forEach(inp => {
      inp.addEventListener('input', () => {
        const vals = Array.from(inputs).map(i => parseFloat(i.value));
        if (vals.every(v => !isNaN(v) && v >= 0 && v <= 100)) {
          const avg = (vals[0] + vals[1] + vals[2]) / 3;
          avgDiv.textContent = avg.toFixed(1) + '%';
          avgDiv.style.color = avg >= 90 ? '#22c55e' : avg >= 75 ? '#e8a020' : '#ef4444';
        } else {
          avgDiv.textContent = '--';
          avgDiv.style.color = 'rgba(255,255,255,0.4)';
        }
      });
    });

    document.getElementById('subjectsContainer').appendChild(row);
  };

  /* --- Remove row --- */
  window.removeRow = function (id) {
    document.getElementById('row-' + id)?.remove();
  };

  /* --- Calculate --- */
  window.calcAll = function () {
    const rows = document.getElementById('subjectsContainer').children;
    if (rows.length === 0) { alert('أضف مادة واحدة على الأقل'); return; }

    const results = [];
    for (const row of rows) {
      const grEls = row.querySelectorAll('.gr');
      const vals  = Array.from(grEls).map(el => parseFloat(el.value));
      const name  = row.querySelector('.calc-input-text')?.value || 'المادة';
      if (vals.some(v => isNaN(v) || v < 0 || v > 100)) {
        alert('يرجى ملء جميع الدرجات بشكل صحيح (0-100)');
        return;
      }
      results.push({ name, avg: (vals[0] + vals[1] + vals[2]) / 3 });
    }

    const finalEl = document.getElementById('finalResult');
    let html = '';

    if (currentMode === 'partial') {
      const res      = results[0];
      const isExempt = res.avg >= 90;
      const color    = isExempt ? '#22c55e' : '#ef4444';
      const bg       = isExempt ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
      const border   = isExempt ? '#22c55e' : '#ef4444';
      html = `
        <div class="result-content" style="background:${bg};border:1px solid ${border};">
          <div class="result-avg">معدل السعي لمادة: <strong>${res.name}</strong></div>
          <div class="result-value" style="color:${color};">${res.avg.toFixed(1)}%</div>
          <div class="result-status">${isExempt ? '✅ مبروك! أنت مؤهل للإعفاء الفردي' : '❌ غير مؤهل — مطلوب 90% فأكثر'}</div>
        </div>`;
    } else {
      const totalAvg = results.reduce((s, r) => s + r.avg, 0) / results.length;
      const minAvg   = Math.min(...results.map(r => r.avg));
      const isOk     = totalAvg >= 85 && minAvg >= 75;
      const color    = isOk ? '#22c55e' : '#ef4444';
      const bg       = isOk ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
      const border   = isOk ? '#22c55e' : '#ef4444';
      html = `
        <div class="result-content" style="background:rgba(255,255,255,0.05);">
          <div class="result-avg">المعدل العام لجميع المواد</div>
          <div class="result-value" style="color:${color};">${totalAvg.toFixed(2)}%</div>
          <div style="margin-top:12px;padding:14px;border-radius:12px;background:${bg};border:1px solid ${border};">
            <div style="font-weight:900;color:${color};">${isOk ? '🏅 مبروك! أنت مؤهل للإعفاء العام' : '❌ لا يوجد إعفاء عام'}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:5px;">
              ${isOk
                ? 'معدلك فوق 85% ولا توجد مادة تحت 75%'
                : `المعدل: ${totalAvg.toFixed(1)}% — أدنى مادة: ${minAvg.toFixed(1)}%`}
            </div>
          </div>
        </div>`;
    }

    finalEl.innerHTML = html;
    finalEl.style.display = 'block';
    finalEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  /* --- Init --- */
  switchMode('partial');
})();


/* ====== CHATBOT ====== */
(function () {
  const panel    = document.getElementById('chatPanel');
  const launch   = document.getElementById('chatLaunch');
  const closeBtn = document.getElementById('chatClose');
  const bodyEl   = document.getElementById('chatBody');
  const input    = document.getElementById('chatText');
  const sendBtn  = document.getElementById('chatSend');
  const suggest  = document.getElementById('chatSuggest');

  if (!panel) return;

  const kb = [
    {
      keywords: ['ذكاء', 'اصطناعي', 'AI', 'تعلم آلة', 'شبكات عصبية', 'روبوت'],
      answer: 'قسم الذكاء الاصطناعي يدرّس تعلم الآلة، الرؤية الحاسوبية، ومعالجة اللغة الطبيعية. يُخرّج طلاباً قادرين على بناء نماذج ذكية وتطبيقات حديثة.'
    },
    {
      keywords: ['حاسوب', 'كمبيوتر', 'برمجة', 'شبكات', 'صيانة حاسوب', 'هاردوير'],
      answer: 'قسم الحاسوب يركّز على البرمجة، أنظمة التشغيل، الشبكات، أمن المعلومات، وصيانة الأجهزة. يشمل مختبرات عملية متطورة.'
    },
    {
      keywords: ['سيارات', 'محرك', 'ميكانيك سيارات', 'صيانة سيارات', 'كهرباء سيارات'],
      answer: 'قسم السيارات يغطي صيانة المحركات، الأنظمة الكهربائية، التشخيص الإلكتروني، والسيارات الهجينة والكهربائية الحديثة.'
    },
    {
      keywords: ['ميكانيك', 'محركات', 'هيدروليك', 'تروس', 'آلات صناعية'],
      answer: 'قسم الميكانيك يدرس المحركات، الأنظمة الهيدروليكية، الخراطة، التفريز، وصيانة الآلات الصناعية في ورش مجهزة.'
    },
    {
      keywords: ['ديكور', 'تصميم داخلي', 'ألوان', 'أثاث', 'تصميم غرف'],
      answer: 'قسم الديكور يهتم بتصميم المساحات الداخلية، اختيار الألوان والأثاث، الرسم الهندسي، والتصميم ثلاثي الأبعاد.'
    },
    {
      keywords: ['تكييف', 'مكيف', 'تبريد', 'HVAC', 'تدفئة', 'صيانة مكيف'],
      answer: 'قسم التكييف والتبريد يدرس أنظمة التبريد والتدفئة، تركيب المكيفات وصيانتها، وتشخيص أعطال الضواغط والمبخرات.'
    },
    {
      keywords: ['لحام', 'معادن', 'TIG', 'MIG', 'هياكل حديدية', 'تشكيل معادن'],
      answer: 'قسم اللحام يتخصص في تقنيات اللحام الحديثة (TIG/MIG/Arc)، تشكيل المعادن، وتصنيع الهياكل الحديدية والصناعية.'
    },
    {
      keywords: ['اعفاء', 'إعفاء', 'فردي', 'عام', 'سعي', 'درجة', '90', '85', '75'],
      answer: 'نظام الإعفاء:\n• الإعفاء الفردي: درجة سعي 90% فأكثر في المادة الواحدة.\n• الإعفاء العام: معدل عام 85%+ مع أقل درجة 75%.\nاستخدم حاسبة الإعفاء في الموقع للحساب الدقيق!'
    },
    {
      keywords: ['تخرج', 'جامعة', 'قبول', '10%', 'بعد التخرج', 'مستقبل'],
      answer: 'بعد التخرج، الطلاب ضمن أعلى 10% من قسمهم على مستوى العراق يُقبلون في الجامعات الحكومية. الباقون لديهم خيارات المسائية والجامعات الأهلية.'
    },
    {
      keywords: ['مواد', 'حاسوب', 'مادة'],
      answer: 'مواد قسم الحاسوب:\n• الأول: تطبيقات الحاسوب، أساسيات الكهرباء، الشبكات، تجميع الحاسوب.\n• الثاني: التصميم المنطقي، صيانة الحاسوب، شبكات الحاسوب.\n• الثالث: المعالجات الدقيقة، صيانة الحاسوب، مختبر الانترنت.'
    },
    {
      keywords: ['اهلا', 'مرحبا', 'السلام', 'هلو', 'hi', 'hello', 'سلام'],
      answer: 'أهلاً وسهلاً! 👋 أنا مساعد ثانوية الكرخ المهنية. كيف أقدر أساعدك؟'
    },
    {
      keywords: ['تسجيل', 'قبول', 'التحاق', 'تقديم'],
      answer: 'للتسجيل في ثانوية الكرخ المهنية، يرجى مراجعة إدارة المدرسة مباشرة أو التواصل معنا عبر قسم الاتصال في الموقع.'
    }
  ];

  function normalize(text) {
    return text.toLowerCase().replace(/[\u064B-\u065F]/g, '').trim();
  }

  function findAnswer(msg) {
    const norm = normalize(msg);
    for (const item of kb) {
      for (const key of item.keywords) {
        if (norm.includes(normalize(key))) return item.answer;
      }
    }
    return 'عذراً، لم أفهم سؤالك جيداً. جرب السؤال عن الأقسام، الإعفاء، أو القبول الجامعي.';
  }

  function appendMsg(text, sender) {
    const d = document.createElement('div');
    d.className = `chat-msg ${sender}`;
    d.style.whiteSpace = 'pre-line';
    d.textContent = text;
    bodyEl.appendChild(d);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  launch.addEventListener('click', () => {
    panel.classList.add('visible');
    launch.style.display = 'none';
    if (bodyEl.children.length === 0) {
      appendMsg('مرحباً! 🎓 أنا مساعد ثانوية الكرخ المهنية الذكي. اسألني عن أي شيء!', 'bot');
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('visible');
    launch.style.display = 'grid';
  });

  function handleSend() {
    const txt = input.value.trim();
    if (!txt) return;
    appendMsg(txt, 'user');
    input.value = '';
    setTimeout(() => appendMsg(findAnswer(txt), 'bot'), 600);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });
  suggest.addEventListener('click', e => {
    if (e.target.classList.contains('pill')) {
      input.value = e.target.textContent;
      handleSend();
    }
  });
})();
