const encodeFileToBase64 = (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reader.onload = (event: any) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
  });
};

export default encodeFileToBase64;