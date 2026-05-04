/* =============================================
   script.js – Alkarski dvori
   =============================================
   Funkcionalnosti:
   1. Hamburger navigacija (sve stranice)
   2. Filter jelovnika po kategoriji (jelovnik.html)
   3. Toggle opisa recepta (recepti.html)
   4. Validacija forme za rezervaciju (rezervacija.html)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. HAMBURGER NAVIGACIJA
     ----------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Zatvori meni klikom izvan
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* -----------------------------------------------
     2. FILTER JELOVNIKA PO KATEGORIJI
     ----------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems  = document.querySelectorAll('.menu-item');
  const noResults  = document.getElementById('no-results');

  if (filterBtns.length > 0 && menuItems.length > 0) {

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Postavi aktivni gumb
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visibleCount = 0;

        menuItems.forEach(item => {
          const category = item.dataset.category;
          const matches  = filter === 'sve' || category === filter;

          if (matches) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        // Prikaži poruku ako nema rezultata
        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    });
  }


  /* -----------------------------------------------
     3. TOGGLE OPISA RECEPTA
     ----------------------------------------------- */
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  if (toggleBtns.length > 0) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const details  = document.getElementById(targetId);
        const icon     = btn.querySelector('.toggle-icon');

        if (!details) return;

        const isExpanded = details.classList.contains('expanded');

        if (isExpanded) {
          details.classList.remove('expanded');
          icon.classList.remove('open');
          btn.querySelector('.toggle-icon').textContent = '▼';
          btn.firstChild.textContent = 'Prikaži recept ';
        } else {
          details.classList.add('expanded');
          icon.classList.add('open');
          btn.querySelector('.toggle-icon').textContent = '▲';
          btn.firstChild.textContent = 'Sakrij recept ';

          // Smooth scroll do recepta
          setTimeout(() => {
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    });
  }


  /* -----------------------------------------------
     4. FORMA ZA REZERVACIJU – JS VALIDACIJA
     ----------------------------------------------- */
  const form = document.getElementById('rezervacija-form');

  if (form) {
    const datumInput = document.getElementById('datum');

    // Postavi minimalni datum na danas
    if (datumInput) {
      const today = new Date().toISOString().split('T')[0];
      datumInput.setAttribute('min', today);
    }

    // --- Helper funkcije ---

    function showError(fieldId, msgId, message) {
      const field = document.getElementById(fieldId);
      const msg   = document.getElementById(msgId);
      if (field) field.classList.add('invalid');
      if (field) field.classList.remove('valid');
      if (msg)   { msg.textContent = message; msg.classList.add('visible'); }
    }

    function showValid(fieldId, msgId) {
      const field = document.getElementById(fieldId);
      const msg   = document.getElementById(msgId);
      if (field) field.classList.add('valid');
      if (field) field.classList.remove('invalid');
      if (msg)   msg.classList.remove('visible');
    }

    function clearState(fieldId, msgId) {
      const field = document.getElementById(fieldId);
      const msg   = document.getElementById(msgId);
      if (field) { field.classList.remove('valid', 'invalid'); }
      if (msg)   msg.classList.remove('visible');
    }

    // --- Pojedinačne validacijske funkcije ---

    function validateIme() {
      const val = document.getElementById('ime').value.trim();
      if (val.length < 2) {
        showError('ime', 'ime-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('ime', 'ime-err');
      return true;
    }

    function validatePrezime() {
      const val = document.getElementById('prezime').value.trim();
      if (val.length < 2) {
        showError('prezime', 'prezime-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('prezime', 'prezime-err');
      return true;
    }

    function validateEmail() {
      const val = document.getElementById('email').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(val)) {
        showError('email', 'email-err', 'Unesite ispravan email.');
        return false;
      }
      showValid('email', 'email-err');
      return true;
    }

    function validateTelefon() {
      const val = document.getElementById('telefon').value.trim().replace(/[\s\-()]/g, '');
      const telRegex = /^\+?[0-9]{9,15}$/;
      if (!telRegex.test(val)) {
        showError('telefon', 'telefon-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('telefon', 'telefon-err');
      return true;
    }

    function validateDatum() {
      const val   = document.getElementById('datum').value;
      const today = new Date().toISOString().split('T')[0];
      if (!val || val < today) {
        showError('datum', 'datum-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('datum', 'datum-err');
      return true;
    }

    function validateVrijeme() {
      const val = document.getElementById('vrijeme').value;
      if (!val) {
        showError('vrijeme', 'vrijeme-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('vrijeme', 'vrijeme-err');
      return true;
    }

    function validateOsobe() {
      const val = document.getElementById('osobe').value;
      if (!val || (parseInt(val, 10) !== undefined && parseInt(val, 10) < 1 && val !== '9+')) {
        showError('osobe', 'osobe-err', 'Broj osoba mora biti veći od 0.');
        return false;
      }
      if (!val) {
        showError('osobe', 'osobe-err', 'Molimo popunite sva polja.');
        return false;
      }
      showValid('osobe', 'osobe-err');
      return true;
    }

    function validateNapomene() {
      const val = document.getElementById('napomene').value;
      if (val.length > 500) {
        showError('napomene', 'napomene-err', 'Napomena ne smije biti dulja od 500 znakova.');
        return false;
      }
      clearState('napomene', 'napomene-err');
      return true;
    }

    function validateSuglasnost() {
      const checked = document.getElementById('suglasnost').checked;
      const errMsg  = document.getElementById('suglasnost-err');
      if (!checked) {
        if (errMsg) { errMsg.style.display = 'block'; errMsg.classList.add('visible'); }
        return false;
      }
      if (errMsg) { errMsg.style.display = 'none'; errMsg.classList.remove('visible'); }
      return true;
    }

    // --- Live validacija (blur eventi) ---
    document.getElementById('ime')?.addEventListener('blur', validateIme);
    document.getElementById('prezime')?.addEventListener('blur', validatePrezime);
    document.getElementById('email')?.addEventListener('blur', validateEmail);
    document.getElementById('telefon')?.addEventListener('blur', validateTelefon);
    document.getElementById('datum')?.addEventListener('change', validateDatum);
    document.getElementById('vrijeme')?.addEventListener('change', validateVrijeme);
    document.getElementById('osobe')?.addEventListener('change', validateOsobe);
    document.getElementById('napomene')?.addEventListener('input', validateNapomene);

    // --- Submit ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = [
        validateIme(),
        validatePrezime(),
        validateEmail(),
        validateTelefon(),
        validateDatum(),
        validateVrijeme(),
        validateOsobe(),
        validateNapomene(),
        validateSuglasnost(),
      ].every(Boolean);

      if (!isValid) {
        // Skrolaj do prve greške
        const firstErr = form.querySelector('.invalid, input.invalid, select.invalid, textarea.invalid');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErr.focus();
        }
        return;
      }

      // Sve validacije prošle – prikaži uspjeh
      const ime     = document.getElementById('ime').value.trim();
      const prezime = document.getElementById('prezime').value.trim();
      const successName = document.getElementById('success-name');
      const formContent = document.getElementById('form-content');
      const successOverlay = document.getElementById('success-overlay');
      const successMsg = successOverlay ? successOverlay.querySelector('p') : null;

      if (successName)  successName.textContent = `${ime} ${prezime}`;
      if (successMsg)   successMsg.innerHTML = `Rezervacija uspješna! Veselimo se vašem dolasku.<br /><br />Potvrdimo vašu rezervaciju u roku 2 sata na e-mail i SMS.`;
      if (formContent)  formContent.style.display = 'none';
      if (successOverlay) successOverlay.classList.add('visible');
    });

    // Gumb 'Nova rezervacija'
    const novaBtn = document.getElementById('nova-rezervacija');
    if (novaBtn) {
      novaBtn.addEventListener('click', () => {
        form.reset();
        // Ukloni sve validacijske klase
        form.querySelectorAll('.valid, .invalid').forEach(el => {
          el.classList.remove('valid', 'invalid');
        });
        form.querySelectorAll('.error-msg').forEach(el => {
          el.classList.remove('visible');
          el.style.display = '';
        });

        const formContent    = document.getElementById('form-content');
        const successOverlay = document.getElementById('success-overlay');
        if (formContent)    formContent.style.display = 'block';
        if (successOverlay) successOverlay.classList.remove('visible');
      });
    }
  } // end if(form)

}); // end DOMContentLoaded
