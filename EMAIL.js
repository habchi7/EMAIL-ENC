(function() {
    'use strict';
    // 🔹 Helpers
    function getActiveTabContent() {
        const tabAreas = document.querySelectorAll('div.sp-tab-area');
        for (let area of tabAreas) {
            if (!area.classList.contains('s_dn')) return area;
        }
        return null;
    }
    function extractInputData() {
        const activeTabContent = getActiveTabContent();
        if (!activeTabContent) return null;
        const inputField = activeTabContent.querySelector('input.s_sedit.s_f.s_nav_sedit_top');
        return inputField ? {
            value: inputField.value.trim(),
            placeholder: inputField.placeholder,
            title: inputField.title
        } : null;
    }
    function getTotalRegle() {
        const activeTabContent = getActiveTabContent();
        if (!activeTabContent) return null;
        const labels = activeTabContent.querySelectorAll('div.s_ns.s_f.s_nwrp.s_c_l.s_pa.s-label');
        for (let label of labels) {
            if (label.textContent.trim() === "Total Réglé :") {
                const amountDiv = label.nextElementSibling?.querySelector('div.s_dn');
                if (amountDiv) return amountDiv.textContent.trim();
            }
        }
        const montantInput = activeTabContent.querySelector('input.swtEditDisabled.swtEditDisabledTheme.s_c_r');
        return montantInput ? montantInput.value.trim() : null;
    }
    // 🔹 Create button
    function createButton() {
        let btn = document.createElement("button");
        btn.textContent = "Envoyer l'email";
        btn.className = 'sbp-email-button';
        Object.assign(btn.style, {
            padding: '0px 15px 0px 15px',
            margin: '0px 20px 0px 0px',
            background: 'transparent',
            color: '#e0e1dd',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '400',
            cursor: 'pointer',
            textAlign: 'center',
            marginTop: '2px',
            fontSize: '15px',
            fontFamily: 'sageUI'
        });
        return btn;
    }
    // 🔹 Insert button in toolbar
    function insertButton(btn) {
        const toolbar = document.querySelector('div.sp-fstd-black.s_pa.sp-toolbar-ext ul.sp-toolbar');
        if (!toolbar) return false;
        const lastListItem = toolbar.querySelector('li:last-child');
        if (lastListItem) {
            // Only insert if button doesn't already exist
            if (!lastListItem.querySelector('.sbp-email-button')) {
                lastListItem.innerHTML = '';
                lastListItem.appendChild(btn);
                Object.assign(lastListItem.style, {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                });
            }
            return true;
        }
        return false;
    }
    // 🔹 Main init
    function initializeScript() {
        const btn = createButton();
        btn.addEventListener("click", () => {
            let montant = getTotalRegle();
            const inputData = extractInputData();
            const activeTabContent = getActiveTabContent();
            if (!activeTabContent) return;
            const affaireDivs = activeTabContent.querySelectorAll('div.edit-delta-pad');
            affaireDivs.forEach(div => {
                const numElement = div.querySelector('div.s_dn');
                if (!numElement) return;
                const numeroAffaire = numElement.textContent.trim();
                if (!/^([A-Z]{2})-\d+$/.test(numeroAffaire)) return;
                let toEmail = '', ccEmail = '';
                const prefix = numeroAffaire.split('-')[0];
                switch(prefix) {
                    case 'CA':
                        toEmail = 'habchi@sosipo.ma';
                        ccEmail = 'mansuri@sosipo.ma; benyahia@sosipo.ma';
                        break;
                    case 'SA':
                    case 'NA':
                        toEmail = 'derrak@sosipo.ma';
                        ccEmail = 'mansuri@sosipo.ma; benyahia@sosipo.ma';
                        break;
                    case 'AG':
                        toEmail = 'bouih@sosipo.ma';
                        ccEmail = 'mansuri@sosipo.ma; benyahia@sosipo.ma';
                        break;
                    default:
                        return;
                }
                let subjectMontant = montant ? ` - ${montant} DH` : '';
                let subject = encodeURIComponent(`Encaissement - ${numeroAffaire}${subjectMontant}`);
                let bodyText = `Bonjour,\n\n`;
                if (montant) {
                    bodyText += `Je vous informe que l'encaissement relatif à l'affaire ${numeroAffaire} d'un montant de ${montant} DH a bien été intégré dans la fiche dédiée.\n\n`;
                } else {
                    bodyText += `Je vous informe que l'encaissement relatif à l'affaire ${numeroAffaire} a bien été intégré dans la fiche dédiée\n\n`;
                }
                if (inputData?.value) {
                    bodyText += `Référence affaire : ${inputData.value}\n\n`;
                }
                bodyText += "Cordialement,";
                let mailtoLink = `mailto:${toEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
                if (ccEmail) mailtoLink += `&cc=${ccEmail}`;
                window.open(mailtoLink);
            });
        });
        // 🔹 Continuous button check
        function ensureButton() {
            const existingButton = document.querySelector('.sbp-email-button');
            if (!existingButton) {
                // Create a new button instance if none exists
                const newBtn = createButton();
                newBtn.addEventListener("click", btn.click); // Copy click handler
                insertButton(newBtn);
            }
        }
        // Initial insertion attempt
        insertButton(btn);
        // Continuously check every 500ms to ensure button presence
        setInterval(ensureButton, 500);
    }
    initializeScript();
})();
