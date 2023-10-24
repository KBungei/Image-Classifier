import { ImageData } from "./image-data.mjs";
import { ImageCtxMenu, removeCMIfExists } from "./image-ctxmenu.mjs";

export class GalleryOS {
    constructor(gallery, searchBtn, displAllBtn) {
        this.galleryElem = gallery; // images container
        this.searchBtnElem = searchBtn; // search btn
        this.displAllBtn = displAllBtn;
        this.cache = [];
        this.selected = [];

        // to clear imagectx menus
        document.body.addEventListener('click',() => {
            removeCMIfExists();
        });

        searchBtn.addEventListener("click", (event) => {
            this.searchBtnActions(event);
        });

        displAllBtn.addEventListener("click", () => {
            this.displAllCached();
        });
    }

    getInputFiles(files) {
        this.inputCounter = 0;

        console.log(`Cache length at start is ${this.cache.length}`);

        for (const file of files) {

            this.createImageDataObj(file, files);
        }

        // reset when done
        this.inputCounter = 0;
    }

    createImageDataObj(file, files) {
        const imageData = new ImageData(file);
        imageData.galleryOS = this;

        imageData.addEventListener('complete', () => {

            this.inputCounter++;
            this.addToCache(imageData);
            this.renderImageDataObj(imageData);

            if (this.inputCounter === files.length) {
                console.log(`${this.inputCounter} image(s) added`);
                console.log(`Cache length is now: ${this.cache.length}`);
            }
        });
    }

    displaySelected() {
        //
        if (this.selected.length > 0) {
            this.galleryElem.innerHTML = "";
            while(this.selected.length > 0) {
                const selection = this.selected.pop();
                const imageData = this.cache[selection];
                this.renderImageDataObj(imageData);
            }
        }
    }

    displAllCached() {
        if (this.cache.length > 0) {
            this.galleryElem.innerHTML = "";
            for (const imageData of this.cache) {
                this.renderImageDataObj(imageData);
            }
        }
    }

    renderImageDataObj(imageData) {
        this.appendToGallery(imageData);
    }

    addToCache(imageData) {
        this.cache.push(imageData);
    }

    appendToGallery(imageData) {
        const image = imageData.imageElement;

        this.galleryElem.addEventListener("click", () => {
            removeCMIfExists();
        });

        image.addEventListener("click", () => {
            removeCMIfExists();
        });

        image.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this.createImageCxtMenu(event, imageData);
        });

        this.galleryElem.appendChild(image);
    }

    createImageCxtMenu(event, imageData) {
        const imageCtxMenu = new ImageCtxMenu(event, imageData);
    }

    addToSelected(imageData) {
        //
        const idx = this.cache.indexOf(imageData);
        this.selected.push(idx);
        console.log(`Selected is now: [${this.selected}]`);
    }

    markSelected(imageData) {
        imageData.imageElement.classList.add("blinking-border");
    }

    deleteOne(imageData) {
        imageData.rmvFromParentNode();
        imageData.rmvFromCacheArray(this.cache);
    }

    deleteSelected() {
        if (this.selected.length > 0) {
            while (this.selected.length > 0) {
                const selection = this.selected.pop();
                const imageData = this.cache[selection];
                this.deleteOne(imageData);
            }
        }
    }

    searchBtnActions(event) {
        console.log(event.target); // search btn
        if (this.cache.length > 0) {
            const query = prompt("Enter tag to search for.");
            if (query) {
                for (const imageData of this.cache) {
                    if (imageData.hasTag(query)) {
                        //
                        this.addToSelected(imageData);
                    }
                }
                // if results found
                if (this.selected.length > 0) {
                    // display results
                    this.displaySelected();
                } else {
                    console.error(`NO RESULTS`);
                }
            }
        } else {
            console.log(`CACHE EMPTY`);
        }
    }
}