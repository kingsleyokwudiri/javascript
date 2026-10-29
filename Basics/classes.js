// a class is a blueprint for creating objects that share the same structure and behavior.
// this refers to the specific object being created or used. user1.name and user2.name are separate.

// class User {
//   constructor(name, email) {
//     this.name = name;
//     this.email = email;
//   }
//   greet() {
//     console.log(
//       `Hello, my name is ${this.name} and my email is ${this.email}.`,
//     );
//   }
// }

// const user1 = new User("Kingsley", "kingsley@example.com");
// const user2 = new User("David", "david@example.com");

// user1.greet();
// user2.greet();

// class BankAccount {
/*
class BankAccount {
	constructor(owner, balance = 0) {
		this.owner = owner;
		this.balance = balance;
	}
	deposit(amount) {
		this.balance += amount;
		return this.balance;
	}
	withdraw(amount) {
		if (amount > this.balance) {
			throw new Error("Not enough money, brokie.");
		}
		this.balance -= amount;
		return this.balance;
	}
}

const userBankAccount = new BankAccount("Kingsley", 100);
userBankAccount.deposit(10000);
userBankAccount.withdraw(5000);
console.log(userBankAccount.balance);
*/

// class Animal {
//   constructor(name) {
//     this.name = name;
//   }
//   speak() {
//     console.log(`${this.name} makes a sound`);
//   }
// }

// class Dog extends Animal {
//   constructor(name, breed) {
//     // runs Animal's constructor first
//     // super(...) must be called before you use "this" in a child class constructor
//     super(name);
//     this.breed = breed;
//   }
//   speak() {
//     // overrides Animal's speak()
//     console.log(`${this.name} barks`);
//   }
// }

// const cat = new Animal("Tom");
// console.log(cat.name);
// cat.speak();
// const rex = new Dog("Rex", "Husky");
// rex.speak();

// class ApiClient {
//   constructor(baseUrl) {
//     this.baseUrl = baseUrl;
//   }
//   async getJson(path) {
//     const response = await fetch(this.baseUrl + path);
//     if (!response.ok) throw new Error(`HTTP ${response.status}`);
//     return response.json();
//   }
// }

// const api = new ApiClient("https://jsonplaceholder.typicode.com");
// api.getJson("/users/1").then((user) => console.log(user.name));

class Task {
  constructor(title, done = false) {
    this.title = title;
    this.done = done;
  }
  complete() {
    this.done = true;
  }
  toString() {
    return "[] Buy milk";
  }
}

const task = new Task("HHHHH");
