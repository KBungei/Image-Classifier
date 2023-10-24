class Resolution {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.diag = calcDiagonal(w, h);
        this.aspectRatio = calcAspectRatio(w, h);
    }
}

// 4320p (8K), 2160p (4K), 1440p (2K), 1080p ...

const res144p = new Resolution(256, 144);
const res240p = new Resolution(426, 240);
const res360p = new Resolution(480, 360);
const res480p = new Resolution(640, 480);
const res720p = new Resolution(1280, 720);
const res1080p = new Resolution(1920, 1080);
const res1440p = new Resolution(2560, 1440);
const res2160p = new Resolution(3840, 2160);
const res4320p = new Resolution(7680, 4320);

function calcAspectRatio(w, h) {
    if (w >= h ) {
        return w / h;
    } else {
        return h / w;
    }
}

function calcDiagonal(w, h) {
    return Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
}

function classifyImageQuality(diagonal) {

    const diag144p = res144p.diag;
    const diag240p = res240p.diag;
    const diag360p = res360p.diag;
    const diag480p = res480p.diag;
    const diag720p = res720p.diag;
    const diag1080p = res1080p.diag;
    const diag1440p = res1440p.diag; // 2K
    const diag2160p = res2160p.diag; // 4K
    const diag4320p = res4320p.diag; // 8K

    const diag = diagonal;

    if (diag >= diag4320p) { return "4320p (8K) +"; }
    else if (diag >= diag2160p) { return "2160p (4K)"; }
    else if (diag >= diag1440p) { return "1440p"; }
    else if (diag >= diag1080p) { return "1080p"; }
    else if (diag >= diag720p) { return "720p"; }
    else if (diag >= diag480p) { return "480p"; }
    else if (diag >= diag360p) { return "360p"; }
    else if (diag >= diag240p) { return "240p"; }
    else if (diag >= diag144p) { return "144p"; }
    else { return "< 144p"; }
}

export class ImageData {
    constructor(file) {
        // properties available from file
        if (file && file.type.startsWith("image/")) {
            this.name = file.name;
            this.nameExtnless = this.removeExtension();
            this.type = file.type;
            this.size = file.size;
            this.caption = "";
            this.tags = [];

            this.loadBlob(file);

            // listeners queue
            this.oncompleteListeners = [];

        } else {
            console.error("File is not type image/*");
        }
    }

    loadBlob(file) {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = () => {
            const arrayBuffer = fileReader.result;
            this.blob = new Blob([arrayBuffer]);

            this.url = URL.createObjectURL(this.blob);
            this.createImageElem();

            this.complete = true;

            for (const listener of this.oncompleteListeners) {
                listener();
            }
        };

        fileReader.onerror = (error) => {
            console.error(error)
        };   
    }

    createImageElem() {
        const image = new Image();
        image.src = this.url;

        // assign a HTMLImageElement property to this
        this.imageElement = image;

        image.onload = () => {
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;

            // computed image properties
            this.diagonal = calcDiagonal(this.width, this.height);
            this.aspectRatio = calcAspectRatio(image.naturalWidth, image.naturalHeight);
            this.quality = classifyImageQuality(this.diagonal);
        };
    }

    getExtension() {
        const regex = /(?<extension>\.[a-zA-Z0-9]+)$/;
        const match = regex.exec(this.name);
        if (match) {
            return match.groups.extension;
        } else {
            console.error(`Current file name has no extension.`);
            return null;
        }
    }

    removeExtension() {
        return this.name.replace(/\.[^/.]+$/, '');
    }

    downloadImage() {
        console.log(`Downloading ${this.name}...`);

        const link = document.createElement('a');
        link.href = this.url;
        link.download = this.name;
        link.click();
    }

    rmvFromParentNode() {
        const parentNode = this.imageElement.parentNode;
        console.log(`parentNode length was: ${parentNode.childNodes.length}`);
        
        parentNode.removeChild(this.imageElement);
        console.log(`parentNode length is now: ${parentNode.childNodes.length}`);
    }

    rmvFromCacheArray(arr) {
        if (arr.includes(this)) {
            console.log(`Cache length was: ${arr.length}`);

            const ix = arr.indexOf(this);
            arr.splice(ix, 1);

            console.log(`Cache length is now: ${arr.length}`);
        } else {
            console.error(`EITHER: image not in cache OR cache arg is not array like.`);
        }
        
    }

    stringify() {
        const string = `Name: '${this.name}'` +
            `\nSize: ${this.size} bytes` +
            `\nType: '${this.type}'` +
            `\nExtension: '${this.getExtension()}'` +
            `\nQuality: '${this.quality}'` +
            `\nCaption: '${this.caption}'` +
            `\nTags: [${this.tags.toString()}]`;

        return string;
    }

    addCaption(caption) {
        if (caption) {
            console.log(`Caption was: '${this.caption}'`);

            this.caption = caption.toString();

            console.log(`Caption is now: '${this.caption}'`);
        } else {
            console.error(`null value arg was passed`);
        }
    }

    hasTag(tag) {
        if (tag) {
            const queryTag = filterString(tag);
            return this.tags.includes(queryTag);
        } else {
            console.error(`null value arg was passed`);
            return false;
        }
    }

    addTag(tag) {
        if (tag) {
            const tagToAdd = filterString(tag);

            // avoid duplicate tags
            if (!this.hasTag(tagToAdd)) {
                console.log(`Tags was: [${this.tags}]`);

                this.tags.push(tagToAdd);
                this.tags.sort();

                console.log(`Tags is now: [${this.tags}]`);
            } else {
                console.error(`Tag '${tagToAdd}' already present`);
            }
        } else {
            console.error(`null value arg was passed`);
        }
    }

    removeTag(tag) {
        if (tag) {
            const tagToRmv = filterString(tag);
            if (this.hasTag(tagToRmv)) {

                console.log(`Tags was: [${this.tags}]`);                

                const ix = this.tags.indexOf(tagToRmv);
                this.tags.splice(ix, 1);
                this.tags.sort();

                console.log(`Tags is now: [${this.tags}]`);

            } else {
                console.error(`Tag '${tagToRmv}' is not present`);
            }
        } else {
            console.error(`null value arg was passed`);
        }
    }

    replaceTag(oldTag, newTag) {
        if (oldTag && newTag) {
            oldTag = filterString(oldTag);
            newTag = filterString(newTag);

            if (this.hasTag(oldTag)) {
                console.log(`Tags was: [${this.tags}]`);

                //this.tags[this.tags.indexOf(oldTag)] = newTag;
                this.removeTag(oldTag);
                this.addTag(newTag);
                this.tags.sort();

                console.log(`Tags is now: [${this.tags}]`);

            } else {

                console.error(`oldTag '${oldTag}' was not present.`);
                console.log(`Adding newTag '${newTag}' anyway...`);

                this.addTag(newTag);
            }
        } else {
            console.error(`null value arg was passed`);
        }
    }

    addEventListener(type, listener) {
        if (type === "complete") {
            this.oncompleteListeners.push(listener);
        }
    }

    removeEventListener(type, listener) {
        if (type === "complete") {
            this.oncompleteListeners.splice(this.oncompleteListeners.indexOf(listener), 1);
        }
    }
}

function filterString(str) {
    str = str.toString();
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/\s+/g, ' '); // remove double space or more
    return str.replace(/[^0-9a-zA-Z\s\-_]/g, ""); // remove unwanted characters
}