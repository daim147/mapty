/*
Object.prototype.hello = function () {
  return `Hello ${this.firstName || "Person"}`;
};

const Person = function (firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  // console.log(this)
};
Person.prototype.calcAge = function () {
  return 2037 - (this.age || 50);
};

const Student = function (firstName, lastName,age, course) {
  // Now inhherit person class and using call to set (this) to person
  Person.call(this, firstName, lastName, age)
  // this.firstName = firstName
  // this.lastName = lastName
  // this.age = age;
  this.course = course
}

// Getting Person prototypes inherit so that student can alse use it now student.prototype will inherit Person.prototypes bye using Object.create() because protypes is simple object
Student.prototype = Object.create(Person.prototype)

// We will just assign Student.prototype = Person.prototype beacuse it will just copy paste it not inherit it 

// Student.prototype.__proto__ = Person.prototype

// we are updating student.prototype.introduction after object create beacuse it will make new empty object

Student.prototype.introduction = function () {
  return `Hello I am ${this.firstName}, I am Studying ${this.course}`
}

// Now making student.prototype.construtor to Student beacuse object.create have make it constructor to reflect Person beacuse consstructor is simply protottype property

Student.prototype.constructor = Student

const ibrahim = new Student('Ibrahim', 'Syed', '20','Web-Development')

console.log(ibrahim)

console.log(ibrahim.calcAge())

console.log(ibrahim.introduction())

console.log(Student.prototype)

console.log(ibrahim.__proto__ === Student.prototype)

console.log(Student.prototype === Person.prototype)

console.log(Student.prototype.__proto__ === Person.prototype)

console.log(Person.prototype.__proto__ === Object.prototype)

console.log(ibrahim instanceof Student)

console.log(ibrahim instanceof Person)

console.log(ibrahim instanceof Object)



// When new key word is use empty object is created and this is set to object created and ptototype is link to constructor which create object

const daim = new Person("Husnain", "Syed", 18);
const arslan = new Person("Arslan", "Syed", 30);

console.dir(Person);

console.log(daim);

console.log(daim.calcAge());

console.log(daim.__proto__.calcAge());

console.log(daim.hello());

console.log(Person.hello());

console.log(daim.hasOwnProperty("calcAge"));

console.log(daim.hasOwnProperty("firstName"));

console.log(daim.__proto__.__proto__.hasOwnProperty("hello"));

console.log(Person.prototype.isPrototypeOf(daim));

console.log(Object.prototype.isPrototypeOf(Person));

console.log(daim.__proto__.__proto__);

console.log(Person.prototype === daim.__proto__);

console.log(Person.prototype.constructor === Person);

console.log(Person.prototype.__proto__ === Object.prototype);

console.log(Object.prototype);

*/

/*
const check = function (name3) {
  console.log((this.name2 = name3));
  console.log(name2);
  console.log(this);
};
check("daimSyed", 45);

console.log(name2);
console.log(check.__proto__ === Function.prototype);
console.log(check.__proto__.__proto__ === Object.prototype)

const ali = {
  name: "hello",
  age: 89,
  calc(mm) {
    var gender = "male";
    ali.gender = gender;
    // this.name = 'hy'
    const hehe = () => {
      console.log(this, "inner");
    };
    hehe();
    console.log(this, mm);
  },
};

ali.calc.call(ali, "hello");
console.log(ali);

// We can not control this of Arrow Function in arrow function This will always refer to this of lexical enivorment in which it was created

*/

/*

// Clsses

class Person2{
    constructor(fullname, lastName, age){
        this.fullname = fullname
        this.lastName = lastName
        this.age = age
    }

    // prototype Inheritance / delegation

    calcAge() {
        return 2037 - this.age
    }

    greet(){
        return `Hello ${this.fullname}`
    }

    set fullname(name){
      console.log(name)
      this._fullname = name
    }

    get aged(){
      console.log('heyyy')
      return this.age
    }
    get fullname(){
      return `${this._fullname} ${this.lastName}`
    }
    // is not available on prototypes only on Class itself just like Number.parseFloat or Array.from()
    static returnAll(){
      console.log(this)
    }
}

class Student2 extends Person2{
  // if we have same argument as parent class not extra than we will not use constructor just use super()
  constructor(fullname, lastName, age, course){
    super(fullname, lastName, age)
    this.course = course
  }
  
  introduction(){
    return `Hey I am ${this.fullname} and I am Studing ${this.course}`
  }
}



const hassan = new Person2('Ayaz', 'Hassan', 15)

const muhammad = new Student2('Muhammad', 'Ali', 45, 'Graphic Designing')

console.log(muhammad)

console.log(muhammad.fullname)

console.log(muhammad.greet())

console.log(muhammad.calcAge())

console.log(muhammad.aged)

Person2.returnAll()

// console.log(hassan.fullname = 'Husnain Syed')

console.log(hassan.fullname)

console.log(hassan)

console.log(hassan.calcAge())

console.log(hassan.greet())

console.log(hassan.hasOwnProperty('firstName'))

console.log(Person2.prototype.hasOwnProperty('greet'))

console.log(Person2.prototype.constructor === Person2)

console.log(hassan.__proto__ === Person2.prototype)

console.log(hassan.__proto__)

console.log(hassan === Person2)

console.dir(Person2.__proto__) // is function so its prototype will be of object 

console.log(typeof(Person2)) // so its is function its proto tells us from which it is created so it will give us (Function.prototype)
console.log(Person2.__proto__ === Function.prototype)


console.log(typeof(Person2.prototype)) // so its object it  will tells about from which object it will created so (Object.prototype)
console.log(Person2.prototype.__proto__ === Object.prototype)

// Object protoype (prototye of any one return a object of all the methods or properties related from the constructor )

// and proto tells us from which (object , function or arrays) it is created

console.log(Person2.prototype.__proto__)

console.log(Object.prototype.__proto__)

console.log(typeof(Object))

console.log(typeof(Object.prototype))

console.dir(Object.__proto__) // is function so its prototype will be of object 

*/

/*

// Object.create()

// Its is use to set manually prototypes on object Object.create() !== constructor it is same like object and making another object from its using its method as prototypes but Person3.protoype in not mohsin.__proto__ because it just using its method and properties not making from it just like constructor object.create just set proto property of newly make object mohsin.__proto__ === Person3

const Person3 = {
  calcAge(){
    return 2037 - this.age
  },

  init(firstName, age){
    this.name = firstName
    this.age = age
    console.log(this)
  },
  get firstName(){
    // here this will work 
    return 'Hey ' + this.name
  },
  // in proprties this is not working beacuse here this is pointing to window not mohsin this will work in function call
  hello : 'Hey' + this.name,
  
}

const mohsin = Object.create(Person3)

const Student3 = Object.create(Person3)

Student3.init = function(firstName, age, course){
    Person3.init.call(this, firstName, age)
    this.course = course
}

Student3.calcAge = function(){
  return `Hello You are ${this.age}`
}

const raja  = Object.create(Student3)

console.log(raja)

raja.init('Raja', '25', 'Mechanical Engineering')

console.log(raja)

console.log(raja.calcAge())

console.log(Person3)

console.log(Student3)

console.log(Student3.__proto__ === Person3)

console.log(Person3.__proto__ === Object.prototype)

console.log(raja.__proto__ === Student3)

console.log(mohsin)

console.log(mohsin.__proto__ === Person3.prototype) // False

console.log(mohsin.__proto__ === Person3) // true

mohsin.init('Syed Mohsin', 18)

console.log(mohsin.hello)

console.log(mohsin.firstName)

*/