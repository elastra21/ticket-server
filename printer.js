const config = require('./config');
const ThermalPrinter = require('node-thermal-printer').printer;

// const articulos = [
//   {name:"Copa 12oz", qty:1, price:100.20},
//   {name:"Vaso 16oz", qty:1, price:100.50},
//   {name:"Michelada", qty:1, price:100.60},
//   {name:"Souvenir", qty:1, price:100.70}
// ]

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

async function printReceipt(articulos) {
  const printer = new ThermalPrinter(config.printerConfig);

  const isConnected = await printer.isPrinterConnected();
  if (!isConnected) return false;
  console.log('Printer connected:', isConnected);


  printer.alignCenter();
  printer.newLine();
  await printer.printImage(config.images.logo);
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

  printer.tableCustom(config.tableHeaders);
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
  await printer.printImage(config.images.qrApp);
  printer.println('Descarga Chikilla RTT para');
  printer.println('Android y Apple así');
  printer.println('siempre sabrás lo que');
  printer.println('tenemos conectado.');

  printer.cut();

  try {
    await printer.execute();
    console.log('Print success.');
    return true;
  } catch (error) {
    console.error('Print error:', error);
    return false;
  }
}

module.exports = {getTime, printReceipt};
