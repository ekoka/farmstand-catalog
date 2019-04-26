export function urlbase64decode(str) {
  var output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  var result = window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
  try{
    return decodeURIComponent(escape(result));
  } catch (err) {
    return result;
  }
}

export function parseJwt (token) {
    //var base64Url = token.split('.')[1];
    var base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
};
