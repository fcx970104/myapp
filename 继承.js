console.log('---------------------------------------继承----------------------------------------------')
function Parent() {
  this.name = 'parent5';
  this.play = [1, 2, 3];
}
function Child() {
  Parent.call(this);
  this.type = 'child5';
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
var s3 = new Child();
var s4 = new Child();
console.log(s3.__proto__ === Child.prototype, s3.__proto__.__proto__ === Parent.prototype, s3.__proto__.__proto__.__proto__ === Object.prototype) //true true true
console.log(s3 instanceof Parent, s3 instanceof Child)
console.log('-----------------------------------------------------------------------------------------')
function M1() {
  this.hello = 'hello';
}
function M2() {
  this.world = 'world';
}
function m() {
  M1.call(this);
  M2.call(this);
}
m.prototype = Object.create(M1.prototype);
// Object.assign(m.prototype, M2.prototype);
m.prototype = { ...m.prototype, ...M2.prototype };
let mm = new m();
console.log(mm.hello, mm.world)
console.log('-----------------------------------------------------------------------------------------')