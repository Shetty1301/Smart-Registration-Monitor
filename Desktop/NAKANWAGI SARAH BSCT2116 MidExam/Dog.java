// Dog.java
public class Dog extends Animal {
    private String breed;

    // Constructor with four parameters
    public Dog(String name, String species, int age, String breed) {
        super(name, species, age); // Call parent constructor
        this.breed = breed;
    }

    // Bark method
    public void bark() {
        System.out.println("Woof! I am a " + breed + ".");
    }

    // Override display method to include breed
    @Override
    public void displaying() {
        super.displaying(); // Call parent display method
        System.out.println("Breed: " + breed);
    }

    // Getter and setter for breed
    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }
}