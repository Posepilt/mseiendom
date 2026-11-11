// Photo viewer (lightbox) for the gallery.
// Opens a clicked photo full screen with its caption and a row of small photos
// underneath. You can move between photos with the arrow buttons, the arrow keys,
// by swiping on a touch screen or by clicking a small photo, and close it with
// the X, Esc or a click beside the photo.
// Without JavaScript each thumbnail is a normal link to the image file.

const lightbox = document.querySelector("[data-js='lightbox']");
const galleryLinks = document.querySelectorAll("[data-js='gallery-link']");

if (lightbox !== null && galleryLinks.length > 0) {
    const lightboxImage = lightbox.querySelector("[data-js='lightbox-image']");
    const lightboxCaption = lightbox.querySelector("[data-js='lightbox-caption']");
    const lightboxCounter = lightbox.querySelector("[data-js='lightbox-counter']");
    const lightboxFigure = lightbox.querySelector("[data-js='lightbox-figure']");
    const closeButton = lightbox.querySelector("[data-js='lightbox-close']");
    const previousButton = lightbox.querySelector("[data-js='lightbox-prev']");
    const nextButton = lightbox.querySelector("[data-js='lightbox-next']");
    const thumbnailList = lightbox.querySelector("[data-js='lightbox-thumbnails']");

    const photos = [];
    const thumbnailButtons = [];
    let currentIndex = 0;
    let swipeStartX = null;
    const swipeDistance = 50;

    // Collect the address, alt text and caption of every photo in the gallery.
    for (let index = 0; index < galleryLinks.length; index = index + 1) {
        const link = galleryLinks[index];
        const image = link.querySelector("img");
        const figure = link.closest("figure");
        const caption = figure.querySelector("figcaption");

        photos.push({
            source: link.getAttribute("href"),
            alt: image.getAttribute("alt"),
            caption: caption.textContent.trim()
        });
    }

    // Build the row of small photos in the viewer, one button per photo.
    for (let index = 0; index < photos.length; index = index + 1) {
        const photo = photos[index];

        const item = document.createElement("li");
        item.className = "lightbox__thumbnail-item";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "lightbox__thumbnail";
        button.setAttribute("aria-label", (index + 1) + ": " + photo.caption);

        const image = document.createElement("img");
        image.className = "lightbox__thumbnail-image";
        image.src = photo.source;
        image.alt = "";
        image.loading = "lazy";

        button.appendChild(image);
        item.appendChild(button);
        thumbnailList.appendChild(item);
        thumbnailButtons.push(button);

        button.addEventListener("click", () => {
            showPhoto(index);
        });
    }

    // Marks the small photo that is showing, and scrolls it into view.
    function highlightThumbnail() {
        for (let index = 0; index < thumbnailButtons.length; index = index + 1) {
            const button = thumbnailButtons[index];

            if (index === currentIndex) {
                button.setAttribute("aria-current", "true");
            } else {
                button.removeAttribute("aria-current");
            }
        }

        const currentButton = thumbnailButtons[currentIndex];
        currentButton.scrollIntoView({ block: "nearest", inline: "center" });
    }

    function showPhoto(index) {
        if (index < 0) {
            index = photos.length - 1;
        }

        if (index >= photos.length) {
            index = 0;
        }

        currentIndex = index;

        const photo = photos[currentIndex];
        lightboxImage.setAttribute("src", photo.source);
        lightboxImage.setAttribute("alt", photo.alt);
        lightboxCaption.textContent = photo.caption;
        lightboxCounter.textContent = (currentIndex + 1) + " / " + photos.length;
        highlightThumbnail();
    }

    function showPreviousPhoto() {
        showPhoto(currentIndex - 1);
    }

    function showNextPhoto() {
        showPhoto(currentIndex + 1);
    }

    // Open the viewer instead of following the link.
    for (let index = 0; index < galleryLinks.length; index = index + 1) {
        const link = galleryLinks[index];

        link.addEventListener("click", (event) => {
            event.preventDefault();
            lightbox.showModal();
            showPhoto(index);
        });
    }

    // The "show all photos" button opens the viewer at the first photo.
    const showAllButton = document.querySelector("[data-js='gallery-show-all']");

    if (showAllButton !== null) {
        showAllButton.addEventListener("click", () => {
            lightbox.showModal();
            showPhoto(0);
        });
    }

    closeButton.addEventListener("click", () => {
        lightbox.close();
    });

    previousButton.addEventListener("click", () => {
        showPreviousPhoto();
    });

    nextButton.addEventListener("click", () => {
        showNextPhoto();
    });

    // Arrow keys move between photos. Esc closes the dialog by itself.
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showPreviousPhoto();
        }

        if (event.key === "ArrowRight") {
            showNextPhoto();
        }
    });

    // A click on the dark area beside the photo closes the viewer.
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            lightbox.close();
        }
    });

    // Swipe left or right on a touch screen to change photo.
    lightboxFigure.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse") {
            swipeStartX = event.clientX;
        }
    });

    lightboxFigure.addEventListener("pointerup", (event) => {
        if (swipeStartX === null) {
            return;
        }

        const distance = event.clientX - swipeStartX;
        swipeStartX = null;

        if (distance > swipeDistance) {
            showPreviousPhoto();
        }

        if (distance < -swipeDistance) {
            showNextPhoto();
        }
    });

    lightboxFigure.addEventListener("pointercancel", () => {
        swipeStartX = null;
    });
}
