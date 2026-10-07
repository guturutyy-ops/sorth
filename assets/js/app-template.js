(function () {
  "use strict";

  const app = document.getElementById("app");
  const products = window.PRODUCTS_DATA || {};
  const siteConfig = window.SITE_CONFIG || {};

  function safeSiteUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "../";
    } catch {
      return "../";
    }
  }

  const mainSiteUrl = safeSiteUrl(siteConfig.MAIN_SITE_URL);
  const businessCardUrl = safeSiteUrl(siteConfig.BUSINESS_CARD_URL);

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function productUrl(value, slug, parameter) {
    const safeUrl = safeHttpsUrl(value);
    if (!safeUrl) return "";
    const url = new URL(safeUrl);
    url.searchParams.set(parameter, slug);
    return url.href;
  }

  function externalLink(value, label, className) {
    const url = safeHttpsUrl(value);
    return url
      ? `<a class="button ${className || "button-secondary"}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`
      : "";
  }

  function renderNutrition(product) {
    const renderRows = (rows) => rows.map(([label, value]) => `
      <tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(value)}</td></tr>
    `).join("");
    const servingValues = product.nutrition.perServing
      ? `<h3>На ${escapeHTML(product.nutrition.servingWeight)}</h3><table class="nutrition-table"><tbody>${renderRows(product.nutrition.perServing)}</tbody></table>`
      : "";

    return `
      <details class="nutrition-details">
        <summary>Пищевая и энергетическая ценность</summary>
        <div class="nutrition-content">
          <h3>Средние значения на 100 г</h3>
          <table class="nutrition-table"><tbody>${renderRows(product.nutrition.per100g)}</tbody></table>
          ${servingValues}
          <p class="small-copy">${escapeHTML(product.nutrition.note)}</p>
        </div>
      </details>
    `;
  }

  function renderServiceCard(name, description, url, slug, parameter) {
    const destination = productUrl(url, slug, parameter);
    const action = destination
      ? `<a class="button button-secondary" href="${escapeHTML(destination)}" target="_blank" rel="noopener noreferrer">Продолжить в ${escapeHTML(name)} <span aria-hidden="true">↗</span></a>`
      : `<span class="button button-disabled" aria-disabled="true">Подключение будет доступно позже</span>`;
    const queryNotice = destination ? `<span class="service-note">Код продукта: ${escapeHTML(slug)}</span>` : "";
    return `<article class="service-card"><span class="service-name">${escapeHTML(name)}</span><p>${escapeHTML(description)}</p>${action}${queryNotice}</article>`;
  }

  function renderChooser() {
    const cards = Object.values(products).map((product) => `
      <a class="choice-link" href="?product=${encodeURIComponent(product.slug)}">
        <img src="${escapeHTML(product.image)}" alt="" loading="lazy">
        <span class="choice-title">${escapeHTML(product.title)}</span>
        <span class="choice-action">Открыть продукт <span aria-hidden="true">→</span></span>
      </a>
    `).join("");

    app.innerHTML = `
      <header class="site-header">
        <a class="wordmark" href="${escapeHTML(mainSiteUrl)}" aria-label="ХилСорт, основной сайт"><img class="brand-mascot" src="mascot.png" alt="">ХилСорт</a>
        <a class="header-note" href="${escapeHTML(businessCardUrl)}">Сайт-визитка <span aria-hidden="true">↗</span></a>
      </header>
      <main class="chooser" aria-labelledby="page-title">
        <p class="eyebrow">ХилСорт · сопровождение продукта</p>
        <h1 id="page-title">Выберите продукт</h1>
        <p class="intro">Ваша упаковка — начало сопровождения. Выберите продукт, чтобы открыть состав, правила приема и документы.</p>
        <div class="choice-list">${cards}</div>
      </main>
      ${renderFooter()}
    `;
  }

  function renderProduct(product) {
    const batchDescription = "Дата изготовления и номер партии указаны на этикетке вашей упаковки.";
    const shopLink = externalLink(siteConfig.MAIN_SITE_URL, "Перейти на основной сайт", "button-primary");
    const telegramCard = renderServiceCard("Telegram", "Напоминания и сопровождение курса в привычном мессенджере.", siteConfig.TELEGRAM_BOT_URL, product.slug, "start");
    const maxCard = renderServiceCard("MAX", "Подключение сопровождения курса в MAX.", siteConfig.MAX_BOT_URL, product.slug, "start");
    const reactionEndpoint = safeHttpsUrl(siteConfig.REACTION_ENDPOINT);
    const privacyUrl = safeHttpsUrl(siteConfig.REACTION_PRIVACY_URL);
    const reactionEnabled = Boolean(reactionEndpoint && privacyUrl);
    const reactionDisabled = reactionEnabled ? "" : "disabled";
    const sgrLink = externalLink(product.sgrFileUrl, "Посмотреть СГР");
    const labelLink = externalLink(product.labelFileUrl, "Посмотреть информацию с упаковки");
    const manufacturer = product.manufacturer;
    const orderedBy = product.orderedBy;

    app.innerHTML = `
      <header class="site-header">
        <a class="wordmark" href="${escapeHTML(mainSiteUrl)}" aria-label="ХилСорт, основной сайт"><img class="brand-mascot" src="mascot.png" alt="">ХилСорт</a>
        <a class="header-note" href="${escapeHTML(businessCardUrl)}">Сайт-визитка <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section class="hero" aria-labelledby="product-title">
          <figure class="product-visual">
            <img class="product-image" src="${escapeHTML(product.image)}" alt="Банка «${escapeHTML(product.title)}»" fetchpriority="high">
          </figure>
          <div class="hero-copy">
            <p class="eyebrow"><span class="status-check" aria-hidden="true">✓</span> Продукт распознан</p>
            <h1 id="product-title">${escapeHTML(product.title)}</h1>
            <p class="category">${escapeHTML(product.category)}</p>
            <p class="hero-description">Здесь собрана информация о вашем продукте: состав, способ применения, документы и цифровое сопровождение.</p>
            <a class="button button-primary" href="#companion">Начать сопровождение <span aria-hidden="true">↓</span></a>
            <a class="olion-shortcut" href="#olion">Спросить Олиона <span aria-hidden="true">↗</span></a>
          </div>
          <nav class="quick-actions" aria-label="Разделы продукта">
            <a href="#usage"><span aria-hidden="true">01</span>Как принимать</a>
            <a href="#composition"><span aria-hidden="true">02</span>Что внутри</a>
            <a href="#documents"><span aria-hidden="true">03</span>Документы</a>
            <a href="#about"><span aria-hidden="true">04</span>О продукте</a>
          </nav>
        </section>

        <section class="info-section companion-section" id="companion" aria-labelledby="companion-title">
          <div class="section-heading"><span>01</span><h2 id="companion-title">Ваш ХилСорт</h2></div>
          <p>Продукт — это только начало. Вы можете подключить цифровое сопровождение, а основная информация о продукте всегда останется здесь.</p>
          <h3 class="service-question">Где вам удобнее получать сопровождение?</h3>
          <div class="service-grid">
            ${telegramCard}
            ${maxCard}
            <article class="service-card service-website"><span class="service-name">Остаться здесь</span><p>Состав, правила приема и документы всегда доступны на этой странице.</p><a class="button button-secondary" href="#usage">Продолжить на этой странице</a></article>
          </div>
        </section>

        <section class="info-section" id="usage" aria-labelledby="usage-title">
          <div class="section-heading"><span>02</span><h2 id="usage-title">Как принимать</h2></div>
          <article class="data-panel dose-panel">
            <p class="panel-label">Во время еды</p>
            <p class="large-copy">${escapeHTML(product.dailyServing)}${product.slug === "inositol" ? "<br>1 раз в день" : " в день"}</p>
            <p class="dose-duration">${escapeHTML(product.usage)}</p>
            <p class="dose-duration">Продолжительность приема — ${escapeHTML(product.duration)}.</p>
            <p class="dose-duration">${escapeHTML(product.repeat)}</p>
          </article>
        </section>

        <section class="info-section" id="composition" aria-labelledby="composition-title">
          <div class="section-heading"><span>03</span><h2 id="composition-title">Что внутри</h2></div>
          <article class="data-panel active-panel">
            <p class="panel-label">Активное вещество</p>
            <h3>${escapeHTML(product.activeName)}</h3>
            ${product.slug === "inositol"
              ? `<p class="amount">${escapeHTML(product.activeDaily)} в суточной дозировке — ${escapeHTML(product.dailyServing)}</p><p class="small-copy">${escapeHTML(product.dailyPercentage)}</p><p class="small-copy">${escapeHTML(product.upperLimitNote)}</p>`
              : `<div class="magnesium-amounts"><div><span>1 капсула</span><strong>${escapeHTML(product.activeOneCapsule)}</strong><small>${escapeHTML(product.percentageOne)}</small></div><div><span>3 капсулы</span><strong>${escapeHTML(product.activeThreeCapsules)}</strong><small>${escapeHTML(product.percentageThree)}</small></div></div><p class="small-copy">${escapeHTML(product.rusPLabel)}</p>`}
          </article>
          <article class="data-panel composition-panel">
            <p class="panel-label">Полный состав</p>
            <p>${escapeHTML(product.composition)}</p>
          </article>
          ${renderNutrition(product)}
        </section>

        <section class="info-section" id="purpose" aria-labelledby="purpose-title">
          <div class="section-heading"><span>04</span><h2 id="purpose-title">Область применения</h2></div>
          <article class="data-panel purpose-panel"><p>${escapeHTML(product.intendedUse)}</p></article>
        </section>

        <section class="info-section" id="about" aria-labelledby="about-title">
          <div class="section-heading"><span>05</span><h2 id="about-title">О продукте</h2></div>
          <dl class="spec-list">
            <div><dt>Официальное название</dt><dd>${escapeHTML(product.officialName)}</dd></div>
            <div><dt>Форма выпуска</dt><dd>${escapeHTML(product.form)} Количество: ${escapeHTML(product.capsules)} капсул.</dd></div>
            <div><dt>Штрихкод</dt><dd>${escapeHTML(product.barcode)}</dd></div>
            <div><dt>Дата изготовления и номер партии</dt><dd>${batchDescription}</dd></div>
          </dl>
        </section>

        <section class="info-section" id="contraindications" aria-labelledby="contraindications-title">
          <div class="section-heading"><span>06</span><h2 id="contraindications-title">Предупреждения</h2></div>
          <article class="data-panel warning-panel"><p><strong>Противопоказания:</strong> ${escapeHTML(product.contraindications)}</p><p>${escapeHTML(product.doctorNotice)}</p><p class="small-copy">${escapeHTML(product.drugDisclaimer)}</p></article>
        </section>

        <section class="info-section" id="documents" aria-labelledby="documents-title">
          <div class="section-heading"><span>07</span><h2 id="documents-title">Проверьте продукт</h2></div>
          <p class="section-intro">Мы хотим, чтобы вы понимали, что покупаете. Основные сведения о продукте и его регистрации доступны здесь.</p>
          <article class="data-panel document-panel">
            <p class="panel-label">Государственная регистрация</p>
            <p class="document-number">СГР № ${escapeHTML(product.sgr)}</p>
            <p>от ${escapeHTML(product.sgrDate)}</p>
            ${sgrLink || `<p class="small-copy">Файл СГР пока не добавлен в материалы проекта. Номер и дата приведены по договорной спецификации.</p>`}
          </article>
          <article class="data-panel document-panel">
            <p class="panel-label">Техническая документация</p>
            <p>${escapeHTML(product.tu)}</p>
          </article>
          <article class="data-panel document-panel">
            <p class="panel-label">Этикетка</p>
            ${labelLink || `<p class="small-copy">Файл финальной этикетки пока не добавлен в материалы проекта.</p>`}
          </article>
        </section>

        <section class="info-section storage-section" id="storage" aria-labelledby="storage-title">
          <div class="section-heading"><span>08</span><h2 id="storage-title">Как хранить</h2></div>
          <article class="storage-note"><span class="storage-icon" aria-hidden="true">✳</span><div><p>${escapeHTML(product.storage)}</p><p class="small-copy">Срок годности: ${escapeHTML(product.shelfLife)}</p></div></article>
        </section>

        <section class="info-section people-section" id="company" aria-labelledby="company-title">
          <div class="section-heading"><span>09</span><h2 id="company-title">Кто стоит за продуктом</h2></div>
          <article class="data-panel company-panel">
            <p class="panel-label">Изготовитель и организация, уполномоченная принимать претензии</p>
            <h3>${escapeHTML(manufacturer.name)}</h3>
            <p>${escapeHTML(manufacturer.address)}</p>
            <a class="company-phone" href="tel:+79015005115">${escapeHTML(manufacturer.phone)}</a>
          </article>
          <article class="data-panel company-panel ordered-panel">
            <p class="panel-label">Изготовлено по заказу</p>
            <h3>${escapeHTML(orderedBy.name)}</h3>
            <p>${escapeHTML(orderedBy.address)}</p>
            <p class="small-copy">Бренд: ${escapeHTML(product.brand)}</p>
          </article>
        </section>

        <section class="info-section assistant-section" id="olion" aria-labelledby="olion-title">
          <div class="section-heading"><span>10</span><h2 id="olion-title">Спросить Олиона</h2></div>
          <div class="assistant-layout">
            <div class="assistant-portrait"><img src="mascot.png" alt="Олион, помощник ХилСорт" loading="lazy"><p>Олион</p><span>Помощник ХилСорт</span></div>
            <div class="assistant-chat">
              <div class="chat-messages" id="olion-messages" role="log" aria-live="polite" aria-relevant="additions">
                <article class="chat-message olion-message"><strong>Олион</strong><p>Привет! Выберите вопрос, и я отвечу здесь, по информации о вашем продукте.</p></article>
              </div>
              <div class="question-list" aria-label="Быстрые вопросы Олиону">
                <button type="button" data-olion-question="usage">Как принимать?</button>
                <button type="button" data-olion-question="composition">Что в составе?</button>
                <button type="button" data-olion-question="documents">Покажи документы</button>
                <button type="button" data-olion-question="contraindications">Какие противопоказания?</button>
                <button type="button" data-olion-question="companion">Как подключить сопровождение?</button>
              </div>
              <p class="assistant-disclaimer">Олион помогает найти сведения на странице и не ставит диагнозы.</p>
            </div>
          </div>
        </section>

        <section class="info-section reaction-section" id="reaction" aria-labelledby="reaction-title">
          <div class="section-heading"><span>11</span><h2 id="reaction-title">Сообщить о реакции</h2></div>
          <p>Если во время приема продукта вы заметили необычную реакцию, сообщите нам об этом.</p>
          <p class="privacy-note">При тяжелом или быстро нарастающем состоянии не ждите ответа поддержки и обратитесь за медицинской помощью.</p>
          <form class="reaction-form" data-endpoint="${escapeHTML(reactionEndpoint)}" aria-describedby="reaction-help">
            <p id="reaction-help" class="small-copy">${reactionEnabled ? `Перед отправкой ознакомьтесь с <a href="${escapeHTML(privacyUrl)}" target="_blank" rel="noopener noreferrer">условиями обработки данных</a> и подтвердите согласие.` : "Защищенный канал и ссылка на условия обработки данных еще не настроены, поэтому поля отключены и данные не отправляются."}</p>
            <input type="hidden" name="product" value="${escapeHTML(product.slug)}" ${reactionDisabled}>
            <label>Имя<input name="name" autocomplete="name" ${reactionDisabled}></label>
            <label>Контакт для обратной связи<input name="contact" autocomplete="off" ${reactionDisabled}></label>
            <label>Дата или примерная дата приема<input name="date" type="date" ${reactionDisabled}></label>
            <label>Описание реакции<textarea name="reaction" rows="3" ${reactionDisabled}></textarea></label>
            <label>Комментарий<textarea name="comment" rows="2" ${reactionDisabled}></textarea></label>
            <label class="consent-label"><input name="consent" type="checkbox" required ${reactionDisabled}> Согласие на обработку данных</label>
            <button class="button ${reactionEnabled ? "button-primary" : "button-disabled"}" type="submit" ${reactionDisabled}>Отправить сообщение</button>
            <p class="reaction-status" id="reaction-status" aria-live="polite"></p>
          </form>
        </section>

        <section class="info-section buy-section" id="buy-again" aria-labelledby="buy-title">
          <div class="section-heading"><span>12</span><h2 id="buy-title">Купить снова</h2></div>
          <p>Карточка продукта в интернет-магазине.</p>
          ${shopLink}
        </section>
      </main>
      ${renderFooter()}
    `;

    const olionAnswers = {
      usage: `${product.usage} Продолжительность приема — ${product.duration}. ${product.repeat}`,
      composition: product.slug === "inositol"
        ? `${product.activeName}: ${product.activeDaily} в суточной дозировке — ${product.dailyServing}. ${product.dailyPercentage} ${product.upperLimitNote} Состав: ${product.composition}`
        : `${product.activeName}: ${product.activeOneCapsule} в 1 капсуле (${product.percentageOne}) или ${product.activeThreeCapsules} в 3 капсулах (${product.percentageThree}). Состав: ${product.composition}`,
      documents: `СГР № ${product.sgr} от ${product.sgrDate}. ${product.tu}. Скан СГР и файл этикетки пока не добавлены, поэтому ссылки на документы недоступны.`,
      contraindications: `Противопоказания: ${product.contraindications} ${product.doctorNotice} ${product.drugDisclaimer}`,
      companion: siteConfig.TELEGRAM_BOT_URL
        ? `Сопровождение доступно через Telegram. Откройте карточку Telegram выше: к боту будет передан код продукта «${product.slug}».`
        : "Telegram-бот @healsort_bot указан, но автоматический переход пока не настроен. Основная информация о продукте всегда доступна на этой странице."
    };

    app.querySelectorAll("[data-olion-question]").forEach((button) => {
      button.addEventListener("click", () => {
        const messages = app.querySelector("#olion-messages");
        const userMessage = document.createElement("article");
        userMessage.className = "chat-message user-message";
        userMessage.textContent = button.textContent.trim();

        const answerMessage = document.createElement("article");
        answerMessage.className = "chat-message olion-message";
        const sender = document.createElement("strong");
        sender.textContent = "Олион";
        const answer = document.createElement("p");
        answer.textContent = olionAnswers[button.dataset.olionQuestion] || "Не нашел этот ответ в информации о продукте.";
        answerMessage.append(sender, answer);
        messages.append(userMessage, answerMessage);
        messages.scrollTop = messages.scrollHeight;
      });
    });

    const reactionForm = app.querySelector(".reaction-form");
    if (reactionEnabled) {
      reactionForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!reactionForm.reportValidity()) return;

        const submitButton = reactionForm.querySelector("[type=submit]");
        const status = reactionForm.querySelector(".reaction-status");
        const payload = Object.fromEntries(new FormData(reactionForm));
        payload.consent = true;
        submitButton.disabled = true;
        status.textContent = "Отправка…";

        try {
          const response = await fetch(reactionEndpoint, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error("Request failed");
          reactionForm.reset();
          status.textContent = "Спасибо. Сообщение принято.";
        } catch {
          status.textContent = "Не удалось отправить сообщение. Повторите попытку позже.";
          submitButton.disabled = false;
        }
      });
    }
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <a class="wordmark" href="../"><img class="brand-mascot" src="mascot.png" alt="">ХилСорт</a>
        <p>Справочная информация о биологически активных добавках.</p>
        <p>БАД. Не является лекарственным средством.</p>
        <div class="footer-links"><a href="${escapeHTML(mainSiteUrl)}">Основной сайт ↗</a><a href="${escapeHTML(businessCardUrl)}">Сайт-визитка ↗</a><a href="https://t.me/healsort_bot" target="_blank" rel="noopener noreferrer">Telegram-бот ↗</a></div>
      </footer>
    `;
  }

  const productKey = new URLSearchParams(window.location.search).get("product");
  const product = productKey && Object.prototype.hasOwnProperty.call(products, productKey)
    ? products[productKey]
    : null;

  if (product) {
    renderProduct(product);
    if (window.trackEvent) {
      window.trackEvent("qr_open", { product: product.slug });
      window.trackEvent("product_page_view", { product: product.slug });
    }
  } else {
    renderChooser();
  }
})();
