import { GalleryOS } from "./modules/gallery-os.mjs";

const fileInput = document.getElementById("file-input");
const addButton = document.getElementById("add-button");
const scrollTopBtn = document.getElementById("scroll-top-btn");
const scrollBtmBtn = document.getElementById("scroll-btm-btn");
const gallery = document.getElementById("gallery");
const searchBtn = document.getElementById("search-btn");
const displAllBtn = document.getElementById("display-all-btn");


const galleryOS = new GalleryOS(gallery, searchBtn, displAllBtn);

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo(0, 0);
});

scrollBtmBtn.addEventListener("click", () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
});

addButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", async function () {
    const files = await this.files;
    galleryOS.getInputFiles(files);
});