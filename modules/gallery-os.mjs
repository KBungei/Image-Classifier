import { ImageData } from "./image-data.mjs";
import { ImageCtxMenu, removeCMIfExists } from "./image-ctxmenu.mjs";

function asyncAlert(message) {
    return new Promise((resolve, reject) => {
        alert(message);

        resolve();
    });
}

export class GalleryOS {
    constructor(gallery, searchBtn, displAllBtn, largeViewCont) {
        this.galleryElem = gallery; // images container
        this.searchBtnElem = searchBtn; // search btn
        this.displAllBtn = displAllBtn;
        this.largeViewCont = largeViewCont;
        this.cache = [];
        this.selected = [];
        this.mode;

        // to clear imagectx menus
        document.body.addEventListener('click', () => {
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

        imageData.addEventListener('complete', async () => {

            this.inputCounter++;
            this.addToCache(imageData);
            this.renderImageDataObj(imageData);

            imageData.imageElement.addEventListener('click', () => {
                imageData.viewLarger();
            });

            if (this.inputCounter === files.length) {
                console.log(`${this.inputCounter} image(s) added`);

                console.log(`Finished loading images`);
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
        this.mode = "all-cached";
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
        console.log(`Selected was: [${this.selected}]`);

        const idx = this.cache.indexOf(imageData);

        this.selected.push(idx);
        this.selected.sort();

        console.log(`Selected is now: [${this.selected}]`);
    }

    markSelected(imageData) {
        imageData.imageElement.classList.add("blinking-border");
    }

    unmarkSelected(imageData) {
        imageData.imageElement.classList.remove('blinking-border');
    }

    deselectOne(ix) {
        console.log(`Selection was: [${this.selected}]`);
        
        if (this.selected.includes(ix)) {

            this.selected.splice(this.selected.indexOf(ix), 1);

            // redistribute pointers if target shifts
            for (const selection of this.selected) {
                // shift happens starting here 
                if (ix < selection) {
                    this.selected[this.selected.indexOf(selection)] -= 1;
                }
            }
        } else {
            for (const selection of this.selected) {
                if (ix < selection) {
                    this.selected[this.selected.indexOf(selection)] -= 1;
                }
            }
        }

        this.selected.sort();
        console.log(`Selection is now: [${this.selected}]`);
    }

    deselectAll() {
        if (this.selected.length > 0) {
            while (this.selected.length > 0) {
                const imageData = this.selected.pop();
                this.unmarkSelected(imageData);
            }
        }
    }

    deleteOne(imageData) {
        console.log(`galleryElem childNodes length was: ${this.galleryElem.childNodes.length}`);

        const idx = this.cache.indexOf(imageData);

        if (this.selected.includes(idx)) {

            imageData.rmvFromParentNode();
            imageData.rmvFromCacheArray(this.cache);

        } else {
            imageData.rmvFromParentNode();
            imageData.rmvFromCacheArray(this.cache);
        }

        console.log(`galleryElem childNodes length is now: ${this.galleryElem.childNodes.length}`);
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
                    this.mode = "selected";
                } else {
                    console.error(`NO RESULTS`);
                }
            }
        } else {
            console.log(`CACHE EMPTY`);
        }
    }
}