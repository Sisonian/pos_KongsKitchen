var doc = new jsPDF('p', 'mm', [80, 100]);

	
doc.addHTML($('#mybody')[0], 0, 0, {
  'background': '#fff',
}, function() {    
  doc.addFont('fonts/calibri.ttf', 'Calibri', 'normal');
  doc.setFont('Calibri');
  doc.setFontType("bold");
  doc.setFontSize(40);
  doc.save('purchase-order-summary.pdf');
});