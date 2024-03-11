const d = document;
export default function searchFilter(input, selector) {
  d.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      if (e.key === "escape") e.target.value = "";
      d.querySelectorAll(selector).forEach((el) => {
        let value = el.textContent.toLowerCase().includes(e.target.value);
        if (value) {
          el.classList.remove("filter");
          setTimeout(() => {
            el.classList.remove("filter2");
          }, 300);
        } else {
          el.classList.add("filter");
          setTimeout(() => {
            el.classList.add("filter2");
          }, 300);
        }
      });
    }
  });
}