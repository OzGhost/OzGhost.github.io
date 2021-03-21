'use strict'

class Shipper {
  constructor(uri) {
    this.uri = uri;
    this.method = 'GET';
    this.rsType = 'json';
  }

  asGet() {
    this.method = 'GET';
    this.data = null;
    return this;
  }

  asPost(data) {
    this.method = 'POST';
    this.data = data;
    return this;
  }

  asPut(data) {
    this.method = 'PUT';
    this.data = data;
    return this;
  }

  asDelete() {
    this.method = 'DELETE';
    return this;
  }

  send() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(this.method, this.uri, true);
      xhr.responseType = 'json';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject();
          }
        }
      }
      xhr.send(this.data);
    })
  }
}

export default Shipper;
