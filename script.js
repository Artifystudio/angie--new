/* ============================================================
   ANGIE BEVERAGES & SALADS — APP LOGIC
   ============================================================ */

(function () {
  "use strict";

  /* ---------- State ---------- */
  let cart = JSON.parse(localStorage.getItem("angie_cart") || "[]");
  let activeCategory = "all";
  let searchQuery = "";
  let activeTagFilters = [];
  let lineCounter = 1;
  let pendingModalItem = null; // item currently open in product modal
  let planSelectedSalads = [];

  /* ---------- Helpers ---------- */
  const fmt = (n) => "UGX " + n.toLocaleString("en-UG");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function saveCart() {
    localStorage.setItem("angie_cart", JSON.stringify(cart));
  }

  function flattenAllItems() {
    const out = [];
    Object.keys(MENU).forEach((cat) => {
      MENU[cat].forEach((item) => out.push({ ...item, category: cat }));
    });
    return out;
  }
  const ALL_ITEMS = flattenAllItems();

  function getItemById(itemId) {
    if (itemId === "plan-weekly") {
      return { id: "plan-weekly", name: MEAL_PLAN.name, image: MEAL_PLAN.image, category: "plan" };
    }
    return ALL_ITEMS.find((i) => i.id === itemId);
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Header / static setup ---------- */
  function findCategoryMeta(catId) {
    return CATEGORIES.find((c) => c.id === catId) || { icon: "🌿" };
  }

  // Builds an image block: a real <img> that fades in on load, sitting over
  // a branded gradient fallback that stays visible if the photo 404s or
  // hasn't been added yet. `size` controls icon scale ("small" for thumbs).
  function buildImageBlock(item, size) {
    const meta = findCategoryMeta(item.category);
    const wrapClass = "item-img-wrap" + (size === "small" ? " small" : "");
    const src = item.image || "";
    return `
      <div class="${wrapClass}">
        <div class="img-fallback">
          <span class="icon">${meta.icon || "🌿"}</span>
          <span class="cap">Angie</span>
        </div>
        ${
          src
            ? `<img class="item-img" src="${src}" alt="${item.name}" loading="lazy"
                 onload="this.classList.add('loaded')"
                 onerror="this.style.display='none'" />`
            : ""
        }
      </div>
    `;
  }

  function initHeader() {
    $("#whatsapp-order-btn").href = waLink(
      `Hello Angie Beverages & Salads! 👋 I'd like to place an order.`
    );
    $("#floating-whatsapp").href = waLink(
      `Hello Angie Beverages & Salads, I would like to make an enquiry.`
    );
    $("#call-link").href = "tel:" + CONTACT.callNumber.replace(/\s/g, "");
    $("#footer-call").href = "tel:" + CONTACT.callNumber.replace(/\s/g, "");
    $("#footer-wa").href = waLink("Hello Angie Beverages & Salads! 👋");
    $("#footer-wa-number").textContent = CONTACT.whatsappDisplay;
    $("#footer-call-number").textContent = CONTACT.callNumber;
  }

  function waLink(message) {
    return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /* ---------- Category nav ---------- */
  function renderCategoryNav() {
    const nav = $("#category-scroll");
    nav.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "cat-chip" + (cat.id === activeCategory ? " active" : "");
      btn.textContent = cat.label;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.id === activeCategory ? "true" : "false");
      btn.addEventListener("click", () => {
        activeCategory = cat.id;
        renderCategoryNav();
        renderMenu();
        if (cat.id === "plan") {
          document.getElementById("meal-plan-section").scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          document.getElementById("menu-sections").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      nav.appendChild(btn);
    });
  }

  /* ---------- Popular carousel ---------- */
  function renderPopular() {
    const wrap = $("#popular-scroll");
    wrap.innerHTML = "";
    const popularItems = ALL_ITEMS.filter((i) => i.popular);
    popularItems.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "popular-card";
      card.innerHTML = `
        <div style="position:relative;">
          ${buildImageBlock(item, "small")}
          <div class="badge-num">${String(idx + 1).padStart(2, "0")}</div>
        </div>
        <div class="popular-card-body">
          <h4>${item.name}</h4>
          <div class="price">${fmt(item.price)}</div>
        </div>
      `;
      card.addEventListener("click", () => openProductModal(item));
      wrap.appendChild(card);
    });
  }

  /* ---------- Tag filters ---------- */
  function renderFilters() {
    const wrap = $("#filter-row");
    const tags = new Set();
    ALL_ITEMS.forEach((i) => (i.tags || []).forEach((t) => tags.add(t)));
    wrap.innerHTML = "";
    Array.from(tags).sort().forEach((tag) => {
      const chip = document.createElement("button");
      chip.className = "filter-chip" + (activeTagFilters.includes(tag) ? " selected" : "");
      chip.textContent = tag;
      chip.addEventListener("click", () => {
        if (activeTagFilters.includes(tag)) {
          activeTagFilters = activeTagFilters.filter((t) => t !== tag);
        } else {
          activeTagFilters.push(tag);
        }
        renderFilters();
        renderMenu();
      });
      wrap.appendChild(chip);
    });
  }

  /* ---------- Menu rendering ---------- */
  const CATEGORY_SECTION_META = {
    salads: { title: "Signature Salads", eyebrow: "Fresh & Filling" },
    juices: { title: "Fresh Juices", eyebrow: "100% Natural" },
    detox: { title: "Detox Shots", eyebrow: "Half Dozen" },
    smoothies: { title: "Signature Smoothies", eyebrow: "Nutrient Packed" },
    shakes: { title: "Protein Shakes", eyebrow: "Fuel Up" },
    breakfast: { title: "Healthy Breakfast", eyebrow: "Start Fresh" },
  };

  function itemMatchesSearch(item) {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  function itemMatchesFilters(item) {
    if (activeTagFilters.length === 0) return true;
    return activeTagFilters.every((f) => (item.tags || []).includes(f));
  }

  function renderMenu() {
    const container = $("#menu-sections");
    container.innerHTML = "";
    const categoriesToShow =
      activeCategory === "all" || activeCategory === "plan"
        ? Object.keys(CATEGORY_SECTION_META)
        : [activeCategory];

    let totalShown = 0;

    categoriesToShow.forEach((catKey) => {
      if (!MENU[catKey]) return;
      const items = MENU[catKey].filter(
        (item) => itemMatchesSearch(item) && itemMatchesFilters(item)
      );
      if (items.length === 0) return;
      totalShown += items.length;

      const section = document.createElement("section");
      section.className = "menu-section";
      section.id = "section-" + catKey;

      const meta = CATEGORY_SECTION_META[catKey];
      section.innerHTML = `
        <div class="section-eyebrow">${meta.eyebrow}</div>
        <h2 class="section-title">${meta.title}</h2>
      `;

      const grid = document.createElement("div");
      grid.className = "item-grid";
      items.forEach((item) => grid.appendChild(buildItemCard({ ...item, category: catKey })));
      section.appendChild(grid);
      container.appendChild(section);
    });

    if (totalShown === 0) {
      container.innerHTML = `<div class="no-results">No items match your search. Try a different keyword or clear filters.</div>`;
    }

    // meal plan section visibility
    const planSection = $("#meal-plan-section");
    planSection.style.display =
      activeCategory === "all" || activeCategory === "plan" ? "" : "none";
  }

  function buildItemCard(item) {
    const card = document.createElement("article");
    card.className = "item-card";

    const existingLine = cart.find((l) => l.itemId === item.id && !l.custom);
    const needsCustomize = !!item.dressing;

    card.innerHTML = `
      ${buildImageBlock(item)}
      <div class="item-card-top">
        <h3 tabindex="0" role="button">${item.name}</h3>
        <div class="price">${fmt(item.price)}</div>
      </div>
      <p class="desc" tabindex="0" role="button">${item.desc}</p>
      <div class="tag-row">${(item.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="item-card-bottom" data-role="cta-slot"></div>
    `;

    $("h3", card).addEventListener("click", () => openProductModal(item));
    $("p.desc", card).addEventListener("click", () => openProductModal(item));
    $(".item-img-wrap", card).addEventListener("click", () => openProductModal(item));

    const ctaSlot = $('[data-role="cta-slot"]', card);
    renderCardCta(ctaSlot, item, needsCustomize, existingLine);

    return card;
  }

  function renderCardCta(slot, item, needsCustomize, existingLine) {
    slot.innerHTML = "";
    if (needsCustomize) {
      const btn = document.createElement("button");
      btn.className = "add-btn";
      btn.textContent = "Customize & Add";
      btn.addEventListener("click", () => openProductModal(item));
      slot.appendChild(btn);
      return;
    }

    if (existingLine) {
      const stepper = document.createElement("div");
      stepper.className = "qty-stepper";
      stepper.innerHTML = `
        <button aria-label="Decrease quantity" data-action="dec">−</button>
        <span>${existingLine.qty}</span>
        <button aria-label="Increase quantity" data-action="inc">+</button>
      `;
      $('[data-action="dec"]', stepper).addEventListener("click", () => {
        changeLineQty(existingLine.lineId, -1);
      });
      $('[data-action="inc"]', stepper).addEventListener("click", () => {
        changeLineQty(existingLine.lineId, 1);
      });
      slot.appendChild(stepper);
    } else {
      const btn = document.createElement("button");
      btn.className = "add-btn";
      btn.textContent = "Add to Order";
      btn.addEventListener("click", () => {
        quickAdd(item);
      });
      slot.appendChild(btn);
    }
  }

  /* ---------- Cart operations ---------- */
  function quickAdd(item) {
    const existing = cart.find((l) => l.itemId === item.id && !l.custom);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        lineId: "L" + lineCounter++,
        itemId: item.id,
        name: item.name,
        unitPrice: item.price,
        qty: 1,
        category: item.category,
        custom: false,
        options: null,
      });
    }
    saveCart();
    renderMenu();
    updateFloatingCart();
    toast(`${item.name} added to your order`);
  }

  function addCustomLine(item, qty, options, unitPriceOverride) {
    cart.push({
      lineId: "L" + lineCounter++,
      itemId: item.id,
      name: item.name,
      unitPrice: unitPriceOverride != null ? unitPriceOverride : item.price,
      qty,
      category: item.category || "salads",
      custom: true,
      options,
    });
    saveCart();
    renderMenu();
    updateFloatingCart();
    toast(`${item.name} added to your order`);
  }

  function changeLineQty(lineId, delta) {
    const line = cart.find((l) => l.lineId === lineId);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      cart = cart.filter((l) => l.lineId !== lineId);
    }
    saveCart();
    renderMenu();
    renderCart();
    updateFloatingCart();
  }

  function removeLine(lineId) {
    cart = cart.filter((l) => l.lineId !== lineId);
    saveCart();
    renderMenu();
    renderCart();
    updateFloatingCart();
  }

  function lineTotal(line) {
    let total = line.unitPrice * line.qty;
    if (line.options && line.options.addons) {
      const addonSum = line.options.addons.reduce((s, a) => s + a.price, 0);
      total += addonSum * line.qty;
    }
    return total;
  }

  function cartTotal() {
    return cart.reduce((sum, l) => sum + lineTotal(l), 0);
  }
  function cartCount() {
    return cart.reduce((sum, l) => sum + l.qty, 0);
  }

  function updateFloatingCart() {
    const bar = $("#floating-cart");
    const count = cartCount();
    if (count === 0) {
      bar.classList.remove("visible");
    } else {
      bar.classList.add("visible");
      $("#floating-cart-count").textContent = `${count} item${count > 1 ? "s" : ""}`;
      $("#floating-cart-total").textContent = fmt(cartTotal());
    }
    updateHeaderCartCount();
  }

  function updateHeaderCartCount() {
    const count = cartCount();
    const badge = $("#header-cart-count");
    badge.textContent = count > 0 ? `(${count})` : "";
  }

  /* ---------- Product modal ---------- */
  function openProductModal(item) {
    pendingModalItem = item;
    let selectedDressing = null;
    const selectedAddons = [];
    let qty = 1;

    const overlay = $("#product-overlay");
    const sheet = $("#product-sheet-body");

    function extraTotal() {
      return selectedAddons.reduce((s, a) => s + a.price, 0);
    }
    function currentUnit() {
      return item.price + extraTotal();
    }

    function render() {
      sheet.innerHTML = `
        <div class="pd-hero">${buildImageBlock(item)}</div>
        <div class="pd-title">${item.name}</div>
        <div class="pd-price" id="pd-live-price">${fmt(currentUnit())}</div>
        <p class="pd-desc">${item.desc}</p>
        ${
          item.dressing
            ? `<div class="pd-block">
                <h4>Choose a dressing</h4>
                <div class="chip-select" id="dressing-select"></div>
              </div>
              <div class="pd-block">
                <h4>Add extras (optional)</h4>
                <div class="chip-select" id="addon-select"></div>
              </div>`
            : ""
        }
        <div class="pd-footer">
          <div class="qty-stepper" id="pd-qty">
            <button aria-label="Decrease quantity" data-action="dec">−</button>
            <span id="pd-qty-val">${qty}</span>
            <button aria-label="Increase quantity" data-action="inc">+</button>
          </div>
          <button class="btn btn-whatsapp btn-block" id="pd-add-btn">Add to Order</button>
        </div>
      `;

      if (item.dressing) {
        const dWrap = $("#dressing-select");
        DRESSINGS.forEach((d) => {
          const chip = document.createElement("button");
          chip.className = "chip-option" + (selectedDressing === d ? " selected" : "");
          chip.textContent = d;
          chip.addEventListener("click", () => {
            selectedDressing = selectedDressing === d ? null : d;
            render();
          });
          dWrap.appendChild(chip);
        });

        const aWrap = $("#addon-select");
        ADDON_GROUPS.forEach((group) => {
          group.options.forEach((opt) => {
            const isSelected = selectedAddons.some((a) => a.id === opt.id);
            const chip = document.createElement("button");
            chip.className = "chip-option" + (isSelected ? " selected" : "");
            chip.innerHTML = `${opt.name} <span class="plus">+${fmt(opt.price)}</span>`;
            chip.addEventListener("click", () => {
              const idx = selectedAddons.findIndex((a) => a.id === opt.id);
              if (idx >= 0) selectedAddons.splice(idx, 1);
              else selectedAddons.push(opt);
              render();
            });
            aWrap.appendChild(chip);
          });
        });
      }

      $('[data-action="dec"]', sheet).addEventListener("click", () => {
        if (qty > 1) qty--;
        render();
      });
      $('[data-action="inc"]', sheet).addEventListener("click", () => {
        qty++;
        render();
      });

      $("#pd-add-btn").addEventListener("click", () => {
        if (item.dressing) {
          addCustomLine(
            item,
            qty,
            { dressing: selectedDressing, addons: [...selectedAddons] },
            item.price
          );
        } else {
          for (let i = 0; i < qty; i++) quickAdd(item);
        }
        closeOverlay(overlay);
      });
    }

    render();
    openOverlay(overlay);
  }

  /* ---------- Meal plan modal ---------- */
  function openPlanModal() {
    planSelectedSalads = [];
    const overlay = $("#plan-overlay");
    const body = $("#plan-sheet-body");

    function render() {
      body.innerHTML = `
        <div class="pd-hero">${buildImageBlock({ image: MEAL_PLAN.image, name: MEAL_PLAN.name, category: "plan" })}</div>
        <div class="pd-title">${MEAL_PLAN.name}</div>
        <div class="pd-price">${fmt(MEAL_PLAN.price)} / week</div>
        <p class="pd-desc">${MEAL_PLAN.desc}</p>
        <div class="pd-block">
          <h4>Pick 3 salads for your week</h4>
          <div class="plan-counter" id="plan-counter">${planSelectedSalads.length} / 3 selected</div>
          <div class="plan-pick-list" id="plan-pick-list"></div>
        </div>
        <div class="pd-footer">
          <button class="btn btn-whatsapp btn-block" id="plan-add-btn">Add Plan to Order</button>
        </div>
      `;
      const list = $("#plan-pick-list");
      MENU.salads.forEach((s) => {
        const row = document.createElement("label");
        const isChecked = planSelectedSalads.includes(s.name);
        row.className = "plan-pick-item" + (isChecked ? " selected" : "");
        row.innerHTML = `<input type="checkbox" ${isChecked ? "checked" : ""} /> <span>${s.name}</span>`;
        const input = $("input", row);
        input.addEventListener("change", () => {
          if (input.checked) {
            if (planSelectedSalads.length >= 3) {
              input.checked = false;
              toast("You can choose up to 3 salads");
              return;
            }
            planSelectedSalads.push(s.name);
          } else {
            planSelectedSalads = planSelectedSalads.filter((n) => n !== s.name);
          }
          render();
        });
        list.appendChild(row);
      });

      $("#plan-add-btn").addEventListener("click", () => {
        if (planSelectedSalads.length < 3) {
          toast("Please choose 3 salads for your plan");
          return;
        }
        addCustomLine(
          { id: "plan-weekly", name: MEAL_PLAN.name, price: MEAL_PLAN.price, category: "plan" },
          1,
          { salads: [...planSelectedSalads] },
          MEAL_PLAN.price
        );
        closeOverlay(overlay);
      });
    }
    render();
    openOverlay(overlay);
  }

  /* ---------- Cart sheet ---------- */
  function renderCart() {
    const body = $("#cart-sheet-body");
    if (cart.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="emoji">🥗</div>
          <p>Your order is empty. Browse the menu and add something fresh.</p>
        </div>
      `;
      return;
    }

    let html = "";
    cart.forEach((line) => {
      let metaBits = [];
      if (line.options) {
        if (line.options.dressing) metaBits.push(line.options.dressing);
        if (line.options.addons && line.options.addons.length)
          metaBits.push(line.options.addons.map((a) => a.name).join(", "));
        if (line.options.salads) metaBits.push("Salads: " + line.options.salads.join(", "));
      }
      const sourceItem = getItemById(line.itemId) || { name: line.name, category: line.category };
      html += `
        <div class="cart-item">
          <div class="ci-left">
            <div class="ci-thumb">${buildImageBlock(sourceItem, "small")}</div>
            <div>
              <div class="ci-name">${line.name}</div>
              ${metaBits.length ? `<div class="ci-meta">${metaBits.join(" • ")}</div>` : ""}
              <div class="ci-price">${fmt(lineTotal(line))}</div>
            </div>
          </div>
          <div class="ci-right">
            <div class="qty-stepper">
              <button aria-label="Decrease quantity" data-line="${line.lineId}" data-action="dec">−</button>
              <span>${line.qty}</span>
              <button aria-label="Increase quantity" data-line="${line.lineId}" data-action="inc">+</button>
            </div>
            <button class="ci-remove" data-line="${line.lineId}" data-action="remove">Remove</button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="cart-summary">
        <div class="row total"><span>Total</span><span>${fmt(cartTotal())}</span></div>
      </div>
    `;

    body.innerHTML = html;

    $all('[data-action="dec"]', body).forEach((b) =>
      b.addEventListener("click", () => changeLineQty(b.dataset.line, -1))
    );
    $all('[data-action="inc"]', body).forEach((b) =>
      b.addEventListener("click", () => changeLineQty(b.dataset.line, 1))
    );
    $all('[data-action="remove"]', body).forEach((b) =>
      b.addEventListener("click", () => removeLine(b.dataset.line))
    );
  }

  /* ---------- Checkout form ---------- */
  let fulfilment = "delivery";

  function openCheckout() {
    if (cart.length === 0) {
      toast("Add something to your order first");
      return;
    }
    closeOverlay($("#cart-overlay"));
    const overlay = $("#checkout-overlay");
    fulfilment = "delivery";
    renderCheckoutForm();
    openOverlay(overlay);
  }

  function renderCheckoutForm() {
    $("#delivery-field").style.display = fulfilment === "delivery" ? "" : "none";
    $all(".toggle-btn").forEach((b) => {
      b.classList.toggle("selected", b.dataset.mode === fulfilment);
    });
  }

  function buildWhatsAppMessage(details) {
    let lines = [];
    lines.push(`Hello Angie Beverages & Salads! 👋`);
    lines.push("");
    lines.push("I would like to place an order:");
    lines.push("");
    cart.forEach((line, idx) => {
      lines.push(`${idx + 1}. ${line.name} x${line.qty}`);
      if (line.options) {
        if (line.options.dressing) lines.push(`   Dressing: ${line.options.dressing}`);
        if (line.options.addons && line.options.addons.length) {
          lines.push(
            `   Extras: ` + line.options.addons.map((a) => `${a.name} (+${fmt(a.price)})`).join(", ")
          );
        }
        if (line.options.salads) lines.push(`   Salads: ${line.options.salads.join(", ")}`);
      }
      lines.push(`   ${fmt(lineTotal(line))}`);
      lines.push("");
    });
    lines.push(`Total: ${fmt(cartTotal())}`);
    lines.push("");
    lines.push(`Name: ${details.name}`);
    lines.push(`Phone: ${details.phone}`);
    lines.push(`Fulfilment: ${details.fulfilment === "delivery" ? "Delivery" : "Pickup"}`);
    if (details.fulfilment === "delivery") lines.push(`Delivery location: ${details.location}`);
    if (details.time) lines.push(`Preferred time: ${details.time}`);
    if (details.notes) lines.push(`Special instructions: ${details.notes}`);
    lines.push("");
    lines.push("Please confirm my order and let me know the next steps.");
    return lines.join("\n");
  }

  function submitCheckout(e) {
    e.preventDefault();
    const name = $("#cf-name").value.trim();
    const phone = $("#cf-phone").value.trim();
    const location = $("#cf-location").value.trim();
    const time = $("#cf-time").value.trim();
    const notes = $("#cf-notes").value.trim();

    if (!name || !phone) {
      toast("Please add your name and phone number");
      return;
    }
    if (fulfilment === "delivery" && !location) {
      toast("Please add a delivery location");
      return;
    }

    const message = buildWhatsAppMessage({
      name,
      phone,
      fulfilment,
      location,
      time,
      notes,
    });

    window.open(waLink(message), "_blank");
    cart = [];
    saveCart();
    renderMenu();
    updateFloatingCart();
    closeOverlay($("#checkout-overlay"));
    toast("Order sent to WhatsApp!");
  }

  /* ---------- Overlay helpers ---------- */
  function openOverlay(overlay) {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function wireOverlayClosers() {
    $all(".overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeOverlay(overlay);
      });
    });
    $all("[data-close-overlay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeOverlay(btn.closest(".overlay"));
      });
    });
  }

  /* ---------- Search ---------- */
  function wireSearch() {
    $("#search-input").addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderMenu();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initHeader();
    renderCategoryNav();
    renderPopular();
    renderFilters();
    renderMenu();
    updateFloatingCart();
    wireSearch();
    wireOverlayClosers();

    $("#cart-trigger").addEventListener("click", () => {
      renderCart();
      openOverlay($("#cart-overlay"));
    });
    $("#floating-cart-view").addEventListener("click", () => {
      renderCart();
      openOverlay($("#cart-overlay"));
    });
    $("#cart-checkout-btn").addEventListener("click", openCheckout);
    $("#checkout-form").addEventListener("submit", submitCheckout);
    $all(".toggle-btn").forEach((b) =>
      b.addEventListener("click", () => {
        fulfilment = b.dataset.mode;
        renderCheckoutForm();
      })
    );
    $("#choose-plan-btn").addEventListener("click", openPlanModal);

    renderPlanIncludes();
  }

  function renderPlanIncludes() {
    const wrap = $("#plan-includes");
    wrap.innerHTML = "";
    MEAL_PLAN.includes.forEach((row) => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `<div class="label">${row.label}</div><div class="items">${row.items}</div>`;
      wrap.appendChild(div);
    });
    $("#plan-hero").innerHTML = buildImageBlock(
      { image: MEAL_PLAN.image, name: MEAL_PLAN.name, category: "plan" }
    );
  }

  document.addEventListener("DOMContentLoaded", init);
})();
