export class ImageCtxMenu {
    constructor(event, imageData) {
        this.event = event;
        this.imageData = imageData;
        
        // only one ctxmenu is seen at a time
        removeCMIfExists();
        this.createCMElement();
    }

    getOpts() {
        return [
            "Properties",
            "Select",
            "Caption",
            "Add Tag",
            "Add Tag To Selected",
            "Remove Tag",
            "Remove Tag From Selected",
            "Replace Tag",
            "Replace Tag in Selected",
            "Rename Image",
            "Delete Image",
            "Delete Selected",
            "Download Image",
            "Save Image"
        ];
    }

    createCMElement() {
        this.cmelem = document.createElement("ul");

        this.cmelem.className = "contextmenu";
        this.cmelem.style.position = "absolute";
        this.cmelem.style.left = this.event.pageX + "px";
        this.cmelem.style.top = this.event.pageY + "px";

        const opts = this.getOpts();

        for (const opt of opts) {
            const li = document.createElement("li");
            li.textContent = opt;
            li.addEventListener('click', (event) => {
                this.callAction(opt, li);
            });

            this.cmelem.appendChild(li);
        }
        document.body.appendChild(this.cmelem);
    }

    callAction(opt, li) {
        switch (opt) {
            case "Properties":
                console.log(li);

                const properties = this.imageData.stringify();
    
                alert(properties);
    
                break;
    
            case "Caption":
                console.log(li);
    
                const newCaption = prompt("Enter a new caption for the image:");
                this.imageData.addCaption(newCaption);
    
                break;
    
            case "Add Tag":
                console.log(li);
                
                const tagToAdd = prompt("Enter a new tag for the image");
                this.imageData.addTag(tagToAdd);
    
                break;
            
            case "Remove Tag":
                console.log(li); // remove li
    
                const tagToRmv = prompt("Enter tag to remove from the image");
                this.imageData.removeTag(tagToRmv);
    
                break;
            
            case "Replace Tag":
                console.log(li); // replace li
    
                const oldTag = prompt("Enter old tag.");
                const newTag = prompt("Enter new tag.");
                this.imageData.replaceTag(oldTag, newTag);
                break;
    
            case "Rename Image":
                break;
    
            case "Delete Image":
                console.log(li); // delete li

                this.imageData.galleryOS.deleteOne(this.imageData);
    
                break;

            case "Delete Selected":
                console.log(li);
                this.imageData.galleryOS.deleteSelected();
                break;
    
            case "Download Image":
                console.log(li);
                this.imageData.downloadImage();
    
                break;
    
            case "Select":
                this.imageData.galleryOS.addToSelected(this.imageData);
                this.imageData.galleryOS.markSelected(this.imageData);
            
                break;
        } // switch
    }

}

export function removeCMIfExists() {
    const existing = document.querySelector(".contextmenu");
    if (existing) {
        document.body.removeChild(existing);
    }
}