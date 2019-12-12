function Animal(name) {
  this.name = name;
}
Animal.prototype.color = 'white';

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

console.log(cat1.__proto__ === cat2.__proto__, cat1.__proto__ === Animal.prototype, cat1.__proto__)  //true  true   Object {constructor: ,color:'white'}
console.log(Animal.prototype, Object.prototype)        //Object {constructor: ,color:'white'}  Object {constructor: , __defineGetter__: , __defineSetter__: , hasOwnProperty: , __lookupGetter__: , …}
// cat1.__proto__.__proto__ = Animal.prototype.__proto__ = Function.prototype.__proto__ = Object.prototype
console.log(Function.prototype.__proto__.__proto__)  // null


console.log(cat1.__proto__.constructor === Animal.prototype.constructor, cat1.__proto__.constructor === Animal)  //true  true        Animal
console.log(cat1.__proto__.__proto__.constructor, Animal.prototype.__proto__.constructor, Function.prototype.__proto__.constructor === Object)   // Object