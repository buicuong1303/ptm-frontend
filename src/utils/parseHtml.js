export default function (text) {
  let regex = /\n/g;
  return text.split('').map(function (line, index) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return line.match(regex) ? <br key={'key_' + index} /> : line;
  });
}
