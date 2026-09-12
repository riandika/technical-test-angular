const max = 30;

for (let i = 1; i <= max; i++) {
  let result = i.toString();

  if (i % 4 === 0) {
    result = 'Unictive';

    if (i % 14 === 0) {
      result += ' Media';
    }
  }

  console.log(result);
}
