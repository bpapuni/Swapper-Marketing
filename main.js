const screenshotDiv = document.getElementsByClassName("screenshot")[0].parentElement;
let touchStartX = null;

screenshotDiv.addEventListener("touchstart", (e) => {
    if (e.target.tagName == "BUTTON" || e.target.tagName == "I") {
        return;
    }
    touchStartX = e.touches[0].clientX;
    LockScroll();
});

screenshotDiv.addEventListener("touchend", (e) => {
    if (e.target.tagName == "BUTTON" || e.target.tagName == "I") {
        return;
    }
    touchStartX = null;
    UnlockScroll();
});

screenshotDiv.addEventListener("touchmove", (e) => {
    if (touchStartX !== null) {
        const touchEndX = e.touches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                RotateScreenshot(e, true);
            } else {
                RotateScreenshot(e, false);
            }

            touchStartX = null;
        }
    }
});

screenshotDiv.addEventListener("keydown", function(e) {
    if (event.key === "ArrowLeft") {
        RotateScreenshot(e, false);
    } else if (event.key === "ArrowRight") {
        RotateScreenshot(e, true);
    }
});

function UnlockScroll() {
    const scrollY = Math.abs(parseFloat(document.body.style.top))
    document.body.style.position = "static";
    window.scrollTo(0, scrollY);
};

function LockScroll() {
    const scrollY = window.scrollY
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
};

function RotateScreenshot(e, next) {
    const currentIndex = document.getElementsByClassName("screenshot")[0].src.split("/screenshots/")[1].split(".")[0];
    const nextIndex = next ? currentIndex == 14 ? 1 : +currentIndex + 1 : currentIndex == 1 ? 14 : +currentIndex - 1;
    const captionSpan = document.getElementsByClassName("caption")[0];
    const ssImg = document.getElementsByClassName("screenshot")[0];

    ssImg.src = `images/screenshots/${nextIndex}.png`;

    fetch("captions.json")
    .then((response) => response.json())
    .then((data) => {
        const message = data[`${nextIndex}`];
        captionSpan.textContent = message;
    })
    .catch((error) => {
        console.error("Error fetching JSON:", error);
        captionSpan.textContent = "Error loading caption.";
    });
}

function ZoomScreenshot(e) {
    if (e.target.tagName == "BUTTON" || e.target.tagName == "I") {
        return;
    }
    const zoomed = e.currentTarget.parentElement.classList.contains("zoomed");
    if (zoomed) {
        ZoomOut(e.currentTarget);
        UnlockScroll();
    } else {
        ZoomIn(e.currentTarget);
        LockScroll();
    }
}

function ZoomIn(e) {
    e.style.cursor = "zoom-out";
    e.parentElement.classList.add("zoomed");
    const rect = e.parentElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const elementTop = rect.top + scrollTop;
    window.scrollTo(0, elementTop);
}

function ZoomOut(e) {
    e.style.cursor = "zoom-in";
    e.parentElement.classList.remove("zoomed");
}