const ThermalPrinter = require('node-thermal-printer').printer;
const Types = require('node-thermal-printer').types;

const articulos = [
  {name:"Copa 12oz", qty:1, price:100.20},
  {name:"Vaso 16oz", qty:1, price:100.50},
  {name:"Michelada", qty:1, price:100.60},
  {name:"Souvenir", qty:1, price:100.70}
]

function twoDigits(value) {
  return value < 10 ? "0" + value : value;
}

function getTotal(){
    return articulos
      .map((item) => item.price)
      .reduce((acc, amount) => acc + amount)
}

function getTime(){
  const time = new Date();
  return (
    time.getFullYear() +
    "/" +
    (time.getMonth() + 1) +
    "/" +
    time.getDate() +
    " " +
    time.getHours() +
    ":" +
    twoDigits(time.getMinutes())
  );
}

function fixNumber(number){
  return String(number.toFixed(2));
}

async function example() {
  const printer = new ThermalPrinter({
    type: Types.EPSON, // 'star' or 'epson'
    interface:  'printer:SAM4S GIANT-100',
    options: {
      timeout: 1000,
    },
    width: 42, // Number of characters in one line - default: 48
    characterSet: 'SLOVENIA', // Character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: '-', // Use custom character for drawing lines - default: -
    driver: require('@thiagoelg/node-printer'),
  });

  const isConnected = await printer.isPrinterConnected();
  console.log('Printer connected:', isConnected);

  printer.alignCenter();
  printer.newLine();
  await printer.printImage('./assets/olaii-logo-black-small.png');
  printer.newLine();
  printer.println('Chikilla Craft Beer');
  printer.newLine();
  printer.alignLeft();
  printer.setTypeFontB();
  printer.println('Av. Moctezuma #479');
  printer.println('C.P. 22800');
  printer.println('Ensenada, BC, MX');

  

  printer.println('María Teresa Murillo Torres');
  printer.println('RFC: MUTT731015T93');

  printer.setTypeFontA();
  printer.newLine();
  printer.leftRight('Cuenta', getTime());
  printer.drawLine();

  printer.tableCustom([
    { text: 'Articulos', align: 'LEFT', cols: 24, bold: true },
    { text: 'Cant.', align: 'CENTER', cols: 9, bold: true },
    { text: 'Precio', align: 'RIGHT', cols: 10, bold: true },
  ]);
  printer.drawLine();

  articulos.forEach(item => {
    printer.tableCustom([
      { text: item.name, align: 'LEFT', cols: 24 },
      { text: item.qty, align: 'CENTER', cols: 9 },
      { text: `$${fixNumber(item.price)}`, align: 'RIGHT', cols: 10 },
    ]);
  })

  printer.drawLine();
  printer.newLine();
  printer.tableCustom([
    { text: '', align: 'LEFT', cols: 24 },
    { text: 'I.V.A', align: 'CENTER', cols: 9},
    { text: `$${fixNumber(0)}`, align: 'RIGHT', cols: 10 },
  ]);
  printer.tableCustom([
    { text: '', align: 'LEFT', cols: 24 },
    { text: 'Total', align: 'CENTER', cols: 9, bold: true },
    { text: `$${fixNumber(getTotal())}`, align: 'RIGHT', cols: 10, bold: true },
  ]);


  printer.alignCenter();
  printer.newLine();
  printer.newLine();
  printer.println('Síguenos en Facebook e Instagram');
  await printer.printImage('./assets/qr-code.png');
  printer.println('Descarga Chikilla RTT para');
  printer.println('Android y Apple así');
  printer.println('siempre sabrás lo que');
  printer.println('tenemos conectado.');
  // printer.println('Dános like en Facebook');

  // printer.table(['Art.', 'Cant', 'Precio']);

  // printer.upsideDown(true);
  // printer.println('Hello World upside down!');
  // printer.upsideDown(false);
  // printer.drawLine();

  // printer.invert(true);
  // printer.println('Hello World inverted!');
  // printer.invert(false);

  // printer.drawLine();

  // printer.drawLine();  
  // printer.println('Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé');
  // printer.drawLine();

  // printer.setTypeFontB();
  // printer.println('Type font B');
  // printer.setTypeFontA();
  // printer.println('Type font A');
  // printer.drawLine();

  // printer.alignLeft();
  // printer.println('This text is on the left');
  // printer.alignCenter();
  // printer.println('This text is in the middle');
  // printer.alignRight();
  // printer.println('This text is on the right');
  // printer.alignLeft();
  // printer.drawLine();

  // printer.setTextDoubleHeight();
  // printer.println('This is double height');
  // printer.setTextDoubleWidth();
  // printer.println('This is double width');
  // printer.setTextQuadArea();
  // printer.println('This is quad');
  // printer.setTextSize(7, 7);
  // printer.println('Wow');
  // printer.setTextSize(0, 0);
  // printer.setTextNormal();
  // printer.println('This is normal');
  // printer.drawLine();

  // try {
  //   printer.printBarcode('4126570807191');
  //   // printer.code128('4126570807191', {
  //   //   height: 50,
  //   //   text: 1,
  //   // });
  //   printer.beep();
  // } catch (error) {
  //   console.error(error);
  // }

  // printer.pdf417('4126565129008670807191');
  // printer.printQR('https://olaii.com');

  // printer.newLine();

  // printer.leftRight('Left', 'Right');

  // printer.table(['One', 'Two', 'Three', 'Four']);

  // printer.tableCustom([
  //   { text: 'Left', align: 'LEFT', width: 0.5 },
  //   {
  //     text: 'Center', align: 'CENTER', width: 0.25, bold: true,
  //   },
  //   { text: 'Right', align: 'RIGHT', width: 0.25 },
  // ]);


  printer.cut();
  // printer.openCashDrawer();

  try {
    await printer.execute();
    console.log('Print success.');
  } catch (error) {
    console.error('Print error:', error);
  }
}

example();
