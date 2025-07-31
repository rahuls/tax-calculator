const sliderDisplay = document.getElementById("sliderDisplay");
const sliderInput = document.getElementById("sliderInput");

chrome.storage.local.get(["taxPercent"], (result) => {
  if (result.taxPercent !== undefined) {
    sliderInput.value = result.taxPercent;
    sliderDisplay.innerHTML = `Tax Percentage : ${result.taxPercent}%`;
  } else {
    chrome.storage.local.set({ taxPercent: 20 });
    sliderDisplay.innerHTML = `Tax Percentage : ${20}%`;
  }
});

sliderInput.oninput = () => {
  sliderDisplay.innerHTML = `Tax Percentage : ${sliderInput.value}%`;

  chrome.storage.local.set({ taxPercent: sliderInput.value });
};
