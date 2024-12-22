export function generateExpenseCSV(trip, expenses, participants) {
  // Create participants lookup
  const participantsMap = {};
  participants.forEach(p => {
    participantsMap[p.id] = p.name;
  });

  // Calculate totals and balances
  const splitExpenses = expenses.filter(e => e.splitType === 'split');
  const totalSplit = splitExpenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonSplit = participants.length > 0 ? totalSplit / participants.length : 0;

  // Create participant balances
  const balances = {};
  participants.forEach(p => {
    balances[p.id] = {
      paid: expenses.filter(e => e.paidBy === p.id)
        .reduce((sum, e) => sum + e.amount, 0),
      owes: perPersonSplit
    };
    balances[p.id].balance = balances[p.id].paid - balances[p.id].owes;
  });

  // Generate CSV content
  let csvContent = [];

  // Trip information
  csvContent.push(['Trip Details']);
  csvContent.push(['Name', trip.name]);
  csvContent.push(['Start Date', new Date(trip.startDate).toLocaleDateString()]);
  csvContent.push(['End Date', new Date(trip.endDate).toLocaleDateString()]);
  csvContent.push([]);

  // Participant balances
  csvContent.push(['Participant Balances']);
  csvContent.push(['Name', 'Paid', 'Owes', 'Balance']);
  participants.forEach(p => {
    const balance = balances[p.id];
    csvContent.push([
      p.name,
      balance.paid.toFixed(2),
      balance.owes.toFixed(2),
      balance.balance.toFixed(2)
    ]);
  });
  csvContent.push([]);

  // Expenses
  csvContent.push(['Expenses']);
  csvContent.push(['Date', 'Description', 'Amount', 'Paid By', 'Type']);
  expenses.forEach(expense => {
    csvContent.push([
      new Date(expense.date).toLocaleDateString(),
      expense.description,
      expense.amount.toFixed(2),
      participantsMap[expense.paidBy],
      expense.splitType === 'split' ? 'Split Equally' : 'Individual'
    ]);
  });

  // Convert to CSV string
  const csvString = csvContent
    .map(row => row.map(cell => {
      // Handle cells that might contain commas
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','))
    .join('\n');

  return csvString;
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create downloadable link
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
