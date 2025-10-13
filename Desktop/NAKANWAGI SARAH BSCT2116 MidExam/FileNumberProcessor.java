
// FileNumberProcessor.java
import java.util.*;
import java.io.*;

public class FileNumberProcessor {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayList<Integer> numbers = new ArrayList<>();

        try {
            // Step 1: Get 5 integers from user
            System.out.println("Enter 5 integers:");
            for (int i = 0; i < 5; i++) {
                boolean validInput = false;
                while (!validInput) {
                    try {
                        System.out.print("Enter number " + (i + 1) + ": ");
                        int number = Integer.parseInt(scanner.nextLine());
                        numbers.add(number);
                        validInput = true;
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid input! Please enter a valid integer.");
                    }
                }
            }

            // Step 2: Save numbers to file
            saveNumbersToFile(numbers);

            // Step 3: Read numbers and perform calculations
            processFileNumbers();

        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }

    private static void saveNumbersToFile(ArrayList<Integer> numbers) {
        try (PrintWriter writer = new PrintWriter(new FileWriter("numbers.txt"))) {
            for (int number : numbers) {
                writer.println(number);
            }
            System.out.println("Numbers successfully saved to numbers.txt");
        } catch (IOException e) {
            System.out.println("Error writing to file: " + e.getMessage());
        }
    }

    private static void processFileNumbers() {
        try (Scanner fileScanner = new Scanner(new File("numbers.txt"))) {
            ArrayList<Integer> fileNumbers = new ArrayList<>();
            int sum = 0;

            while (fileScanner.hasNextLine()) {
                try {
                    int number = Integer.parseInt(fileScanner.nextLine());
                    fileNumbers.add(number);
                    sum += number;
                } catch (NumberFormatException e) {
                    System.out.println("Warning: Invalid number format in file. Skipping line.");
                }
            }

            if (fileNumbers.isEmpty()) {
                System.out.println("No valid numbers found in file.");
                return;
            }

            displayResults(fileNumbers, sum);

        } catch (FileNotFoundException e) {
            System.out.println("Error: File 'numbers.txt' not found.");
        }
    }

    private static void displayResults(ArrayList<Integer> numbers, int sum) {
        System.out.println("\n=== CALCULATION RESULTS ===");
        System.out.println("Numbers processed: " + numbers);
        System.out.println("Sum: " + sum);

        if (numbers.size() > 0) {
            double average = (double) sum / numbers.size();
            System.out.printf("Average: %.2f%n", average);
        } else {
            System.out.println("Cannot calculate average: No numbers available.");
        }
    }
}