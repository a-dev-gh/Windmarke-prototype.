/* =====================================================
   WINDMARKE FINANCE — Prototype interactions
   ===================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  const nav = document.getElementById('nav');
  const navToggle = nav.querySelector('.nav__toggle');

  const updateNavState = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-menu-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero entrance ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__head > *', {
      y: 28,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
    })
    .from(
      '.panel',
      {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        clearProps: 'transform,opacity',
      },
      '-=0.4'
    );

  gsap.from('.trust', {
    y: 36,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.trust', start: 'top 92%' },
  });

  /* ---------- Hero panel interactions (open / close / submit) ---------- */
  document.querySelectorAll('.panel').forEach((panel) => {
    const opener = panel.querySelector('[data-open]');
    const form = panel.querySelector('[data-form]');
    const success = panel.querySelector('[data-success]');
    const closers = panel.querySelectorAll('[data-close]');
    const role = panel.dataset.role;

    const openPanel = () => {
      panel.classList.remove('is-success');
      panel.classList.add('is-open');

      const radio = panel.querySelector(
        `input[name="intent"][value="${role}"]`
      );
      if (radio) radio.checked = true;

      const targets = form.querySelectorAll(
        ':scope > h3, :scope > p, :scope > .field, :scope > .btn'
      );
      gsap.fromTo(
        targets,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.15,
        }
      );

      const firstInput = form.querySelector('input[type="text"]');
      if (firstInput) {
        setTimeout(() => firstInput.focus({ preventScroll: true }), 360);
      }
    };

    const closePanel = () => {
      panel.classList.remove('is-open');
      panel.classList.remove('is-success');
    };

    const submitForm = (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      panel.classList.remove('is-open');
      panel.classList.add('is-success');

      const targets = success.querySelectorAll(
        ':scope > .success__icon, :scope > h3, :scope > p, :scope > .link-btn'
      );
      gsap.fromTo(
        targets,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.1,
        }
      );

      setTimeout(() => form.reset(), 600);
    };

    if (opener) opener.addEventListener('click', openPanel);
    if (form) form.addEventListener('submit', submitForm);
    closers.forEach((c) => c.addEventListener('click', closePanel));
  });

  /* ---------- Audience-card buttons jump to hero panel + open ---------- */
  document.querySelectorAll('[data-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.jump;
      const target = document.querySelector(`.panel[data-role="${role}"]`);
      const heroPanels = document.getElementById('hero-panels');
      if (!target || !heroPanels) return;

      heroPanels.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const opener = target.querySelector('[data-open]');
        if (opener) opener.click();
      }, 700);
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals, 10) || 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            const v = obj.val;
            const formatted =
              decimals > 0
                ? v.toFixed(decimals)
                : Math.round(v).toLocaleString();
            el.textContent = prefix + formatted + suffix;
          },
        });
      },
    });
  });

  /* ---------- Features cards entrance ---------- */
  gsap.utils.toArray('.feature').forEach((card, i) => {
    gsap.from(card, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      delay: i * 0.1,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
  });

  /* ---------- How it works stepper ---------- */
  const stepperLineFill = document.querySelector('.stepper__line-fill');
  const steps = gsap.utils.toArray('.step');

  if (steps.length) {
    const stepperTl = gsap.timeline({
      scrollTrigger: { trigger: '.stepper', start: 'top 75%', once: true },
      defaults: { ease: 'power3.out' },
    });

    stepperTl
      .from(steps, {
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
      })
      .to(
        stepperLineFill,
        {
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
          onStart: () => {
            steps.forEach((s, i) => {
              gsap.delayedCall(i * 0.34, () =>
                s.classList.add('is-active')
              );
            });
          },
        },
        '-=0.3'
      );
  }

  /* ---------- Audience cards entrance ---------- */
  gsap.utils.toArray('.aud-card').forEach((card, i) => {
    gsap.from(card, {
      y: 56,
      opacity: 0,
      duration: 1,
      delay: i * 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
  });

  /* ---------- Offer banner entrance + metric stagger ---------- */
  const offerCard = document.querySelector('.offer__card');
  if (offerCard) {
    gsap.from(offerCard, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.offer', start: 'top 80%' },
    });
    gsap.from('.offer__metric', {
      x: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.offer', start: 'top 70%' },
    });
  }

  /* ---------- Deal cards entrance + progress bar fill ---------- */
  gsap.utils.toArray('.deal').forEach((card, i) => {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      duration: 0.85,
      delay: i * 0.1,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        onEnter: () => {
          const bar = card.querySelector('.deal__progress-bar');
          if (bar) {
            const targetWidth = bar.style.getPropertyValue('--p');
            bar.style.setProperty('--p', '0%');
            requestAnimationFrame(() => {
              bar.style.setProperty('--p', targetWidth);
            });
          }
        },
      },
    });
  });

  /* ---------- CTA form ---------- */
  const ctaSection = document.querySelector('.cta');
  const ctaForm = document.querySelector('[data-cta-form]');
  if (ctaForm && ctaSection) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!ctaForm.checkValidity()) {
        ctaForm.reportValidity();
        return;
      }
      ctaSection.classList.add('is-success');
      setTimeout(() => ctaForm.reset(), 600);
    });
  }
  gsap.from('.cta__card', {
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cta', start: 'top 80%' },
  });

  /* ---------- Section heads reveal ---------- */
  gsap.utils.toArray('.section__head').forEach((head) => {
    gsap.from(head.children, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 88%' },
    });
  });

  /* ---------- Subtle parallax on hero glows ---------- */
  const glows = gsap.utils.toArray('.hero__glow');
  if (glows.length) {
    gsap.to(glows, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  }

  /* ---------- Chat FAB ---------- */
  const chatFab = document.querySelector('[data-chat]');
  const chatToggleBtns = document.querySelectorAll('[data-chat-toggle]');
  const chatForm = document.querySelector('[data-chat-form]');
  const chatBody = document.querySelector('.chat-pop__body');

  const toggleChat = () => {
    if (!chatFab) return;
    const open = chatFab.classList.toggle('is-open');
    const mainBtn = chatFab.querySelector('.chat-fab__btn');
    if (mainBtn) mainBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  chatToggleBtns.forEach((b) => b.addEventListener('click', toggleChat));

  document.querySelectorAll('.chat-suggestion').forEach((s) => {
    s.addEventListener('click', () => {
      addUserMsg(s.textContent);
      simulateBotReply();
    });
  });

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      addUserMsg(text);
      input.value = '';
      simulateBotReply();
    });
  }

  function addUserMsg(text) {
    if (!chatBody) return;
    const msg = document.createElement('div');
    msg.className = 'chat-pop__msg chat-pop__msg--user';
    msg.textContent = text;
    msg.style.cssText =
      'background: var(--ink); color: white; align-self: flex-end; border-radius: 14px 14px 4px 14px; border: none;';
    chatBody.appendChild(msg);
    const suggestions = chatBody.querySelector('.chat-pop__suggestions');
    if (suggestions) suggestions.remove();
    chatBody.scrollTop = chatBody.scrollHeight;
    gsap.from(msg, { y: 8, opacity: 0, duration: 0.3, ease: 'power3.out' });
  }

  function simulateBotReply() {
    if (!chatBody) return;
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-pop__msg';
      reply.textContent =
        "Thanks — a real concierge will follow up via email. In the meantime, request investor access for instant matching.";
      chatBody.appendChild(reply);
      chatBody.scrollTop = chatBody.scrollHeight;
      gsap.from(reply, { y: 8, opacity: 0, duration: 0.3, ease: 'power3.out' });
    }, 700);
  }

  gsap.from('.chat-fab__btn', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    delay: 1.2,
    ease: 'back.out(1.6)',
  });
})();
