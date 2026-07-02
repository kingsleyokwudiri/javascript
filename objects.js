/*
      const product = {
        name: "socks",
        price: 1090,
      };
      console.log(product);
      console.log(product.name);*/
      const product2 = {
        name: 'shirt',
        'delivery-time': '1 day',
        rating: {
          stars: 4.5,
          count: 87
        }, 
        fun: function function1 () {
          console.log('function inside object')
        }
      };
      console.log(product2);
      console.log(product2.name);
      console.log(product2['name']);
      console.log(product2['delivery-time'])
      console.log(product2.rating)
      product2.fun();
      console.log(typeof Math.random)
      // JSON: JavaScript Object Notation
      // converts a javascript object into json
      console.log(JSON.stringify(product2));
      // converts a json object into javascript object
      JSON.parse(JSON.stringify(product2));
      const jsonString = JSON.stringify(product2);
      console.log(JSON.parse(jsonString));
      
      