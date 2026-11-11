// Closes the mobile menu when a link inside it is tapped.
// Without JavaScript the menu still works: it closes with the X,
// by tapping outside it or with Esc.

const menu = document.querySelector("[data-js='menu']");

if (menu !== null) {
    const links = menu.querySelectorAll("a");

    links.forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.matches(":popover-open")) {
                menu.hidePopover();
            }
        });
    });
}
