// Main.java
public class Main {
    public static void main(String[] args) {
        // Create two Dog objects using the correct constructor
        Dog dog1 = new Dog("Buddy", "Canine", 3, "Golden Retriever");
        Dog dog2 = new Dog("Max", "Canine", 5, "German Shepherd");

        // Display information using both methods
        System.out.println("=== Dog 1 ===");
        dog1.displaying();
        dog1.bark();

        System.out.println("\n=== Dog 2 ===");
        dog2.displaying();
        dog2.bark();
    }
}