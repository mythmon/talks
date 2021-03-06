<meta class="title"/>

# Traits & Types

## in Rust

### @mythmon

---

# Rust's type system is worth knowing

An incomplete list of things the type system does:

* Error handling (Result and Option)
* Flow control (match, Result, Option)
* Operators (Add, Index, Deref)
* Memory management (Move, Copy, Clone)

> Rust's type system is one of its most important parts. The type system
> is the skeleton that supports Rust.

---

# Basic types - Inference

```rust
let greeting = "Hello, world!";
let count = 3;
for i in 0..count {
    println!("{}: {}", i, greeting);
}
```

> No types here, they are automatically detected.

---

# Basic types - Manual

```rust
let greeting: &str = "Hello, world!";
let count: i32 = 3;
for i in 0..count {
    println!("{}: {}", i, greeting);
}
```

> Specifying types can aid in the readability of programs.

---

# Built-in Types

## An incomplete list

* `bool`
* `char`
* Numeric types
* Arrays
* Slices
* Tuples
* `str`
* `&str`

> Briefly define each of these. Expect the audience to mostly be
> familiar with these.

---

# Numeric types

|             | Signed  | Unsigned | Floating |
|------------ | :-----: | :------: | :------: |
| **8**       | `i8`    | `u8`     | -        |
| **16**      | `i16`   | `u16`    | -        |
| **32**      | `i32`   | `u32`    | `f32`    |
| **64**      | `i64`   | `u64`    | `f64`    |
| **Machine** | `isize` | `usize`  | -        |

> Explain machine sizes. This isn't too important.

---

# A toy

```rust
fn toy(a: i32, b: i32) -> i32 {
    a + a + b
}

toy(3, 4); // 10
```

> Here is a simple little function for us to play with. It simply takes
> two integers, adds them together, and returns the sum. It works great.

---

# Breaking our toys

```rust
toy(2.5, 4.5);
```

```compiler
<anon>:1:9: 1:12 error: mismatched types:
 expected `i32`,
    found `_`
(expected i32,
    found floating-point variable) [E0308]
<anon>:1     toy(2.5, 4.5);
                 ^~~
```

> What if we try and call it with floats? Predictably, it breaks, since
> we said above that `toy` only works on `i32`s.

> One way to fix this would be to make another version of `toy` that
> works specifically on `f32` or `f64`. But that would be boring.

---

# Generics

```rust
fn toy<T>(a: T, b: T) -> T {
    a + a + b
}

toy(2.5, 4.5);
```

```compiler
<anon>:2:5: 2:6 error: binary operation `+` cannot be applied
                to type `T` [E0369]
<anon>:2     a + b
             ^
<anon>:2:5: 2:6 note: an implementation of `std::ops::Add`
                might be missing for `T`
```

> Luckily, Rust gives a simple solution. We can implement this function
> for a generic type, which we call `T`. Unfortunately, that doesn't work.

---

# Traits

<blockquote class="not-note">
    <p>
        A trait is a language feature that tells the Rust compiler about
        functionality a type must provide.
    </p>
    <cite>The Rust Book</cite>
</blockquote>

> Traits are how we can *constrain* a generic type. They allow us to put
> rules on the types that work in a function, and all this happens at
> compile time.

> In our toy example, we need to constrain `T` to only types that allow
> addition. For that, we have the `Add` trait.

---

# The `Add` Trait

This is a simplified version of the built-in `Add` trait.

```rust
pub trait Add {
    fn add(self, rhs: Self) -> Self;
}
```

---

# A generic toy

```rust
fn toy<T: Add>(a: T, b: T) -> T {
    a + a + b
}

toy(2.5, 4.5); // 9.5
```

> Adding type bounds to `T` makes `toy` work for many more types.

---

# Custom types

```rust
struct Complex {
    real: i32,
    imag: i32,
}

let c = Complex { real: 1, imag: 2 };
```

> `Complex` is a **struct**, a common way to create compound types. Structs by
> themselves have no behavior, and are only data.

---

# Methods for types

```rust
struct Complex { ... }

impl Complex {
    fn new(real: i32, imag: i32) -> Complex {
        Complex { real: real, imag: imag }
    }
}
```

> Any type can have methods implemented for it. Here we implement a
> **constructor** and a method named `toy`.

---

# Constructors

```rust
impl Complex {
    // ...

    fn zero() -> Complex {
        Complex { real: 0, imag: 0 }
    }
}
```

> Constructors are very common, but they are not a language feature,
> they are simply a pattern. You can have multiple constructors that
> take different data and have different behaviors.

---

# Implementing traits

```rust
impl Add for Complex {
    fn add(self, other: Complex) -> Complex {
        Complex::new(self.real + other.real,
                     self.imag + other.imag)
    }
}
```

> Types can have multiple impl blocks. Here we have two impl blocks, one
> for Complex specifically, and another for Add as a Complex.

---

# It works!

```rust
let c1 = Complex::new(1, 2);
let c2 = Complex::new(3, 4);

toy(c1, c2);  // 5+8i
```

> Now that we have implemented Add, we can use Complex numbers in our
> toy function.

---

# Custom traits

```rust
trait Shape {
    fn area(&self) -> f32;
}
```

> We can define custom traits

---

# Implementing custom traits

```rust
use std::f32::consts::PI;

struct Circle {
    radius: f32,
}

impl Shape for Circle {
    fn area(&self) -> f32 {
        PI * self.radius * self.radius
    }
}
```

> We can define implement traits for custom types.

---

# Implementing custom traits (cont.)

```rust
struct Square {
    side_length: f32,
}

impl Shape for Square {
    fn area(&self) -> f32 {
        self.side_length.powi(2)
    }
}
```

> We can implement the same trait for different types.

---

# Using custom traits

```rust
fn big_enough<T: Shape>(enclosure: &T) -> bool {
    enclosure.area() > 100.0
}

let c = Circle { radius: 10 };
let s = Square { side_length: 5 };

big_enough(&c); // true
big_enough(&s); // false
```

> And we can by polymorphic on our custom traits just like the built in ones.

---

# Trait coherence rules

```rust
use std::ops::Add;

impl Add for i32 {
    fn add(self, rhs: i32) -> i32 {
        self * 2
    }
}
```

> This doesn't work for two reasons
>
> * `Add` is already implemented for `i32`
> * We own neither `Add` nor `i32`

---

# Trait coherence rules (cont.)

```compiler
<anon>:3:1: 9:2 error: the impl does not reference any types
                defined in this crate; only traits defined in
                the current crate can be implemented for
                arbitrary types [E0117]

<anon>:3:1: 9:2 error: conflicting implementations of trait
                `core::ops::Add` for type `i32`: [E0119]
note: conflicting implementation in crate `core`
```

> There are complex rules dictating exactly when you can implement a trait for
> the type. A simple version is that you either have to own the trait or the
> the type.

---

# Useful types from the stdlib

* Option
* Result
* Vec
* HashMap

---

# `Option`

```rust
// Simplified definition of Option
enum Option<T> {
    None,
    Some(value: T),
}

fn get_directions(start: &Location, end: &Location) -> Option<Path> {
    ...
}
```

> * Either a value, or nothing
> * Similar to other langauages that return someting or `null`
> * Rust codifies this in the type system
> * This example gets the path between two places, or nothing

---

# `Result`

```rust
// Simplified definition of Result
enum Result<T, E> {
    Ok(value: T),
    Err(error: E),
}

fn ask_user_for_name() -> Result<String, IoError> {
    ...
}
```

> * Represents either a value or an error
> * Usually used with IO
> * With `Option` is `None` is a valid result
> * With `Result`, a lack of a value is an problem

---

# `Vec`

```rust
let squares: Vec<i32> = Vec::new();

for n in 0..10 {
    squares.push(n * 2);
}

println!("{}", squares[4]); // 16
```

> * No implementation here
> * Generic, ordered collection
> * Use them!

---

# `HashMap`

```rust
let offices: HashMap<u16, String> = HashMap::new();
offices.insert(123, "Jane Smith".to_string());
offices.insert(196, "Sarah Johnson".to_string());

println!("{}", offices[&196]); // Sarah Johnson
println!("{}", offices[&999]); // panic!
println!("{:?}", offices.get(&999)); // None
```

> * Generic key/value mappping
> * Pickier than other languages, due to type safety

---

# Useful traits from the stdlib

* From, Into
* FromStr
* Debug, Display

---

# `From` / `Into`

```rust
impl From<(i32, i32)> for Complex {
    fn from(pair: (i32, i32)) -> Complex {
        Complex::new(pair.0, pair.1);
    }
}

let c: Complex = (3, 4).into(); // Complex { real: 3, imag: 4 }
```

> From / Into are a pair that handle a lot of conversions between types.

---

# `From` / `Into` (cont.)

```rust
fn mandelbrot_iters<T>(c: Into<Complex>) -> u32 {
    let c = c.into();
    ...
}

mandelbrot_iters(Complex::new(1, 1));
mandelbrot_iters((1, 1));
```

> They are often used on the paramaters to functions that might take a
> variety of inputs, to make a friendlier API.

---

# `FromStr`

```rust
use std::io;

fn read<T>() -> T
    where T: FromStr,
{
    let mut buffer = String::new();
    io::stdin().read_line(&mut buffer).unwrap();
    buffer.trim().parse().unwrap()
}

let i: i32 = read();
let f: f32 = read();
```

> This is one of my favorite snippets. This is a function that reads some text
> from stdin, and then interprets as any value that can be parsed.

---

# `Debug` and `Display`

```rust
println!("{}", v); // v must be Display
println!("{:?}", v); // v must be Debug
```

> * traits used to format objects into strings
> * Opposite of FromStr

---

# Implementing `Debug` and `Display`

```rust
pub trait Debug {
    fn fmt(&self, fmt: &mut Formatter) -> Result<(), Error>;
}

pub trait Display {
    fn fmt(&self, fmt: &mut Formatter) -> Result<(), Error>;
}
```

> * `Debug` and `Display` both have one method, `fmt`, which takes a `Formatter`
> * Use methods to write data onto the formatter

---

# The `Display` trait

```rust
impl Display for Complex {
    fn fmt(&self, fmt: &mut Formatter) -> Result<(), Error> {
        try!(write!(fmt, "{}+{}i", self.real, self.imag))
    }
}
```

---

# Deriving `Debug`
```rust
#[derive(Debug)]
struct Complex {
    real: i32,
    imag: i32,
}

let c = Complex { real: 3, imag: 4 };
println!("{:?}", c); // "Complex { real: 3, imag: 4 }"
```

> * Debug can be automatically derived

---

<meta class="title"/>

# Questions?

---

<meta class="title"/>

# End

## @mythmon

---
