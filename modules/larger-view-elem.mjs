//
//
// Code for tooltip ImageInfoTip
//
//

export class ImageInfoTip extends HTMLElement {
    constructor(properties, event) {
        super();
        this.properties = properties;
        this.event = event;
    }

    connectedCallback() {

        // font-family: "Brush Script MT", cursive;
        // font-family: Arial, Helvetica, sans-serif;

        const cursorPos = this.event.target.parentNode.getBoundingClientRect();
        const x = cursorPos.left + this.event.clientX;
        const y = cursorPos.top + this.event.clientY;

        this.style = 
        `display: flex;
        flex-wrap: column;
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background-color: white;
        border-radius: .5rem;
        padding: .1rem;
        border: .1rem solid blueviolet;`;
        
        this.classList.add('image-info-tip');
        this.innerHTML = this.properties;

        this.querySelectorAll('th').forEach((th) => {
            th.style.color = 'blueviolet';
        });
        this.querySelectorAll('td').forEach((td) => {
            td.style.fontFamily = `Arial, Helvetica, sans-serif`;
            td.style.fontSize = '.9rem';
            td.style.color = 'limegreen';
        });
    }
}

export class ImageLargerView extends HTMLElement {
    constructor(cursor, cache, mode) {
        super();
        this.cursor = cursor;
        this.mode = mode;
        this.image = new Image();
        this.cache = cache;
        this.classList.add("larger-view");
    }

    navCache(event) {
        if (event.key === "ArrowRight") {
            this.viewNext();
        }
        
        if (event.key === "ArrowLeft") {
            this.viewPrev();
        }
        
        if (event.keyCode === 27) {
            this.disconnectThis();
        }
    }

    makeCopyImgElem() {
        return this.image.cloneNode(this.image);
    }

    viewNext() {

        const removeInstances = () => {
            const imageInfoTips = document.querySelectorAll('ctm-image-info-tip');
            if (imageInfoTips) {
                imageInfoTips.forEach((imageInfoTip) => {
                    document.body.removeChild(imageInfoTip);
                });
            }
        };

        removeInstances();

        const lastIx = this.cache.length - 1;

        if (this.cursor < lastIx) {

            const nextIx = this.cursor + 1;
            this.image.src = this.cache[nextIx].url;

            this.cursor++;

        } else {
            console.warn(`Viewing last item: [${this.cursor}].`);
        }
    }

    viewPrev() {

        const removeInstances = () => {
            const imageInfoTips = document.querySelectorAll('ctm-image-info-tip');
            if (imageInfoTips) {
                imageInfoTips.forEach((imageInfoTip) => {
                    document.body.removeChild(imageInfoTip);
                });
            }
        };

        removeInstances();
        
        if (this.cursor > 0) {
            const prevIx = this.cursor -1;
            
            this.image.src = this.cache[prevIx].url;

            this.cursor--;

        } else {
            console.warn(`Viewing first image`);
        }
    }

    disconnectThis() {

        const removeInstances = () => {
            const imageInfoTips = document.querySelectorAll('ctm-image-info-tip');
            if (imageInfoTips) {
                imageInfoTips.forEach((imageInfoTip) => {
                    document.body.removeChild(imageInfoTip);
                });
            }
        };

        removeInstances();

        // if not already removed
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }

        this.cache[this.cursor].imageElement.scrollIntoView();

    }

    connectedCallback() {
        this.appendChild(this.image);
        this.image.src = this.cache[this.cursor].url;

        this.style =
        `diplay: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: calc(100vw);
        height: calc(100vh);
        background-color: rgba(0, 0, 0, 0.5);`;

        this.image.style = 
        `position: fixed;
        max-width: 97%;
        max-height: 97%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: .5rem;
        border: .5rem solid rgba(0, 0, 0, 0.5)`;

        this.addEventListener('click', () => {
            this.disconnectThis();
        });

        // show tooltip displaying image properties
        this.image.addEventListener('mousemove', (event) => {

            const removeInstances = () => {
                const imageInfoTips = document.querySelectorAll('ctm-image-info-tip');
                if (imageInfoTips) {
                    imageInfoTips.forEach((imageInfoTip) => {
                        document.body.removeChild(imageInfoTip);
                    });
                }
            };

            removeInstances();

            const customDefImageInfoTip = () => {
                // if not already defined then define
                if (!customElements.get('ctm-image-info-tip')) {
                    customElements.define('ctm-image-info-tip', ImageInfoTip);
                }
            };

            customDefImageInfoTip();

            const propertiesAsHTML = this.cache[this.cursor].getPropertiesAsHTML();
            const imageInfoTip = new ImageInfoTip(propertiesAsHTML, event);

            document.body.appendChild(imageInfoTip);
        });

        this.addEventListener('mouseout', () => {

            const removeInstances = () => {
                const imageInfoTips = document.querySelectorAll('ctm-image-info-tip');
                if (imageInfoTips) {
                    imageInfoTips.forEach((imageInfoTip) => {
                        document.body.removeChild(imageInfoTip);
                    });
                }
            };

            removeInstances();
        });

        window.addEventListener('keydown', (event) => {
            event.preventDefault();
            this.navCache(event);
        });
    }
}