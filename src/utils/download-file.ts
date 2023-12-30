const downloadFile = (data: any, name = 'todos.xlsx') => {
  const url = URL.createObjectURL(data);
  const aTag = document.createElement('a');
  aTag.setAttribute('download', name);
  aTag.href = url;
  aTag.click();
};

export default downloadFile;
