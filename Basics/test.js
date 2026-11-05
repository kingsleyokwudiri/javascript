class Counter {
  constructor(count = 0) {
    this.count = count;
  }
  increment() {
    this.count = this.count + 1;
    console.log(this.count);
  }
  reset() {
    this.count = 0;
    console.log(this.count);
  }
}
const counter = new Counter(4);
const counter2 = new Counter(4);

counter.increment();
counter.reset();
counter2.reset();

// area is both a method, and an instance property
// on the second call, the instance already has an area property, so the method is no longer accessible
// never assign a property with the same name as a method on the same object

// super must be called before you use "this" in a child class
class Employee {
  constructor(name) {
    this.name = name;
  }
}
class Manager extends Employee {
  constructor(name, team) {
    super(name);
    this.team = team;
  }
}
// console.log(t) outputs the contents of "t" itself,
// while console.log(t.toString()) outputs the string representation of "t"
// as defined by its toString() method.
