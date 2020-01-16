function getBigImage(url) {
  if (!url)
    return null;
  if (url.includes('@')) {
    const splitted = url.split('@');
    splitted[splitted.length - 1] = '._V1_SY1000_CR0,0,674,1000_AL_.jpg';
    return splitted.join('@');
  }
  const splitted = url.split('.');
  splitted[splitted.length - 2] = '_V1_SY1000_CR0,0,674,1000_AL_';
  return splitted.join('.');
}
module.exports = { getBigImage };
