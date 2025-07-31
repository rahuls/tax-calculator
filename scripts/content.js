function parseNumberString(str) {
  const currencyMatch = str.match(/[\p{Sc}]/u); // Match any currency symbol (like £, $, €, etc.)
  const currencySymbol = currencyMatch ? currencyMatch[0] : null;

  // Remove all non-numeric characters except dot and comma
  const cleaned = str.replace(/[^\d.,-]/g, "");
  const normalized = cleaned.replace(/,/g, "");

  const number = parseFloat(normalized);
  return {
    parsedNumber: isNaN(number) ? null : number,
    currencySymbol,
  };
}

//this should be taking a value from 1 to 100%, not more than that.
function calculateTax(amount, taxPercent) {
  const taxableAmount = +((amount * taxPercent) / 100).toFixed(4);
  const excludingTax = +(amount - taxableAmount).toFixed(2);
  const includingTax = +(amount + taxableAmount).toFixed(2);
  return [excludingTax, includingTax];
}

function removePopup() {
  const existingPopup = document.getElementById("my-extension-popup");
  if (existingPopup) existingPopup.remove();
}

document.addEventListener("keydown", async (e) => {
  const selectedText = window.getSelection().toString().trim();
  const { parsedNumber, currencySymbol } = parseNumberString(selectedText);
  const isMac = navigator.userAgent.includes("Mac");
  if (
    (isMac && e.ctrlKey && e.key === "t") || // macOS: Control+T
    (!isMac && e.altKey && e.key === "t") // Windows: Alt+T
  ) {
    // if (e.ctrlKey && e.key === "t" && parsedNumber) {
    //get the position and range of the selected text
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    //remove any existing popups
    removePopup();

    chrome.storage.local.get(["taxPercent"], (result) => {
      const taxPercent = result.taxPercent;
      const [excludingTax, includingTax] = calculateTax(
        parsedNumber,
        taxPercent ? taxPercent : 20
      );

      const popup = document.createElement("div");
      popup.id = "my-extension-popup";
      // popup.textContent = "You selected: " + parsedNumber;
      popup.innerHTML = `
      <h2>Actual amount : ${
        currencySymbol ? currencySymbol : ""
      }${parsedNumber}</h2>
      <h2>Tax percent : ${taxPercent}%</h2><br/>
      <h2>Excluding Tax : ${
        currencySymbol ? currencySymbol : ""
      }${excludingTax}</h2>
      <h2>Including Tax : ${
        currencySymbol ? currencySymbol : ""
      }${includingTax}</h2>
  `;
      popup.className = "my-extension-popup";
      popup.style.top = `${rect.top + window.scrollY - 40}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.focus();
      // popup.addEventListener("focusout", removePopup);

      document.body.appendChild(popup);
    });
  }
});

document.addEventListener("mousedown", removePopup);
