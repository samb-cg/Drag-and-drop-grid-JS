class SimpleGrid{

    constructor( container, items, itemInfo){

        this.gridContainer = container;
        this.gridList = items;
        this.itemWidth = itemInfo.itemWidth;
        this.itemHeight = itemInfo.itemHeight;
        this.itemPadding = itemInfo.itemPadding;
        this.hoverWidth = this.itemWidth * 1.06;
        this.hoverHeight = this.itemHeight * 1.06;

        this.containerHeight = this.gridContainer.clientHeight - ( this.itemWidth );
        this.containerHeight += this.gridContainer.offsetTop;

        this.moveTarget;
        this.mouse = { x: 0, y: 0 };
        this.gridArr = [];

        this.createGrid();

    }

    createGrid(){

        let rows = Math.floor(this.gridContainer.clientHeight / ( this.itemHeight + this.itemPadding ));
        
        let cols = Math.floor(this.gridContainer.clientWidth / ( this.itemWidth + this.itemPadding ));
        
        let totalItems = rows * cols;
    
        this.gridContainer.style.width = cols * (this.itemWidth+this.itemPadding) + this.itemPadding +  "px";
    
        let xPos = this.gridContainer.offsetLeft + this.itemPadding;
        let yPos = this.gridContainer.offsetTop + this.itemPadding;
        
        

        for( let i = 0; i < totalItems; i++ ){
    
            if( yPos > this.containerHeight ){
                xPos += this.itemWidth + this.itemPadding;
                yPos = this.gridContainer.offsetTop + this.itemPadding;
            }
    
            let tempObj = {};
            tempObj.x = xPos;
            tempObj.y = yPos;
            tempObj.taken = false;
            this.gridArr.push( tempObj );  
            yPos += this.itemHeight + this.itemPadding;
    
        }

        this.initGridItems();
    }

    // Loop through all HTML items and add the to the grid array.
    initGridItems(){

        let l = this.gridList.children.length;
        for (let i = 0; i < l; i++) {

            this.addItemToGrid( i, this.gridList.children[ i ] );
            this.addEvent( this.gridList.children[ i ].children[ 0 ] );

        }
    
    }

    // Set the HTML item's initial position accordingly to it's grid index.
    addItemToGrid( indx, itemElem ){

        let id = itemElem.attributes.id.value;
        this.gridArr[ indx ].taken = true;
        this.gridArr[ indx ].id = id;

        itemElem.style.left = this.gridArr[ indx ].x + "px";
        itemElem.style.top = this.gridArr[ indx ].y + "px";
        itemElem.style.width = this.itemWidth + "px";
        itemElem.style.height = this.itemHeight + "px";

    }
        
    // Add the mouse events to a HTML item.
    addEvent( itemElem ){

        this.eventBinder = this.setMousePos.bind( this );

        itemElem.onmousedown = (e) => {

            this.moveTarget = e.target.parentNode.parentNode;
            this.moveTarget.style.zIndex = "2";
            this.moveTarget.style.width = this.hoverWidth + "px";
            this.moveTarget.style.height = this.hoverHeight + "px";
            this.moveTarget.classList.add("grid-shadow");
            this.gridContainer.addEventListener( "mousemove", this.eventBinder );

        }

        itemElem.onmouseup = () => {

            this.gridContainer.removeEventListener( "mousemove", this.eventBinder );
            this.handleMouseUp();
            this.moveTarget.style.zIndex = "1";
            this.moveTarget.style.width = this.itemWidth + "px";
            this.moveTarget.style.height = this.itemHeight + "px";
            this.moveTarget.classList.remove("grid-shadow");
            this.moveTarget = 0;

        }

    }

    // On mouse down set the target item's position to the mouse coördinates.
    setMousePos( e ){
 
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        //this.mouse.y += scrollY;

        this.moveTarget.style.left = this.mouse.x - ( this.itemWidth / 2 ) + "px";
        this.moveTarget.style.top = this.mouse.y + scrollY - 10 + "px";

    }

    // On mouse up get the target position for the grid item and check if it is not taken.
    handleMouseUp(){

        let indx = this.getTargetGridPos();
        let collision;
        
        indx < 0 || indx > this.gridArr.length ? collision = true : collision = this.gridArr[ indx ].taken;

        collision ? this.snapToOld( indx ) : this.snapToNew( indx );

    }

    // Get the index of the grid item array.
    getTargetGridPos(){

        // On what grid column is the mouse X value.
        let col = Math.floor( ( this.mouse.x - this.gridContainer.offsetLeft ) / ( this.itemWidth + this.itemPadding ) );
        
        // Amount of rows multiplied by column value. 
        let rowsInCol = Math.round( ( this.gridContainer.clientHeight - this.itemHeight ) / ( this.itemHeight ) );
        
        col = rowsInCol * col;

        // Account for the mouse scrolling.
        let mouseOffset = scrollY - this.gridContainer.offsetTop + this.itemHeight;

        // On what row is the mouse Y value.
        let row = Math.round( ( this.mouse.y + mouseOffset) / ( this.itemHeight + this.itemPadding ) );

        return col + row - 1;

    }

    // Loop through grid array and compare if the ID is equal to the item.
    getOldGridPos(){

        let tarID = this.moveTarget.attributes.id.value;
        let l = this.gridArr.length;
        
        let oldIndx;
        
        for( let i = 0; i < l; i++ ){
            if( this.gridArr[ i ].id === tarID ){

                oldIndx = i;
                break;

            }
        }
        
        return oldIndx;

    }

    // When the target item position is already taken.
    snapToOld( ){

        let oldIndx = this.getOldGridPos();
        this.moveTarget.style.left = this.gridArr[ oldIndx ].x + "px";
        this.moveTarget.style.top = this.gridArr[ oldIndx ].y + "px";

    }

    // When the target item position is not taken.
    snapToNew( indx ){

        this.moveTarget.style.left = this.gridArr[ indx ].x + "px";
        this.moveTarget.style.top = this.gridArr[ indx ].y + "px";

        // Set old position taken to false.
        let oldIndx = this.getOldGridPos();
        this.gridArr[ oldIndx ].taken = false;
        this.gridArr[ oldIndx ].id = "no";

        this.gridArr[ indx ].taken = true;
        this.gridArr[ indx ].id = this.moveTarget.attributes.id.value;

    }

}

export {SimpleGrid};
