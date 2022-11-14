const Types = require('node-thermal-printer').types; 

module.exports = {
  printerConfig: {
    type: Types.EPSON, // 'star' or 'epson'
    interface: "printer:SAM4S GIANT-100",
    options: {
      timeout: 1000,
    },
    width: 42, // Number of characters in one line - default: 48
    characterSet: "SLOVENIA", // Character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "-", // Use custom character for drawing lines - default: -
    // driver: require("@thiagoelg/node-printer"),
  },
  tableHeaders: [
    { text: 'Articulos', align: 'LEFT', cols: 24, bold: true },
    { text: 'Cant.', align: 'CENTER', cols: 9, bold: true },
    { text: 'Precio', align: 'RIGHT', cols: 10, bold: true },
  ],
  images:{
    logo:"../assets/olaii-logo-black-small.png",
    qrApp:"../assets/qr-code.png"
  }
};
