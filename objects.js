/*
      const product = {
        name: "socks",
        price: 1090,
      };
      console.log(product);
      console.log(product.name);
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
      */
console.log('hello'.length);
console.log('hello'.toUpperCase());
const object1 = {
  message: 'hello',
}
const object2 = object1;
object1.message = 'Good job';
console.log(object1);
console.log(object2);
const object3 = {
  message: 'Good job!',
}
console.log(object3 === object1);
console.log(object2 === object1);

const object4 = {
  message: 'Good job!',
  price: 799,
  damage: 77
}
// const message = object4.message
// destructuring: takes properties from an object and assigns them to variables
const { message, price, damage } = object4;
console.log(message);
console.log(price);
console.log(damage)
const object5 = {
  // message: message,
  message,
  method: function function1() {
  console.log('method');
  },
  method() {
    console.log('method');
  },
  func() {
    console.log('function');
  }
}
console.log(object5);
object5.method();
object5.func();



const object6 = {
  name: 'basketball',
  price: 2095
}
// dot notation
object6.price += 500;
// bracket notation
object6['delivery-time'] = '3 days';
console.log(object6);
function comparePrice (product1, product2) {
  if (product1.price > product2.price) {
    return product2;
  } else if (product1.price < product2.price) {
    return product1;
  } else {
    return 'equal price';
  }
}

const productA = {
  name: 'laptop',
  price: 50000
};

const productB = {
  name: 'mouse',
  price: 500
};

console.log(comparePrice(productA, productB));

function isSameProduct (product1, product2) {
  if (product1.price === product2.price && product1.name === product2.name) {
    return true;
  } else {
    return false;
  }
}
  const product1 = {
    name: 'sugar',
    price: 100
  }
  const product2 = {
    name: 'milk',
    price: 400
  }
  

isSameProduct('milk', 'milk');
console.log(isSameProduct(product1, product2));
console.log('Hello'.repeat(4));