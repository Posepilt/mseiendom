// Closes the mobile menu when a link inside it is tapped,
// or when the visitor taps anywhere outside it.
// Browsers do the tap outside part on their own, but Safari on iPhone
// does not, so this file does it for every browser.
// Without JavaScript the menu still works: it closes with the X,
// by tapping outside it (in most browsers) or with Esc.

const menu = document.querySelector("[data-js='menu']");
const menuToggle = document.querySelector("[data-js='menu-toggle']");

function isInsideMenu(event) {
    const box = menu.getBoundingClientRect();
    const insideWidth = event.clientX >= box.left && event.clientX <= box.right;
    const insideHeight = event.clientY >= box.top && event.clientY <= box.bottom;

    return insideWidth && insideHeight;
}

function isOnToggle(event) {
    if (menuToggle === null) {
        return false;
    }

    return menuToggle.contains(event.target);
}

if (menu !== null) {
    const links = menu.querySelectorAll("a");

    links.forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.matches(":popover-open")) {
                menu.hidePopover();
            }
        });
    });

    document.addEventListener("pointerdown", (event) => {
        if (!menu.matches(":popover-open")) {
            return;
        }

        // The burger button opens and closes the menu by itself.
        if (isOnToggle(event)) {
            return;
        }

        if (!isInsideMenu(event)) {
            menu.hidePopover();
        }
    });
}
