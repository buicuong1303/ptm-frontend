export function readAsArrayBuffer(file) {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      if (
        file.type.split('/')[0] === 'image' &&
        file.type !== 'image/tif' &&
        file.type !== 'image/tiff'
      ) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = function () {
          URL.revokeObjectURL(image.src);
          return resolve({
            data: fileReader.result,
            name: file.name || '',
            size: file.size,
            type: file.type,
            height: this.height,
            width: this.width
          });
        };
      } else {
        return resolve({
          data: fileReader.result,
          name: file.name || '',
          size: file.size,
          type: file.type,
          height: null,
          width: null
        });
      }
    };
    // fileReader.readAsBinaryString(file);
    fileReader.readAsArrayBuffer(file);
  });
}
