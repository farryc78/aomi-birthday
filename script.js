(function () {
  const FLOWER_CLOSE_DURATION = 820;

  function navigateWithFlowerTransition(url) {
    try {
      const overlay = document.getElementById('pageTransitionOverlay');
      if (!overlay) {
        window.location.href = url;
        return;
      }
      overlay.classList.remove('opened');
      setTimeout(function () {
        window.location.href = url;
      }, FLOWER_CLOSE_DURATION);
    } catch (err) {
      console.error('⚠️ Transisi bunga gagal, pindah halaman langsung sebagai jaga-jaga:', err);
      window.location.href = url;
    }
  }

  try {
    const transitionOverlay = document.getElementById('pageTransitionOverlay');
    if (transitionOverlay) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          transitionOverlay.classList.add('opened');
        });
      });
    }
  } catch (err) {
    console.error('⚠️ Terjadi error saat membuka tirai bunga:', err);
  }

  // ============================================
  // COUNTDOWN (index.html)
  // ============================================
  try {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownHint = document.getElementById('countdownHint');
    const giftButton = document.getElementById('giftButton');

    if (daysEl && hoursEl && minutesEl && secondsEl && countdownHint && giftButton) {
      const targetDate = new Date('2026-07-14T00:00:00+07:00').getTime();

      if (isNaN(targetDate)) {
        console.error('⚠️ Format targetDate salah! Gunakan format: YYYY-MM-DDTHH:mm:ss+07:00 — countdown tidak akan pernah selesai selama ini NaN.');
      } else {
        let countdownInterval = null;

        function setCountdownDisplay(d, h, m, s) {
          daysEl.textContent = String(d).padStart(2, '0');
          hoursEl.textContent = String(h).padStart(2, '0');
          minutesEl.textContent = String(m).padStart(2, '0');
          secondsEl.textContent = String(s).padStart(2, '0');
        }

        function revealGiftButton() {
          countdownHint.textContent = '🎉 Yeay, waktunya sudah tiba!';
          giftButton.disabled = false;
          giftButton.classList.add('visible');
        }

        function updateCountdown() {
          const now = Date.now();
          const distance = targetDate - now;

          if (distance <= 0) {
            setCountdownDisplay(0, 0, 0, 0);
            if (countdownInterval) {
              clearInterval(countdownInterval);
              countdownInterval = null;
            }
            revealGiftButton();
            return;
          }

          const d = Math.floor(distance / 86400000);
          const h = Math.floor((distance % 86400000) / 3600000);
          const m = Math.floor((distance % 3600000) / 60000);
          const s = Math.floor((distance % 60000) / 1000);
          setCountdownDisplay(d, h, m, s);
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);

        giftButton.addEventListener('click', function () {
          if (giftButton.disabled) return;
          navigateWithFlowerTransition('surat.html');
        });
      }
    }
  } catch (err) {
    console.error('⚠️ Terjadi error di blok COUNTDOWN, tapi blok lain tetap jalan normal:', err);
  }

  // ============================================
  // EVASIVE "ENGGAK" BUTTON LOGIC (kuis.html)
  // ============================================
  try {
    const quizActions = document.getElementById('quizActions');
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const guiltText = document.getElementById('guiltText');

    if (quizActions && btnYes && btnNo && guiltText) {
      const guiltPhrases = [
        'Masa sih...? 🥺',
        'Kok tega banget...',
        'Tombolnya ngambek, ga mau diklik!',
        'Yah, meleset lagi~',
        'Eh, keburu kabur! 😆',
        'Ga boleh pilih itu, ih!',
        'Sabar... jodoh tombol ini bukan kamu 😝',
        'Wah, lincah banget larinya~'
      ];

      let lastPhraseIndex = -1;

      function showGuiltText() {
        let idx;
        do {
          idx = Math.floor(Math.random() * guiltPhrases.length);
        } while (idx === lastPhraseIndex && guiltPhrases.length > 1);
        lastPhraseIndex = idx;

        guiltText.textContent = guiltPhrases[idx];
        guiltText.classList.remove('pop');
        void guiltText.offsetWidth;
        guiltText.classList.add('pop');
      }

      function evadeButton() {
        const containerRect = quizActions.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        const maxX = Math.max(containerRect.width - btnRect.width, 0);
        const maxY = Math.max(containerRect.height - btnRect.height, 0);

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        btnNo.style.transform = 'none';
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';

        btnNo.classList.remove('pop-btn');
        void btnNo.offsetWidth;
        btnNo.classList.add('pop-btn');

        showGuiltText();
      }

      btnNo.addEventListener('mouseenter', evadeButton);

      btnNo.addEventListener(
        'touchstart',
        function (e) {
          e.preventDefault();
          evadeButton();
        },
        { passive: false }
      );

      btnNo.addEventListener('click', function (e) {
        e.preventDefault();
        evadeButton();
      });

      btnYes.addEventListener('click', function () {
        navigateWithFlowerTransition('video.html');
      });
    }
  } catch (err) {
    console.error('⚠️ Terjadi error di blok KUIS, tapi blok lain tetap jalan normal:', err);
  }

  // ============================================
  // ENVELOPE LOGIC (surat.html)
  // ============================================
  try {
    const envelope = document.getElementById('envelope');
    const letter = document.getElementById('letter');
    const letterBackdrop = document.getElementById('letterBackdrop');
    const nextBtn = document.getElementById('nextBtn');
    const instructionText = document.getElementById('instructionText');

    if (envelope && letter && letterBackdrop && nextBtn && instructionText) {
      let isOpened = false;

      function openEnvelope() {
        if (isOpened) return;
        isOpened = true;

        envelope.classList.add('open');
        envelope.setAttribute('aria-expanded', 'true');

        letterBackdrop.classList.add('is-open');
        instructionText.textContent = 'Yeay, ini suratnya! Baca sampai habis ya 💗';

        setTimeout(function () {
          letter.classList.add('is-open');
          letter.setAttribute('aria-hidden', 'false');
        }, 150);

        setTimeout(function () {
          nextBtn.classList.add('visible');
        }, 5000);
      }

      envelope.addEventListener('click', openEnvelope);
      envelope.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEnvelope();
        }
      });

      nextBtn.addEventListener('click', function () {
        navigateWithFlowerTransition('kuis.html');
      });
    }
  } catch (err) {
    console.error('⚠️ Terjadi error di blok SURAT, tapi blok lain tetap jalan normal:', err);
  }

  try {
    const peekingCatHTML =
      '<div class="peeking-cat" id="peekingCat" aria-hidden="true">' +
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="peek-rotate">' +
      '<g class="peek-reveal">' +
      '<polygon points="18,45 28,8 42,48" fill="var(--white)" stroke="var(--pink-mid)" stroke-width="2"/>' +
      '<polygon points="58,48 72,8 82,45" fill="var(--white)" stroke="var(--pink-mid)" stroke-width="2"/>' +
      '<circle cx="50" cy="55" r="40" fill="var(--white)" stroke="var(--pink-mid)" stroke-width="2"/>' +
      '<ellipse class="peek-eye" cx="36" cy="55" rx="6" ry="9" fill="var(--ink)"/>' +
      '<ellipse class="peek-eye" cx="64" cy="55" rx="6" ry="9" fill="var(--ink)"/>' +
      '<polygon points="45,68 55,68 50,76" fill="var(--pink-deep)"/>' +
      '</g>' +
      '</g>' +
      '</svg>' +
      '</div>';

    const speechBubbleHTML =
      '<div class="peek-speech-bubble" id="peekSpeechBubble" aria-hidden="true">' +
      '<svg id="peekSpeechSvg" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">' +
      '<path id="peekSpeechPath" d="" ' +
      'fill="var(--cream)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '</svg>' +
      '<span class="peek-speech-text"></span>' +
      '</div>';

    if (!document.getElementById('peekingCat')) {
      document.body.insertAdjacentHTML('beforeend', peekingCatHTML);
    }
    if (!document.getElementById('peekSpeechBubble')) {
      document.body.insertAdjacentHTML('beforeend', speechBubbleHTML);
    }
  } catch (err) {
    console.error('⚠️ Gagal memasang markup kucing intip ke halaman:', err);
  }

  try {
    const peekingCat = document.getElementById('peekingCat');
    const speechBubble = document.getElementById('peekSpeechBubble');
    const speechText = speechBubble ? speechBubble.querySelector('.peek-speech-text') : null;

    if (peekingCat) {
      const sides = ['left', 'right', 'top', 'bottom'];

      const PEEK_MIN_DELAY = 9000;
      const PEEK_MAX_DELAY = 20000;
      const PEEK_DURATION = 3000;
      const HEAD_ARRIVE_DELAY = 500;
      const SPEECH_DELAY = 700;
      const CREEP_DELAY = 1250;

      const meowPhrases = ['Meong~', 'Mrrp?', 'Meow!', 'Nyaan~', 'Purr~'];

      const bubbleVariants = {
        bottom: {
          viewBox: '0 0 200 130',
          path: 'M 32,12 L 168,12 C 180,12 188,20 188,32 L 188,64 C 188,76 180,84 168,84 L 76,84 C 75,98 68,108 48,120 C 60,106 64,96 58,84 L 32,84 C 20,84 12,76 12,64 L 12,32 C 12,20 20,12 32,12 Z',
          width: 130, height: 85, textTop: '37%', textLeft: '50%'
        },
        top: {
          viewBox: '0 0 200 130',
          path: 'M 32,118 L 168,118 C 180,118 188,110 188,98 L 188,66 C 188,54 180,46 168,46 L 76,46 C 75,32 68,22 48,10 C 60,24 64,34 58,46 L 32,46 C 20,46 12,54 12,66 L 12,98 C 12,110 20,118 32,118 Z',
          width: 130, height: 85, textTop: '63%', textLeft: '50%'
        },
        left: {
          viewBox: '0 0 220 110',
          path: 'M 55,10 L 195,10 C 207,10 215,18 215,30 L 215,60 C 215,72 207,80 195,80 L 55,80 C 43,80 35,72 35,60 L 35,55 C 22,53 14,50 8,45 C 14,40 22,37 35,35 L 35,30 C 35,18 43,10 55,10 Z',
          width: 150, height: 76, textTop: '41%', textLeft: '57%'
        },
        right: {
          viewBox: '0 0 220 110',
          path: 'M 165,10 L 25,10 C 13,10 5,18 5,30 L 5,60 C 5,72 13,80 25,80 L 165,80 C 177,80 185,72 185,60 L 185,55 C 198,53 206,50 212,45 C 206,40 198,37 185,35 L 185,30 C 185,18 177,10 165,10 Z',
          width: 150, height: 76, textTop: '41%', textLeft: '43%'
        }
      };

      function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
      }

      function applyBubbleVariant(side) {
        if (!speechBubble) return;
        const v = bubbleVariants[side];
        const svgEl = document.getElementById('peekSpeechSvg');
        const pathEl = document.getElementById('peekSpeechPath');
        if (svgEl) svgEl.setAttribute('viewBox', v.viewBox);
        if (pathEl) pathEl.setAttribute('d', v.path);
        speechBubble.style.width = v.width + 'px';
        if (speechText) {
          speechText.style.top = v.textTop;
          speechText.style.left = v.textLeft;
        }
      }

      function positionSpeechBubble(side) {
        if (!speechBubble) return;
        const v = bubbleVariants[side];
        const catRect = peekingCat.getBoundingClientRect();
        const bubbleW = v.width;
        const bubbleH = v.height;
        const margin = 8;
        let left, top;

        if (side === 'left') {
          left = catRect.right + margin;
          top = catRect.top + catRect.height / 2 - bubbleH / 2;
        } else if (side === 'right') {
          left = catRect.left - bubbleW - margin;
          top = catRect.top + catRect.height / 2 - bubbleH / 2;
        } else if (side === 'top') {
          left = catRect.left + catRect.width / 2 - bubbleW / 2;
          top = catRect.bottom + margin;
        } else {
          left = catRect.left + catRect.width / 2 - bubbleW / 2;
          top = catRect.top - bubbleH - margin;
        }

        left = Math.max(8, Math.min(left, window.innerWidth - bubbleW - 8));
        top = Math.max(8, Math.min(top, window.innerHeight - bubbleH - 8));

        speechBubble.style.left = left + 'px';
        speechBubble.style.top = top + 'px';
      }

      function showPeekingCat() {
        const side = sides[Math.floor(Math.random() * sides.length)];
        // Reset total: kucing mulai dari nol lagi (belum kelihatan sama sekali)
        peekingCat.className = 'peeking-cat peek-' + side;
        if (speechBubble) speechBubble.classList.remove('visible');

        if (side === 'left' || side === 'right') {
          peekingCat.style.top = randomBetween(12, 78) + '%';
          peekingCat.style.left = '';
          peekingCat.style.bottom = '';
        } else {
          const usesLeftBand = Math.random() < 0.5;
          peekingCat.style.left = (usesLeftBand ? randomBetween(8, 28) : randomBetween(72, 92)) + '%';
          peekingCat.style.top = '';
        }

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            peekingCat.classList.add('peek-visible');
          });
        });

        setTimeout(function () {
          peekingCat.classList.add('head-arrived');
        }, HEAD_ARRIVE_DELAY);

        setTimeout(function () {
          if (speechBubble && speechText) {
            speechText.textContent = meowPhrases[Math.floor(Math.random() * meowPhrases.length)];
            applyBubbleVariant(side);
            positionSpeechBubble(side);
            speechBubble.classList.add('visible');
          }
        }, SPEECH_DELAY);

        setTimeout(function () {
          peekingCat.classList.add('peek-creep');
        }, CREEP_DELAY);

        setTimeout(function () {
          peekingCat.classList.remove('peek-visible');
          peekingCat.classList.remove('head-arrived');
          peekingCat.classList.remove('peek-creep');
          if (speechBubble) speechBubble.classList.remove('visible');
          setTimeout(scheduleNextPeek, 600);
        }, PEEK_DURATION);
      }

      function scheduleNextPeek() {
        setTimeout(showPeekingCat, randomBetween(PEEK_MIN_DELAY, PEEK_MAX_DELAY));
      }

      scheduleNextPeek();
    }
  } catch (err) {
    console.error('⚠️ Terjadi error di blok KUCING INTIP:', err);
  }
})();
