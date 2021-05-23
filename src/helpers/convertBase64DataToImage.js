
export const convertBase64DataToImageUrl = data => {
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  let image = new Blob([byteArray], { type: 'image/jpeg' });
  return URL.createObjectURL(image);
}