import { MatchGrid } from './matchGrid.js';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const colorFrontPicker = document.getElementById('colorFrontPicker');
  const colorBackPicker = document.getElementById('colorBackPicker');
  const fontPicker = document.getElementById('fontPicker');

  let frontColor = colorFrontPicker.value;
  let backColor = colorBackPicker.value;
  let selectedFont = fontPicker.value;
  let matchGrid;
  let args;

  colorFrontPicker.addEventListener('input', () => {
    frontColor = colorFrontPicker.value;
  });

  colorBackPicker.addEventListener('input', () => {
    backColor = colorBackPicker.value;
  });

  fontPicker.addEventListener('change', () => {
    selectedFont = fontPicker.value;
  });

  startButton.addEventListener('click', () => {
    const numColumnsInput = document.getElementById('numColumns');
    const numRowsInput = document.getElementById('numRows');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const timeLimitInput = document.getElementById('timeLimit');

    const numColumns = parseInt(numColumnsInput.value, 10);
    const numRows = parseInt(numRowsInput.value, 10);
    const width = parseInt(widthInput.value, 10);
    const height = parseInt(heightInput.value, 10);
    const timeLimit = parseInt(timeLimitInput.value, 10);

    args = {
      numColumns: numColumns,
      numRows: numRows,
      width: width,
      height: height,
      timeLimit: timeLimit,
      theme: {
        frontColor,
        backColor,
        font: selectedFont,
      },
    };

    if ((numColumns * numRows) % 2 !== 0) {
      alert('The number of cards must be even');
      return;
    }

    if (matchGrid) {
      matchGrid.reset();
    }

    matchGrid = new MatchGrid(args);

    matchGrid.start();
  });

  stopButton.addEventListener('click', () => {
    matchGrid.stop();
  });
});
