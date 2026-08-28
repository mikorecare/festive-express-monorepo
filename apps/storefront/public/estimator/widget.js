/* Festive Lighting Pros — "See your home lit up" demo widget.
   Self-contained. Mount with FLPDemoWidget.mount('#selector').
   Talks to the backend: /api/places/autocomplete, /api/render, /api/lead. */
(function () {
  "use strict";

  var API_BASE =
    typeof location !== "undefined" &&
    location.pathname.indexOf("/estimator") === 0
      ? "/estimator"
      : "";

  var FACTS = [
    "Permanent lighting works every night of the year — not just December.",
    "One app changes your whole roofline: warm white, team colors, or full holiday.",
    "The lights tuck into a discreet track, so they disappear in daylight.",
    "Homeowners who see a render book 3× more design consultations.",
    "Finding your roofline…",
    "Placing the lights along every eave and peak…",
    "Balancing the evening glow…",
  ];

  var COLOR_CHIPS = [
    { scheme: "warm-white", label: "Warm White", sw: "#fff3d6" },
    { scheme: "pure-white", label: "Pure White", sw: "#ffffff" },
    { scheme: "champagne", label: "Champagne", sw: "#e6c9a0" },
    { scheme: "candy-cane", label: "Candy Cane", swClass: "candy" },
    { scheme: "multicolor", label: "Multicolor", swClass: "multi" },
  ];

  var PROMPT_STARTERS = [
    "Soft warm white lights along every eave and peak",
    "Red and green Christmas roofline with a wreath on the door",
    "Team colors — red and blue alternating on the roofline",
    "Cool white modern look plus soft landscape uplights on the trees",
  ];

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function money(n) {
    return "$" + Number(n).toLocaleString("en-US");
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments,
        c = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(c, a);
      }, ms);
    };
  }

  function build(root) {
    var state = {
      placeId: "",
      address: "",
      lat: null,
      lng: null,
      imageBase64: "",
      mapsEnabled: false,
      scheme: "warm-white",
      multiColors: [
        { hex: "#e21d1d", name: "Color 1" },
        { hex: "#1ea832", name: "Color 2" },
        { hex: "#1d6fe2", name: "Color 3" },
        { hex: "#f2c14e", name: "Color 4" },
        { hex: "#9b4dca", name: "Color 5" },
      ],
      landscape: true,
      mode: "quick",
      userPrompt: "",
      lastImageUrl: "",
      lastEstimate: null,
    };

    var chipHtml = COLOR_CHIPS.map(function (c, i) {
      var dotClass = "c9-dot" + (c.swClass ? " " + c.swClass : "");
      var style = c.sw ? ' style="background:' + c.sw + '"' : "";
      return (
        '<button type="button" class="c9-opt' +
        (i === 0 ? " on" : "") +
        '" data-scheme="' +
        c.scheme +
        '">' +
        '<span class="' +
        dotClass +
        '"' +
        style +
        ' aria-hidden="true"></span>' +
        '<span class="c9-label">' +
        c.label +
        "</span>" +
        "</button>"
      );
    }).join("");

    // Describe look starters hidden for now.
    // var starterHtml = PROMPT_STARTERS.map(function (s) {
    //   return '<button type="button" class="starter" data-starter="' + esc(s) + '">' + esc(s) + '</button>';
    // }).join('');

    var w = el(
      '<div class="flpw">' +
        // '<h3>See your home lit up — free</h3>' +
        // '<p class="sub" data-f="sub">Upload a photo of your home, pick your colors, and watch it light up. Instant design + estimate. No cost, no pressure.</p>' +

        // Describe look hidden for now — restore this toggle to bring it back.
        // '<div class="mode-toggle" role="tablist" aria-label="Render mode">' +
        //   '<button type="button" class="mode-btn on" role="tab" aria-selected="true" data-mode="quick">Quick pick</button>' +
        //   '<button type="button" class="mode-btn" role="tab" aria-selected="false" data-mode="describe">Describe look</button>' +
        // '</div>' +

        '<div class="st on" data-st="form">' +
        "<label>Photo of your home</label>" +
        '<input type="file" accept="image/*" data-f="file" style="display:none;">' +
        '<button type="button" class="btn ghost" data-f="pick" style="margin-top:0;">Upload a photo of your home</button>' +
        '<img data-f="photopreview" alt="Your uploaded home" style="display:none;width:100%;border-radius:12px;margin-top:10px;">' +
        '<p class="note" style="margin-top:6px;">Front-of-house daytime photo works best. Straight-on, whole roofline visible.</p>' +
        '<label>Property address <span style="color:#6b7280;font-weight:500;">(optional)</span></label>' +
        '<div class="acw"><input data-f="address" autocomplete="off" placeholder="Start typing your street address"><div class="sug" data-f="sug"></div></div>' +
        "<label>Price per linear foot</label>" +
        '<div class="rate"><span class="pre">$</span><input data-f="rate" type="number" min="1" step="1" inputmode="decimal" style="padding-left:24px;" placeholder="10" value="10"></div>' +
        '<div data-f="quickopts">' +
        "<label>Select C-9 Light Color</label>" +
        '<div class="c9-colors" data-f="colors">' +
        chipHtml +
        "</div>" +
        '<div data-f="multiwrap" style="display:none;">' +
        '<p class="note" style="text-align:left;margin:8px 0 4px;">Pick 5 colors in order. Lights run 3 of each, then repeat: 3 of color 1, 3 of color 2, and so on.</p>' +
        '<div class="multi-picks" data-f="multicolors"></div>' +
        '<div class="multi-preview" data-f="multiprev" aria-label="Color order preview"></div>' +
        "</div>" +
        // '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:16px;"><input type="checkbox" data-f="landscape" checked style="width:auto;margin:0;"> Add landscape lighting</label>' +
        "</div>" +
        // Describe look panel hidden for now.
        // '<div data-f="describeopts" style="display:none;">' +
        //   '<label>Describe the lighting look</label>' +
        //   '<textarea class="prompt-box" data-f="prompt" rows="4" maxlength="800" placeholder="Describe anything — lights, snow, carpet, mood… e.g. warm roof strip, falling snow, red carpet at the door"></textarea>' +
        //   '<div class="prompt-meta"><span data-f="promptlen">0</span>/800</div>' +
        //   '<div class="prompt-starters">' + starterHtml + '</div>' +
        // '</div>' +

        '<div class="row2"><div><label>Your name</label><input data-f="name" autocomplete="name"></div><div><label>Email</label><input data-f="email" type="email" inputmode="email" autocomplete="email"></div></div>' +
        '<label>Mobile <span style="color:#6b7280;font-weight:500;">(optional)</span></label>' +
        '<input data-f="phone" type="tel" inputmode="tel" autocomplete="tel">' +
        '<div class="err" data-f="err"></div>' +
        '<button class="btn" data-f="go">Light up my home →</button>' +
        '<button class="btn ghost" data-f="checkaddr" style="margin-top:10px;">Check address only (no lights)</button>' +
        '<p class="note">We only use your info to send your render and, if you want, book a free consultation.</p>' +
        "</div>" +
        '<div class="st" data-st="rendering">' +
        '<div class="ctr"><div class="fact" data-f="fact"></div><span class="spin"></span><h3 style="font-size:20px;">Lighting up your home…</h3><p class="sub" data-f="progress">Finding your house…</p></div>' +
        "</div>" +
        '<div class="st" data-st="result">' +
        '<p class="disclaimer" data-f="disclaimer">This preview and footage estimate are not 100% accurate. Final design and measurement are confirmed on site.</p>' +
        '<img class="rimg" data-f="img" alt="Your home with permanent lighting">' +
        '<div class="stats" data-f="stats"></div>' +
        '<div class="offer" data-f="offer" hidden></div>' +
        '<button class="btn" data-f="book">Book free consultation →</button>' +
        '<button class="btn ghost" data-f="again">Try another look</button>' +
        '<p class="note" data-f="resultnote"></p>' +
        "</div>" +
        '<div class="st" data-st="error">' +
        '<div class="ctr"><h3 style="font-size:20px;">Hmm.</h3><p class="sub" data-f="errmsg">We couldn\'t render that one.</p><button class="btn ghost" data-f="retry">Try another address</button></div>' +
        "</div>" +
        "</div>",
    );

    root.innerHTML = "";
    root.appendChild(w);

    fetch(API_BASE + "/api/config")
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d && d.maps) state.mapsEnabled = true;
      })
      .catch(function () {});

    var q = function (sel) {
      return w.querySelector(sel);
    };
    var qf = function (name) {
      return w.querySelector('[data-f="' + name + '"]');
    };

    function show(stName) {
      w.querySelectorAll(".st").forEach(function (s) {
        s.classList.toggle("on", s.getAttribute("data-st") === stName);
      });
    }

    // Describe look handlers hidden for now.
    // function applyMode(mode) {
    //   state.mode = mode;
    //   var isDescribe = mode === 'describe';
    //   qf('quickopts').style.display = isDescribe ? 'none' : '';
    //   qf('describeopts').style.display = isDescribe ? '' : 'none';
    //   qf('sub').textContent = isDescribe
    //     ? 'Upload a photo (or enter an address), describe the look you want, and watch the lighting change — your house stays the same.'
    //     : 'Upload a photo of your home, pick your colors, and watch it light up. Instant design + estimate. No cost, no pressure.';
    //   qf('go').textContent = isDescribe ? 'Light it up from my prompt →' : 'Light up my home →';
    //   w.querySelectorAll('.mode-btn').forEach(function (btn) {
    //     var on = btn.getAttribute('data-mode') === mode;
    //     btn.classList.toggle('on', on);
    //     btn.setAttribute('aria-selected', on ? 'true' : 'false');
    //   });
    //   qf('err').style.display = 'none';
    // }
    // w.querySelectorAll('.mode-btn').forEach(function (btn) {
    //   btn.addEventListener('click', function () { applyMode(btn.getAttribute('data-mode')); });
    // });
    // var promptEl = qf('prompt');
    // promptEl.addEventListener('input', function () {
    //   state.userPrompt = promptEl.value;
    //   qf('promptlen').textContent = String(promptEl.value.length);
    // });
    // w.querySelectorAll('[data-starter]').forEach(function (btn) {
    //   btn.addEventListener('click', function () {
    //     promptEl.value = btn.getAttribute('data-starter') || '';
    //     state.userPrompt = promptEl.value;
    //     qf('promptlen').textContent = String(promptEl.value.length);
    //   });
    // });

    // ── Color scheme chips ──
    function renderMultiColors() {
      var wrap = qf("multicolors");
      wrap.innerHTML = state.multiColors
        .map(function (c, i) {
          return (
            '<label class="multi-pick">' +
            '<span class="n">Color ' +
            (i + 1) +
            "</span>" +
            '<input type="color" value="' +
            esc(c.hex) +
            '" data-i="' +
            i +
            '">' +
            "</label>"
          );
        })
        .join("");
      wrap.querySelectorAll("input[type=color]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          state.multiColors[+inp.dataset.i].hex = inp.value;
          renderMultiPreview();
        });
      });
      renderMultiPreview();
    }

    function renderMultiPreview() {
      var dots = [];
      var cycle = 0;
      while (cycle < 2) {
        state.multiColors.forEach(function (c) {
          dots.push('<span class="grp">');
          for (var n = 0; n < 3; n++)
            dots.push('<i style="background:' + esc(c.hex) + '"></i>');
          dots.push("</span>");
        });
        cycle += 1;
      }
      qf("multiprev").innerHTML = dots.join("");
    }

    function applyScheme(scheme) {
      state.scheme = scheme;
      qf("multiwrap").style.display =
        scheme === "multicolor" ? "block" : "none";
      if (scheme === "multicolor") renderMultiColors();
    }

    qf("colors")
      .querySelectorAll(".c9-opt")
      .forEach(function (chip) {
        chip.addEventListener("click", function () {
          qf("colors")
            .querySelectorAll(".c9-opt")
            .forEach(function (c) {
              c.classList.remove("on");
            });
          chip.classList.add("on");
          applyScheme(chip.dataset.scheme);
        });
      });

    // ── Photo upload (with client-side downscale to keep uploads small) ──
    function downscale(file, maxDim, cb) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var cw = Math.round(img.width * scale);
        var ch = Math.round(img.height * scale);
        var canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        try {
          cb(canvas.toDataURL("image/jpeg", 0.85));
        } catch (e) {
          cb(null);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        cb(null);
      };
      img.src = url;
    }
    var fileInp = qf("file");
    qf("pick").addEventListener("click", function () {
      fileInp.click();
    });
    fileInp.addEventListener("change", function () {
      var f = fileInp.files && fileInp.files[0];
      if (!f) return;
      qf("err").style.display = "none";
      downscale(f, 1280, function (dataUrl) {
        if (!dataUrl) {
          showErr("Could not read that image. Try a different photo.");
          return;
        }
        state.imageBase64 = dataUrl;
        var prev = qf("photopreview");
        prev.src = dataUrl;
        prev.style.display = "block";
        qf("pick").textContent = "Change photo";
      });
    });

    // Landscape checkbox is hidden for now; keep default on without crashing init.
    var landscapeEl = qf("landscape");
    if (landscapeEl) {
      landscapeEl.addEventListener("change", function () {
        state.landscape = this.checked;
      });
    }

    // ── Address autocomplete ──
    var addrInp = qf("address");
    var sug = qf("sug");
    var doSearch = debounce(function () {
      var v = addrInp.value.trim();
      state.placeId = ""; // typing invalidates a prior selection
      if (v.length < 3) {
        sug.classList.remove("open");
        sug.innerHTML = "";
        return;
      }
      fetch(API_BASE + "/api/places/autocomplete?q=" + encodeURIComponent(v))
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          var items = data.suggestions || [];
          if (!items.length) {
            sug.innerHTML =
              '<div class="msg">No matches — you can still type it in full.</div>';
            sug.classList.add("open");
            return;
          }
          sug.innerHTML = items
            .map(function (s) {
              return (
                '<div class="si" data-pid="' +
                esc(s.placeId) +
                '" data-full="' +
                esc(s.full) +
                '"><div class="m">' +
                esc(s.main) +
                '</div><div class="s">' +
                esc(s.secondary) +
                "</div></div>"
              );
            })
            .join("");
          sug.classList.add("open");
          sug.querySelectorAll(".si").forEach(function (si) {
            si.addEventListener("click", function () {
              state.placeId = si.dataset.pid;
              state.address = si.dataset.full;
              addrInp.value = si.dataset.full;
              sug.classList.remove("open");
            });
          });
        })
        .catch(function () {
          sug.classList.remove("open");
        });
    }, 250);
    addrInp.addEventListener("input", doSearch);
    document.addEventListener("click", function (e) {
      if (!w.contains(e.target)) sug.classList.remove("open");
    });

    // ── Rendering animation ──
    var factTimer = null;
    function startFacts() {
      var i = 0;
      var factEl = qf("fact");
      var progEl = qf("progress");
      var progress = [
        "Finding your house…",
        "Reading the roofline…",
        "Placing the lights…",
        "Setting the evening glow…",
        "Almost there…",
      ];
      factEl.textContent = FACTS[0];
      var p = 0;
      factTimer = setInterval(function () {
        i = (i + 1) % FACTS.length;
        factEl.style.opacity = 0;
        setTimeout(function () {
          factEl.textContent = FACTS[i];
          factEl.style.opacity = 1;
        }, 250);
        p = Math.min(p + 1, progress.length - 1);
        progEl.textContent = progress[p];
      }, 2600);
    }
    function stopFacts() {
      if (factTimer) {
        clearInterval(factTimer);
        factTimer = null;
      }
    }

    // ── Submit ──
    function showErr(msg) {
      var e = qf("err");
      e.textContent = msg;
      e.style.display = "block";
    }
    function validEmail(v) {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    }

    function runRender(previewOnly) {
      qf("err").style.display = "none";
      var address = addrInp.value.trim();
      var name = qf("name").value.trim();
      var email = qf("email").value.trim();
      var phone = qf("phone").value.trim();
      var rate = parseFloat(qf("rate").value);
      if (!(rate > 0)) rate = 10;
      var isDescribe = state.mode === "describe";
      var promptEl = qf("prompt");
      var promptText = promptEl ? (promptEl.value || "").trim() : "";

      if (!state.imageBase64 && !(state.mapsEnabled && address)) {
        return showErr(
          state.mapsEnabled
            ? "Upload a photo of your home or enter your address."
            : "Upload a photo of your home first.",
        );
      }
      if (!previewOnly && isDescribe && !promptText) {
        return showErr("Describe how you want the lights to look.");
      }
      if (!previewOnly && (!email || !validEmail(email))) {
        return showErr("Enter a valid email so we can send your render.");
      }

      if (!previewOnly) {
        fetch(API_BASE + "/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            address: address,
            source: isDescribe ? "render_widget_prompt" : "render_widget",
          }),
        }).catch(function () {});
      }

      show("rendering");
      if (previewOnly) {
        qf("progress").textContent = "Fetching Street View…";
        qf("fact").textContent = "Loading the house photo — no lighting yet.";
      } else {
        startFacts();
      }

      var body = {
        previewOnly: previewOnly,
        address: address,
        placeId: state.placeId || undefined,
        imageBase64: state.imageBase64 || undefined,
        email: email || undefined,
        pricePerFoot: rate,
      };

      if (isDescribe && !previewOnly) {
        body.userPrompt = promptText.slice(0, 800);
        body.scheme = "warm-white";
        body.customColors = [];
        body.landscape = false;
        body.decor = "none";
      } else {
        body.scheme = state.scheme;
        body.landscape = state.landscape;
        body.decor = "none";
        body.serviceType = "permanent";
        if (state.scheme === "multicolor")
          body.customColors = state.multiColors;
      }

      fetch(API_BASE + "/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(function (r) {
          return r.json().then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (res) {
          stopFacts();
          if (!res.ok || !res.d.ok) {
            var code = res.d && res.d.error;
            var msg =
              code === "bad_image" || code === "no_photo"
                ? "That photo didn't come through. Try uploading a different one."
                : code === "no_house_found"
                  ? "No house found at this location. The view may show mostly street or empty area — try a different address or upload a photo of your home."
                  : code === "address_not_found" || code === "no_streetview"
                    ? "We couldn't find a street view for that address. Try a different address or upload a photo."
                    : code === "server_not_configured"
                      ? "The render service isn't configured yet. Please add your API keys."
                      : "We couldn't render that one. Please try another photo or address.";
            qf("errmsg").textContent = msg;
            show("error");
            return;
          }
          renderResult(res.d);
        })
        .catch(function () {
          stopFacts();
          qf("errmsg").textContent = "Network hiccup. Please try again.";
          show("error");
        });
    }

    qf("go").addEventListener("click", function () {
      runRender(false);
    });
    qf("checkaddr").addEventListener("click", function () {
      runRender(true);
    });

    function statsCards(s) {
      var cards = [];
      var frontFt = s.frontFeet || s.rooflineFeet;
      var displayFt = s.packageTotalFeet || frontFt;
      if (displayFt)
        cards.push(
          '<div class="stat"><div class="k">Estimated footage</div><div class="v">' +
            Math.round(displayFt) +
            " ft</div></div>",
        );
      if (s.frontPrice)
        cards.push(
          '<div class="stat"><div class="k">Estimate</div><div class="v">' +
            money(s.frontPrice) +
            "</div></div>",
        );
      if (s.wholeFeet)
        cards.push(
          '<div class="stat"><div class="k">Whole-house footage</div><div class="v">' +
            Math.round(s.wholeFeet) +
            " ft</div></div>",
        );
      if (s.wholePrice)
        cards.push(
          '<div class="stat"><div class="k">Whole-house quote</div><div class="v">' +
            money(s.wholePrice) +
            "</div></div>",
        );
      if (s.packageOverageFt > 0) {
        cards.push(
          '<div class="stat extra"><div class="k">Extra footage</div><div class="v">+' +
            Math.round(s.packageOverageFt) +
            " ft</div></div>",
        );
        if (s.overagePrice)
          cards.push(
            '<div class="stat extra"><div class="k">Extra to add</div><div class="v">' +
              money(s.overagePrice) +
              "</div></div>",
          );
      } else if (s.withinPackage) {
        cards.push(
          '<div class="stat ok"><div class="k">175 ft package</div><div class="v">Covered</div></div>',
        );
      }
      return cards.join("");
    }

    function assetUrl(u) {
      if (!u) return u;
      if (/^https?:\/\//i.test(u)) return u;
      return API_BASE + (u.charAt(0) === "/" ? u : "/" + u);
    }

    function renderResult(d) {
      state.lastImageUrl = assetUrl(d.imageUrl);
      qf("img").src = state.lastImageUrl;
      var s = d.stats || {};
      var frontFt = s.frontFeet || s.rooflineFeet;
      state.lastEstimate = {
        footage: s.packageTotalFeet || frontFt || null,
        estimate: s.frontPrice || null,
        extraFootage: s.packageOverageFt > 0 ? s.packageOverageFt : 0,
        extraPrice: s.overagePrice || null,
        pricePerFoot: s.pricePerFoot || 10,
        wholeFootage: s.wholeFeet || null,
        wholePrice: s.wholePrice || null,
      };
      qf("stats").innerHTML = statsCards(s);

      var offer = qf("offer");
      var overage = s.packageOverageFt > 0 ? Math.round(s.packageOverageFt) : 0;
      if (overage) {
        var extraBit = s.overagePrice
          ? " Add " + overage + " extra ft for " + money(s.overagePrice) + "."
          : " Add " +
            overage +
            " extra ft — we'll price it at your consultation.";
        offer.innerHTML =
          '<div class="t">Your home needs a bit more</div>' +
          '<div class="d">The package covers 175 ft. This home goes over, so we can add the extra footage.' +
          extraBit +
          "</div>";
        offer.hidden = false;
      } else {
        offer.innerHTML = "";
        offer.hidden = true;
      }
      qf("book").textContent = "Book free consultation →";
      qf("book").disabled = false;

      if (d.preview) {
        qf("book").style.display = "none";
        var verified = d.streetView && d.streetView.verifiedAddress;
        qf("resultnote").textContent = d.address
          ? "Street View for " +
            d.address +
            (verified
              ? " (camera aimed at lot verified as " +
                verified.split(",")[0] +
                ")"
              : "") +
            ". Footage estimated from the building footprint — same method as a design quote. No lighting on this preview."
          : "Footage estimated from the building footprint. No lighting on this preview.";
        show("result");
        return;
      }
      qf("book").style.display = "";
      qf("resultnote").textContent = d.address
        ? "Estimate for " +
          d.address +
          ". Final pricing confirmed at your free on-site measurement."
        : "Estimate only. Final pricing confirmed at your free on-site measurement.";
      show("result");
    }

    qf("book").addEventListener("click", function () {
      var bookBtn = qf("book");
      var name = qf("name").value.trim();
      var email = qf("email").value.trim();
      var phone = qf("phone").value.trim();
      var address = addrInp.value.trim();
      if (!email || !validEmail(email)) {
        qf("resultnote").textContent =
          "Enter a valid email on the form so we can book your consultation.";
        return;
      }
      bookBtn.disabled = true;
      bookBtn.textContent = "Sending…";
      fetch(API_BASE + "/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          address: address,
          imageUrl: state.lastImageUrl || "",
          estimate: state.lastEstimate || null,
        }),
      })
        .then(function (r) {
          return r.json().then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (res) {
          if (!res.ok || !res.d.ok) {
            bookBtn.disabled = false;
            bookBtn.textContent = "Book free consultation →";
            qf("resultnote").textContent =
              "Could not send your request. Please try again.";
            return;
          }
          bookBtn.textContent = "Request sent ✓";
          qf("resultnote").textContent =
            "Thanks — we received your design and contact info. We'll be in touch.";
        })
        .catch(function () {
          bookBtn.disabled = false;
          bookBtn.textContent = "Book free consultation →";
          qf("resultnote").textContent = "Network hiccup. Please try again.";
        });
    });
    qf("again").addEventListener("click", function () {
      show("form");
    });
    qf("retry").addEventListener("click", function () {
      show("form");
    });
  }

  window.FLPDemoWidget = {
    mount: function (selector) {
      var root =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (root) build(root);
    },
  };
})();
