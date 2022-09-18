import { SimpleGrid } from "./grid.module.js";
const gridContainer = document.getElementById("gridContainer");
const gridItemList = document.querySelector(".grid-item-list");
const gridInfo = {
    itemWidth : 100,
    itemHeight: 100,
    itemPadding: 10
}

const simpleGrid = new SimpleGrid( gridContainer, gridItemList, gridInfo );
